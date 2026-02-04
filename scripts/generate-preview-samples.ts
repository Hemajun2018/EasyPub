#!/usr/bin/env tsx

/**
 * Generate preview samples for all formatting styles.
 * 
 * THIS SCRIPT IS THE "BRIDGE":
 * It directly imports and uses the formatting logic (formatText) from the main application 
 * (src/shared/blocks/formatter/gemini-service.ts).
 * 
 * To avoid needing a running server or session cookies, it mocks the global `fetch` 
 * to handle local API calls by calling the official Evolink API directly.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 1. Setup Environment
dotenv.config({ path: path.join(__dirname, '../.env.development') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const apiKey = process.env.EVOLINK_API_KEY || process.env.API_KEY;
if (!apiKey) {
  console.error('❌ Error: EVOLINK_API_KEY or API_KEY not found in environment variables');
  process.exit(1);
}

const EVOLINK_BASE = 'https://api.evolink.ai/v1beta';

// 2. Global Mock Fetch: Redirect /api/formatter/generate calls to direct Evolink calls
const originalFetch = globalThis.fetch;
globalThis.fetch = (async (url: string, init?: any) => {
  const urlStr = url.toString();
  
  // If the app tries to call its own internal API, we intercept and handle it
  if (urlStr.includes('/api/formatter/generate')) {
    const body = JSON.parse(init?.body as string);
    
    // Convert the internal request body to the official Evolink API format
    // This logic mimics what src/app/api/formatter/generate/route.ts does
    const evolinkBody = {
      contents: body.contents || [{ role: 'user', parts: [{ text: body.userText }] }],
      systemInstruction: body.systemText ? { role: 'system', parts: [{ text: body.systemText }] } : undefined,
      generationConfig: {
        temperature: body.temperature ?? 0.3,
        maxOutputTokens: body.maxOutputTokens ?? 8192,
        responseMimeType: body.responseMimeType,
        responseSchema: body.responseSchema,
      },
    };

    // Call the real Evolink API
    return originalFetch(`${EVOLINK_BASE}/models/gemini-2.5-flash:generateContent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evolinkBody),
    });
  }
  
  // For all other calls (like the one above), use the original fetch
  return originalFetch(url, init);
}) as any;

// 3. Now we can safely import the application logic!
// Path aliases will be handled by tsx as long as it finds tsconfig.json
import { FORMATTING_OPTIONS } from '../src/shared/blocks/formatter/types';
import { formatText } from '../src/shared/blocks/formatter/gemini-service';

const SAMPLE_ARTICLE_PATH = path.join(__dirname, 'sample-article.txt');
const OUTPUT_PATH = path.join(__dirname, '../public/preview-samples.json');

async function generatePreviews() {
  console.log('📖 Reading sample article...');
  if (!fs.existsSync(SAMPLE_ARTICLE_PATH)) {
    console.error('❌ Error: Sample article not found at', SAMPLE_ARTICLE_PATH);
    return;
  }
  const article = fs.readFileSync(SAMPLE_ARTICLE_PATH, 'utf-8');
  
  console.log('🎨 Generating formatted previews using actual application logic...\n');
  
  const results: Record<string, string> = {};
  
  // We'll iterate through all styles defined in the application
  for (const option of FORMATTING_OPTIONS) {
    console.log(`⏳ Formatting: ${option.name} (${option.id})...`);
    
    try {
      // Direct call to the same function used in the UI!
      // This ensures 100% consistency between script and page.
      const formatted = await formatText(article, option.id);
      
      results[option.id] = formatted;
      console.log(`✅ ${option.name} - Success (${formatted.length} chars)\n`);
    } catch (error: any) {
      console.error(`❌ ${option.name} - Failed:`, error.message);
      results[option.id] = `<p>生成失败: ${error.message}</p>`;
    }
    
    // Small delay to avoid aggressive rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const output = {
    article,
    generatedAt: new Date().toISOString(),
    styles: results,
  };
  
  console.log('\n💾 Saving results to', OUTPUT_PATH);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
  
  console.log('✨ All done! Previews are now visually identical to the live page.');
}

// Run the generation
generatePreviews().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
