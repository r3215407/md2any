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

  // // Verify signature if signature parameters are provided (standard WeChat behavior)
  // if (signature && timestamp && nonce) {
  //   if (!checkSignature(signature, timestamp, nonce)) {
  //     return new NextResponse('Invalid signature', { status: 403 });
  //   }
  // }

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
  const msgType = $('MsgType').text() || $('xml > MsgType').text();
  const content = $('Content').text() || $('xml > Content').text();
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

