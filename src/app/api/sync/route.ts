import { NextResponse } from 'next/server';
import TurndownService from 'turndown';
import * as cheerio from 'cheerio';
import { supabase } from '@/lib/supabase';

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
      const response = await fetch(item, {
        headers: {
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-language': 'zh-CN,zh;q=0.9',
          'priority': 'u=0, i',
          'upgrade-insecure-requests': '1',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
        }
      });

      const htmlContent = await response.text();
      const $ = cheerio.load(htmlContent);
      let title = $('h1').text().trim().replace(/[\\/:]/g, '');

      let content = null;
      const turndownService = new TurndownService();

      if (item.includes('weixin')) {
        content = $('#js_content').html();
        turndownService.addRule('multiCodeBlock', {
          filter(node) {
            return node.nodeName === 'PRE';
          },

          replacement(content, node) {
            const pre = node as HTMLElement;

            const codes = Array.from(pre.querySelectorAll('code'));

            const merged = codes
              .map(code => code.textContent?.trim() || '')
              .join('\n');

            const lang = pre.getAttribute('data-lang') || '';

            return `\n\`\`\`\n${merged}\n\`\`\`\n`;
          }
        });
        turndownService.addRule('markdownImage', {
          filter(node) {
            return node.nodeName === 'IMG';
          },

          replacement(content, node) {
            const img = node as HTMLImageElement;
            console.log(img)
            const alt = img.getAttribute('alt') || '';
            let src = img.getAttribute('data-src') || '';
            if (!src) {
              src = img.getAttribute('src') || '';
            }
            const title = img.getAttribute('title');

            // markdown title 可选
            const titlePart = title ? ` "${title}"` : '';

            return `![${alt}](${src}${titlePart})`;
          }
        });


      } else {
        content = $('body').html();
      }

      const markdown = turndownService.turndown(content || '').replace(/(\n\n)(\s*\n\n)+/g, '\n\n');
      result.push({ title, markdown, 'type': 'md' });
    } else {
      result.push({ 'title': '消息', 'type': 'text', 'markdown': item });
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
