import { NextResponse } from 'next/server';
import crypto from 'crypto';
import * as cheerio from 'cheerio';
import { supabase } from '@/lib/supabase';

// Replace with your actual token
const TOKEN = process.env.SIGNATURE_TOKEN || 'your-token-here';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const signature = searchParams.get('signature');
  const timestamp = searchParams.get('timestamp');
  const echostr = searchParams.get('echostr');
  const nonce = searchParams.get('nonce');

  // Validate that all required parameters are present
  if (!signature || !timestamp || !nonce) {
    return NextResponse.json(
      { code: 1, message: 'Missing required parameters: signature, timestamp, nonce' },
      { status: 400 }
    );
  }

  // Check signature
  const isValid = checkSignature(signature, timestamp, nonce);

  return new NextResponse(echostr);
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const signature = searchParams.get('signature');
  const timestamp = searchParams.get('timestamp');
  const nonce = searchParams.get('nonce');

  const xmlText = await request.text();
  if (!xmlText) {
    return NextResponse.json(
      { code: 1, message: 'Empty body' },
      { status: 400 }
    );
  }

  // Parse XML using cheerio with xmlMode enabled for correct XML element queries
  const $ = cheerio.load(xmlText, { xmlMode: true });

  // Extract elements from <xml> root
  const toUserName = $('ToUserName').text() || $('xml > ToUserName').text();
  const fromUserName = $('FromUserName').text() || $('xml > FromUserName').text();
  const createTime = $('CreateTime').text() || $('xml > CreateTime').text();
  let msgType = $('MsgType').text() || $('xml > MsgType').text();
  const event = $('Event').text() || $('xml > Event').text();
  let content = $('Content').text() || $('xml > Content').text();
  const msgId = $('MsgId').text() || $('xml > MsgId').text();
  const msgDataId = $('MsgDataId').text() || $('xml > MsgDataId').text();
  const idx = $('Idx').text() || $('xml > Idx').text();

  const parsedData = {
    toUserName,
    fromUserName,
    createTime,
    msgType,
    content,
    msgId,
    msgDataId,
    idx
  };

  // Save to Supabase database
  if (msgType !== 'event') {
    if (msgType === 'image') {
      const picUrl = $('PicUrl').text() || $('xml > PicUrl').text();
      content = `![](${picUrl})`;
    }
    try {
      const { error } = await supabase.from('wechat_messages').insert({
        to_user_name: toUserName,
        from_user_name: fromUserName,
        create_time: createTime ? parseInt(createTime, 10) : null,
        msg_type: msgType,
        content: content || null,
        msg_id: msgId || null,
        msg_data_id: msgDataId || null,
        idx: idx || null,
      });
      if (error) {
        console.error('Error inserting message into Supabase:', error);
      }
    } catch (err) {
      console.error('Unexpected error inserting into Supabase:', err);
    }
  }

  if (event === 'subscribe') {
    const xmlResponse = `<xml>
<ToUserName><![CDATA[${fromUserName}]]></ToUserName>
<FromUserName><![CDATA[${toUserName}]]></FromUserName>
<CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[🎉 感谢你的关注，回复 "插件" 获取插件包及安装文档链接。]]></Content>
</xml>`;
    return new NextResponse(xmlResponse, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }

  if (content === '注册' || content === '插件') {
    const xmlResponse = `<xml>
<ToUserName><![CDATA[${fromUserName}]]></ToUserName>
<FromUserName><![CDATA[${toUserName}]]></FromUserName>
<CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[🎉 注册成功！您的专属 API_KEY 已生成：

🔑 API_KEY：
${fromUserName}

📌 使用指南：
1️⃣ 请妥善保管您的 API_KEY，切勿泄露给他人。
2️⃣ 插件包下载：https://wwblh.lanzoum.com/if8qz3t136ib
3️⃣ 详细安装文档：https://docs.qq.com/doc/DS1pnc2ZDYUdheWZK

将 API_KEY 复制并配置到插件中即可开启您的排版之旅。祝您使用愉快！✨]]></Content>
</xml>`;
    return new NextResponse(xmlResponse, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }


  // Determine return format (JSON if format=json query parameter or Accept: application/json header is used)
  const acceptHeader = request.headers.get('accept') || '';
  const isJsonRequested = searchParams.get('format') === 'json' || acceptHeader.includes('application/json');

  return NextResponse.json({
    code: 0,
    message: 'success',
    data: parsedData
  });
}

/**
 * Verify the signature by comparing with SHA1 hash of sorted token array
 * @param signature - The signature from request
 * @param timestamp - The timestamp from request
 * @param nonce - The nonce from request
 * @returns true if signature is valid, false otherwise
 */
function checkSignature(signature: string, timestamp: string, nonce: string): boolean {
  // Create array with token, timestamp, and nonce
  const tmpArr = [TOKEN, timestamp, nonce];

  // Sort array as strings
  tmpArr.sort();

  // Join array into string
  const tmpStr = tmpArr.join('');

  // Create SHA1 hash
  const hash = crypto.createHash('sha1').update(tmpStr).digest('hex');

  // Compare with provided signature
  return hash === signature;
}

export async function OPTIONS(request: Request) {
  const response = NextResponse.json(null);
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

