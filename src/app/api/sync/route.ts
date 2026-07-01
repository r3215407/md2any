import { NextResponse } from 'next/server';
import { parseHTML } from 'linkedom';
import { Defuddle } from 'defuddle/node';
import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Draft.js block → Markdown converter
// ---------------------------------------------------------------------------
interface InlineStyleRange {
  offset: number;
  length: number;
  style: string; // 'BOLD' | 'ITALIC' | 'UNDERLINE' | 'CODE' | 'STRIKETHROUGH' | ...
}

interface EntityRange {
  offset: number;
  length: number;
  key: number;
}

interface DraftBlock {
  key?: string;
  type: string;
  text: string;
  inlineStyleRanges?: InlineStyleRange[];
  entityRanges?: EntityRange[];
  data?: Record<string, unknown>;
}

function applyInlineStyles(text: string, ranges: InlineStyleRange[]): string {
  if (!ranges || ranges.length === 0) return text;

  // Build a per-character style set
  const len = text.length;
  const styleMatrix: Set<string>[] = Array.from({ length: len }, () => new Set<string>());

  for (const r of ranges) {
    for (let i = r.offset; i < r.offset + r.length && i < len; i++) {
      styleMatrix[i].add(r.style.toUpperCase());
    }
  }

  // Walk through and emit markdown tokens on style transitions
  const STYLE_TOKENS: Record<string, [string, string]> = {
    BOLD: ['**', '**'],
    ITALIC: ['*', '*'],
    UNDERLINE: ['<u>', '</u>'],
    CODE: ['`', '`'],
    STRIKETHROUGH: ['~~', '~~'],
  };
  const STYLE_ORDER = ['CODE', 'BOLD', 'ITALIC', 'STRIKETHROUGH', 'UNDERLINE'];

  let result = '';
  let prev = new Set<string>();

  for (let i = 0; i <= len; i++) {
    const curr = i < len ? styleMatrix[i] : new Set<string>();

    // Close styles that ended (in reverse order)
    for (const s of [...STYLE_ORDER].reverse()) {
      if (prev.has(s) && !curr.has(s)) {
        result += STYLE_TOKENS[s]?.[1] ?? '';
      }
    }
    // Open new styles
    for (const s of STYLE_ORDER) {
      if (!prev.has(s) && curr.has(s)) {
        result += STYLE_TOKENS[s]?.[0] ?? '';
      }
    }

    if (i < len) result += text[i];
    prev = curr;
  }

  return result;
}

interface MediaEntity {
  media_info: { original_img_url: string };
}

function blocksToMarkdown(blocks: DraftBlock[], mediaEntities: MediaEntity[] = []): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return '';

  const lines: string[] = [];
  let olCounter = 0;
  // Clone so we can shift without mutating the original
  const mediaQueue = [...mediaEntities];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const styled = applyInlineStyles(block.text ?? '', block.inlineStyleRanges ?? []);
    const prevType = i > 0 ? blocks[i - 1].type : '';

    // Reset ordered-list counter when switching away
    if (block.type !== 'ordered-list-item') olCounter = 0;

    switch (block.type) {
      case 'header-one':
        lines.push('', `# ${styled}`, '');
        break;
      case 'header-two':
        lines.push('', `## ${styled}`, '');
        break;
      case 'header-three':
        lines.push('', `### ${styled}`, '');
        break;
      case 'header-four':
        lines.push('', `#### ${styled}`, '');
        break;
      case 'header-five':
        lines.push('', `##### ${styled}`, '');
        break;
      case 'header-six':
        lines.push('', `###### ${styled}`, '');
        break;
      case 'blockquote':
        lines.push(`> ${styled}` + '\n');
        break;
      case 'unordered-list-item': {
        const isLastUl = i + 1 >= blocks.length || blocks[i + 1].type !== 'unordered-list-item';
        lines.push(`- ${styled}` + (isLastUl ? '\n' : ''));
        break;
      }
      case 'ordered-list-item': {
        olCounter++;
        const isLastOl = i + 1 >= blocks.length || blocks[i + 1].type !== 'ordered-list-item';
        lines.push(`${olCounter}. ${styled}` + (isLastOl ? '\n' : ''));
        break;
      }
      case 'code-block':
        // Accumulate consecutive code blocks into a fenced block
        if (prevType !== 'code-block') lines.push('```');
        lines.push(block.text ?? '');
        if (i + 1 >= blocks.length || blocks[i + 1].type !== 'code-block') lines.push('```');
        break;
      case 'atomic': {
        // Use the next media entity's URL, fall back to block.text
        const entity = mediaQueue.shift();
        if (entity != undefined) {
          const imgUrl = entity!.media_info!.original_img_url;
          if (imgUrl) lines.push(`![](${imgUrl})` + '\n');
        }
        break;
      }
      case 'unstyled':
      default:
        // Empty unstyled blocks become blank lines
        lines.push(styled + '\n' || '');
        break;
    }
  }

  // Collapse 3+ consecutive blank lines into 2
  return lines.join('\n').replace(/(\n){3,}/g, '\n\n').trim();
}

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
    if (document.querySelector('#js_content')) {
      options.contentSelector = '#js_content';
    } else {
      if (url.startsWith('https://weixin.qq.com/sph/')) {
        const shortUri = url.split('/').pop()
        const response = await fetch('https://channels.weixin.qq.com/finder-preview/api/feed/get_feed_info?&_pageUrl=https:%2F%2Fchannels.weixin.qq.com%2Ffinder-preview%2Fpages%2Fsph', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://channels.weixin.qq.com',
            'Referer': `https://channels.weixin.qq.com/finder-preview/pages/sph?id=${shortUri}`,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
          },
          body: JSON.stringify({
            baseReq: {
              generalToken: ''
            },
            shortUri
          })
        });
        const result = await response.json();
        const author = result.data.authorInfo.nickname;
        const title = result.data.feedInfo.description;
        // const content = data.feedInfo.description;
        const images = result.data.feedInfo.coverUrl;

        return {
          title: title.replaceAll('\n', ' '),
          markdown: `![](${images})` + '\n',
          author,
          tags: 'video'
        };
      }
      const cdnRegex = /cdn_url:\s*'([^']+)'/g;
      const imageUrls = Array.from(new Set(Array.from(html.matchAll(cdnRegex)).map(m => m[1]))).filter(url => url.includes('from=appmsg'));
      const images = imageUrls.map(url => `![](${url})`).join('\n');
      const desc = Array.from(document.querySelectorAll('meta[name="description"]')).map(item => item.getAttribute('content') || '').join('\n');
      const authorMatch = html.match(/nick_name: '([^']+)'/);
      const author = authorMatch ? authorMatch[1].trim() : '';

      return {
        title: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
        markdown: images + '\n' + (desc.replaceAll('\\x0a', '\n') || ''),
        author,
        tags: ''
      };
    }
  }

  if (url.includes('xhslink')) {
    console.log(html)
    const images = Array.from(document.querySelectorAll('meta[property="og:image"]')).map(item => `![](${item.getAttribute('content')})`).join('\n');
    const desc = Array.from(document.querySelectorAll('body span')).map(item => item.textContent || '').join('\n');
    const final_desc = desc.split('\n关注\n关注\n').pop();
    // assable  split result but ignore the last one
    const tags = final_desc?.split('#').slice(0, -1).join(' #');

    return {
      title: document.querySelector('meta[property="og:title"]')?.getAttribute('content')?.replace(' - 小红书', '') || '',
      markdown: images + (tags ? '\n\n' + tags : ''),
      author: document.querySelector('span[class="username"]')?.textContent || '',
      tags: tags
    };
  }

  const result = await Defuddle(document, url, options);

  return {
    title: result.title || '',
    markdown: result.content || '',
    author: result.author || ''
  };
}

