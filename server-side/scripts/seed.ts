import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';


// LangChain imports (langchain-js)
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import type { Document } from 'langchain/document';

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  EMBEDDING_PROVIDER = 'openai',
  SEED_URLS = '',
  OPTIONAL_APP_TEXT_FILE,
  CHUNK_SIZE = '1000',
  CHUNK_OVERLAP = '200',
  PUPPETEER_HEADLESS = 'true',
  GEMINI_API_KEY = '',
} = process.env;


if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in env. Abort.');
  process.exit(1);
}


const chunkSize = parseInt(CHUNK_SIZE, 10) || 1000;
const chunkOverlap = parseInt(CHUNK_OVERLAP, 10) || 200;

// ---------- Supabase client ----------
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);


// ---------- Embeddings wrapper ----------
// TOBE IMPLEMENTED


// ---------- Puppeteer scraper ----------
async function scrapePageText(url: string, headless = true): Promise<{ text: string; title?: string }> {
  const browser = await puppeteer.launch({ headless: headless === 'true' || headless === true });
  try {
    const page = await browser.newPage();
 
    await page.setUserAgent('NestJS-RAG-SeedBot/1.0 (+https://example.com)');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  
    await page.evaluate(() => {
      document.querySelectorAll('script, style, noscript, iframe').forEach((n) => n.remove());
    });

    const rawText = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      const texts: string[] = [];
      while ((node = walker.nextNode() as Text | null)) {
        const val = node.nodeValue?.trim();
        if (val && val.length > 20) texts.push(val.replace(/\s+/g, ' '));
      }
      return texts.join('\n\n');
    });
    const title = await page.title();
    return { text: rawText, title };
  } finally {
    await browser.close();
  }
}



function buildTextSplitter() {
  return new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });
}

async function splitToDocs(sourceText: string, metadata: Record<string, any> = {}) {
  const splitter = buildTextSplitter();
  const chunks = await splitter.splitText(sourceText);
  
  return chunks.map((chunk: string) => ({
    content: chunk,
    metadata,
  }));
}


async function upsertDocuments(docs: { content: string; metadata: any; embedding: number[]; source_url?: string }[]) {

  const rows = docs.map((d) => ({
    source_url: d.source_url ?? null,
    content: d.content,
    metadata: d.metadata ?? {},
    embedding: d.embedding,
  }));
 
  const BATCH_SIZE = 100;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('documents').insert(batch);
    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    } else {
      console.log(`Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} rows)`);
    }
  }
}
