import { getUserInfo } from '@/shared/models/user';
import { getRemainingCredits } from '@/shared/models/credit';
import { createAITask, NewAITask } from '@/shared/models/ai_task';
import { getUuid } from '@/shared/lib/hash';
import { AITaskStatus } from '@/extensions/ai';

// Ensure this route runs on Node.js runtime (not Edge) and can be configured for longer runs on platforms like Vercel.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const EVOLINK_BASE = 'https://api.evolink.ai/v1beta';

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.EVOLINK_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Missing EVOLINK_API_KEY on server' }),
      { status: 500 }
    );
  }

  try {
    // 1. Authenticate user
    const user = await getUserInfo();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // 2. Check credits
    const costCredits = 1;
    const remainingCredits = await getRemainingCredits(user.id);
    if (remainingCredits < costCredits) {
      return new Response(JSON.stringify({ error: 'Insufficient credits' }), {
        status: 403,
      });
    }

    const {
      userText,
      contents,
      systemText,
      temperature = 0.3,
      maxOutputTokens = 8192,
      responseMimeType,
      responseSchema,
      traceId,
      turn,
    } = await req.json();

    const trace = traceId || `mf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const body: any = {
      generationConfig: { temperature, maxOutputTokens },
    };

    if (Array.isArray(contents) && contents.length > 0) {
      body.contents = contents;
    } else if (userText && typeof userText === 'string') {
      body.contents = [{ role: 'user', parts: [{ text: userText }] }];
    } else {
      return new Response(JSON.stringify({ error: 'Invalid userText or contents' }), {
        status: 400,
      });
    }

    if (systemText) {
      body.systemInstruction = { role: 'system', parts: [{ text: systemText }] };
    }
    if (responseMimeType) body.generationConfig.responseMimeType = responseMimeType;
    if (responseSchema) body.generationConfig.responseSchema = responseSchema;

    const started = Date.now();
    const upstreamTimeoutMs = Number(
      process.env.FORMATTER_UPSTREAM_TIMEOUT_MS || 55_000
    );

    let resp: Response;
    try {
      resp = await fetchWithTimeout(
        `${EVOLINK_BASE}/models/gemini-2.5-flash:generateContent`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
        upstreamTimeoutMs
      );
    } catch (e: any) {
      const durationMs = Date.now() - started;
      const isAbort =
        e?.name === 'AbortError' ||
        String(e?.message || '').toLowerCase().includes('aborted');
      console.log(
        `[GEN] trace=${trace} turn=${turn ?? '-'} upstream_error=${isAbort ? 'timeout' : 'error'} ` +
          `dur=${durationMs}ms msg=${String(e?.message || e)}`
      );
      return new Response(
        JSON.stringify({
          error: isAbort
            ? `Upstream timeout after ${upstreamTimeoutMs}ms`
            : 'Upstream request failed',
          traceId: trace,
        }),
        {
          status: 504,
          headers: {
            'Content-Type': 'application/json',
            'x-trace-id': trace,
          },
        }
      );
    }

    const text = await resp.text();
    const durationMs = Date.now() - started;

    const approxPromptChars = (() => {
      try {
        const arr = (body?.contents || []) as Array<any>;
        return arr.reduce((sum, c) => {
          const parts = Array.isArray(c?.parts) ? c.parts : [];
          const len = parts.reduce(
            (s: number, p: any) => s + (p?.text ? String(p.text).length : 0),
            0
          );
          return sum + len;
        }, 0);
      } catch {
        return 0;
      }
    })();

    let finishReason: string | undefined;
    let outChars: number | undefined;
    let taskId: string | undefined;

    try {
      const data = JSON.parse(text);
      const parts = data?.candidates?.[0]?.content?.parts || [];
      outChars = parts.map((p: any) => p?.text || '').join('').length;
      finishReason = data?.candidates?.[0]?.finishReason;
    } catch {}

    console.log(
      `[GEN] trace=${trace} turn=${turn ?? '-'} status=${resp.status} ` +
        `dur=${durationMs}ms inChars=${approxPromptChars} outChars=${outChars ?? '-'} ` +
        `finish=${finishReason || '-'} temp=${temperature} maxOut=${maxOutputTokens}`
    );

    if (!resp.ok) {
      return new Response(text || resp.statusText, {
        status: resp.status,
        headers: { 'x-trace-id': trace },
      });
    }

    // 3. Consume credits and record task if the first turn of generation
    // We only consume credits on the first turn to avoid overcharging for "Continue" turns
    if (turn === 1 || !turn) {
      const newAITask: NewAITask = {
        id: getUuid(),
        userId: user.id,
        mediaType: 'text',
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        prompt: userText || (contents?.[0]?.parts?.[0]?.text) || 'AI Typesetting',
        scene: 'formatter',
        status: AITaskStatus.SUCCESS,
        costCredits,
      };
      await createAITask(newAITask);
    }

    return new Response(text, {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'x-trace-id': trace },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