async function fetchXArticle(url: string, author: string): Promise<{ title: string; markdown: string }> {
  const articleId = url.split('/').slice(-1)[0];
  const response = await fetch(`https://api.fxtwitter.com/status/${articleId}`, {
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'zh-CN,zh;q=0.9',
      'priority': 'u=0, i',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
    }
  });
  const data = await response.json();
  const rawBlocks: DraftBlock[] = data.tweet.article.content.blocks || [];
  const coverUrl: string | undefined = data.tweet.article.cover_media?.media_info?.original_img_url;
  const description = data.tweet.article.preview_text;
  const title = data.tweet.article.title || '';
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
source: "${url}"
author: "${author.replace(/"/g, '\\"')}"
created: ${new Date().toISOString().split('T')[0]}
description: "${description.replace(/"/g, '\\"').replace(/\n/g, '')}"
tags:
  - "clippings"
---
`;
  const mediaEntities: MediaEntity[] = data.tweet.article.media_entities || [];
  const coverLine = coverUrl ? `![Cover image](${coverUrl})\n\n` : '';
  return { title, markdown: frontmatter + coverLine + blocksToMarkdown(rawBlocks, mediaEntities) };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  const { data, error } = await supabase.from('wechat_messages')
    .select('*').eq('from_user_name', code).eq('status', 0).order('create_time', { ascending: false });
  if (error) {
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
    const msgType = data[index].msg_type;
    if (msgType === 'image') {
      const title = '图片-' + new Date().toISOString().split('T')[0]
      result.push({ 'title': title, 'type': 'text', 'markdown': item });

    } else {
      if (item.startsWith('http') || item.includes('http://xhslink.com')) {
        let url = item
        if (item.includes('http://xhslink.com')) {
          url = item.match(/http:\/\/xhslink\.com\/\S+/g)?.[0];
        }
        try {
          const article = await defuddleArticle(url);
          const title = (article.title || '').trim().replace(/[\\/:]/g, '') || 'Untitled';
          const author = (article.author || '').trim();


          const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
source: "${url}"
author: "${author.replace(/"/g, '\\"')}"
created: ${new Date().toISOString().split('T')[0]}
tags:
  - "clippings"
---
`;

          const markdown = (article.markdown || '').replace(/(\n\n)(\s*\n\n)+/g, '\n\n');
          if (markdown.includes("https://x.com/i/article")) {
            const xArticle = await fetchXArticle(item, author);
            result.push({ title: xArticle.title, markdown: xArticle.markdown, type: 'md' });
          } else {
            result.push({ title, markdown: frontmatter + markdown, 'type': 'md' });
          }

        } catch (e) {
          result.push({ title: 'Error parsing article', markdown: `Failed to fetch or parse article: ${item}`, 'type': 'text' });
        }
      } else {
        const splitText = item.split('\n');
        const title = (splitText[0] || '').trim().replace(/[\\/:*?"<>|]/g, '') || 'Untitled';
        result.push({ 'title': title, 'type': 'text', 'markdown': item });
      }


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
