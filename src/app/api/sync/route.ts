import { NextResponse } from 'next/server';
import { parseHTML } from 'linkedom';
import { Defuddle } from 'defuddle/node';
import { supabase } from '@/lib/supabase';

async function defuddleArticle(url: string) {
  const response = await fetch(url, {
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'zh-CN,zh;q=0.9',
      'priority': 'u=0, i',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
    }
  });
  const html = await response.text();

  const { document } = parseHTML(html);
  const options: Record<string, any> = {
    markdown: true
  };

  if (url.includes('weixin')) {
    options.contentSelector = '#js_content';
  }

  const result = await Defuddle(document, url, options);

  return {
    title: result.title || '',
    markdown: result.content || '',
    author: result.author || ''
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  const { data, error } = await supabase.from('wechat_messages')
    .select('*').eq('from_user_name', code).eq('status', 0).order('create_time', { ascending: false });
  if (error) {
    console.error('Error fetching from Supabase:', error);
    return NextResponse.json(
      { code: 1, message: 'Error fetching from Supabase' },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { code: 1, message: 'No message found' },
      { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } }
    );
  }

  const result: { title: string; markdown: string; type: string }[] = [];

  for (let index = 0; index < data.length; index++) {
    const item = data[index].content;
    if (typeof item === 'string' && item.startsWith('https')) {
      try {
        const article = await defuddleArticle(item);
        const title = (article.title || '').trim().replace(/[\\/:]/g, '') || 'Untitled';
        const author = (article.author || '').trim();

        const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
source: "${item}"
author: "${author.replace(/"/g, '\\"')}"
created: ${new Date().toISOString().split('T')[0]}
tags:
  - "clippings"
---
`;

        const markdown = (article.markdown || '').replace(/(\n\n)(\s*\n\n)+/g, '\n\n');
        result.push({ title, markdown: frontmatter + markdown, 'type': 'md' });
      } catch (e) {
        console.error(`Error parsing article at ${item}:`, e);
        result.push({ title: 'Error parsing article', markdown: `Failed to fetch or parse article: ${item}`, 'type': 'text' });
      }
    } else {
      result.push({ 'title': item, 'type': 'text', 'markdown': item });
    }

    await supabase.from('wechat_messages').update({ status: 1 }).eq('id', data[index].id);
  }

  return NextResponse.json({ code: 0, data: result }, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}
export async function OPTIONS(request: Request) {
  const response = NextResponse.json(null);
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
