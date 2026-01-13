function isAllowedWeChatUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const protocolOk = u.protocol === 'http:' || u.protocol === 'https:';
    const hostOk = /(^|\.)mp\.weixin\.qq\.com$/i.test(u.hostname);
    return protocolOk && hostOk;
  } catch {
    return false;
  }
}

function stripScriptsAndStyles(s: string): string {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
}

function findElementInnerHtmlById(
  html: string,
  id: string
): { inner: string; start: number; end: number } | null {
  const re = new RegExp(`<([a-zA-Z0-9]+)([^>]*?)\\bid=["']${id}["'][^>]*>`, 'i');
  const m = re.exec(html);
  if (!m) return null;
  const tag = m[1].toLowerCase();
  const openStart = m.index;
  const openEnd = m.index + m[0].length;

  let i = openEnd;
  let depth = 1;
  const len = html.length;
  while (i < len) {
    const lt = html.indexOf('<', i);
    if (lt === -1) break;
    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt + 4);
      i = end === -1 ? len : end + 3;
      continue;
    }
    if (html.startsWith(`</${tag}`, lt)) {
      depth--;
      const gt = html.indexOf('>', lt + 2 + tag.length);
      if (gt === -1) break;
      if (depth === 0) {
        return { inner: html.slice(openEnd, lt), start: openStart, end: gt + 1 };
      }
      i = gt + 1;
      continue;
    }
    if (html.startsWith(`<${tag}`, lt)) {
      depth++;
      const gt = html.indexOf('>', lt + 1 + tag.length);
      if (gt === -1) break;
      i = gt + 1;
      continue;
    }
    i = lt + 1;
  }
  return null;
}

function findElementInnerHtmlByClass(
  html: string,
  className: string
): { inner: string; start: number; end: number } | null {
  const re = new RegExp(
    `<([a-zA-Z0-9]+)([^>]*?)\\bclass=["'][^"']*${className}[^"']*["'][^>]*>`,
    'i'
  );
  const m = re.exec(html);
  if (!m) return null;
  const tag = m[1].toLowerCase();
  const openStart = m.index;
  const openEnd = m.index + m[0].length;
  let i = openEnd;
  let depth = 1;
  const len = html.length;
  while (i < len) {
    const lt = html.indexOf('<', i);
    if (lt === -1) break;
    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt + 4);
      i = end === -1 ? len : end + 3;
      continue;
    }
    if (html.startsWith(`</${tag}`, lt)) {
      depth--;
      const gt = html.indexOf('>', lt + 2 + tag.length);
      if (gt === -1) break;
      if (depth === 0) {
        return { inner: html.slice(openEnd, lt), start: openStart, end: gt + 1 };
      }
      i = gt + 1;
      continue;
    }
    if (html.startsWith(`<${tag}`, lt)) {
      depth++;
      const gt = html.indexOf('>', lt + 1 + tag.length);
      if (gt === -1) break;
      i = gt + 1;
      continue;
    }
    i = lt + 1;
  }
  return null;
}

function normalizeImages(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, (imgTag) => {
    const getAttr = (name: string) => {
      const m = new RegExp(
        `${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\"'\s>]+))`,
        'i'
      ).exec(imgTag);
      return m ? m[2] || m[3] || m[4] || '' : '';
    };
    const dataSrc = getAttr('data-src');
    const src = getAttr('src');
    let finalSrc = (dataSrc || src || '').trim();
    if (!finalSrc || finalSrc.startsWith('chrome-extension:')) {
      finalSrc = '';
    }
    let out = imgTag;
    if (finalSrc) {
      if (/\bsrc\s*=/.test(out)) {
        out = out.replace(
          /\bsrc\s*=\s*("([^"]*)"|'[^']*'|([^\"'\s>]+))/, 
          `src="${finalSrc}"`
        );
      } else {
        out = out.replace(/<img\b/i, `<img src="${finalSrc}"`);
      }
    }
    out = out.replace(/\sdata-src\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    out = out.replace(/\sdata-\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (s) =>
      /data-w\b/i.test(s) ? s : ''
    );
    return out;
  });
}

function extractTextById(html: string, id: string): string | null {
  const m = new RegExp(
    `<[^>]*\\bid=["']${id}["'][^>]*>([\s\S]*?)<\/[^>]+>`,
    'i'
  ).exec(html);
  if (!m) return null;
  const text = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return text || null;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string' || !isAllowedWeChatUrl(url)) {
      return new Response(JSON.stringify({ error: 'Invalid or unsupported URL' }), {
        status: 400,
      });
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        Referer: 'https://mp.weixin.qq.com/',
      },
      redirect: 'follow',
    });
    const text = await resp.text();
    if (!resp.ok) {
      return new Response(
        JSON.stringify({
          error: `Fetch failed: ${resp.statusText}`,
          body: text.slice(0, 2000),
        }),
        { status: resp.status }
      );
    }

    const page = stripScriptsAndStyles(text);
    const pageContent = findElementInnerHtmlById(page, 'page-content');
    let extracted = findElementInnerHtmlById(page, 'js_content');
    if (!extracted) extracted = findElementInnerHtmlByClass(page, 'rich_media_content');
    if (!extracted) {
      return new Response(
        JSON.stringify({ error: 'Unable to locate article content (#js_content)' }),
        { status: 422 }
      );
    }
    let html = extracted.inner.trim();
    html = normalizeImages(html);
    let pageContentHtml = pageContent?.inner?.trim() || '';
    if (pageContentHtml) pageContentHtml = normalizeImages(pageContentHtml);

    const title = extractTextById(page, 'activity-name');
    const account = extractTextById(page, 'js_name');
    const publishTime = extractTextById(page, 'publish_time');

    return new Response(
      JSON.stringify({
        html,
        pageContentHtml,
        title: title || '',
        account: account || '',
        publishTime: publishTime || '',
        rawUrl: url,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), {
      status: 500,
    });
  }
}
