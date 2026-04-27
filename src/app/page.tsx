'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';

export default function Home() {
  const [markdownInput, setMarkdownInput] = useState<string>('');
  const [output, setHtmlOutput] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'laptop' | 'phone'>('laptop');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMarkdown = localStorage.getItem('markdownInput');
      if (storedMarkdown) {
        setMarkdownInput(storedMarkdown);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('markdownInput', markdownInput);
    }
  }, [markdownInput]);

  const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const markdown = event.target.value;
    setMarkdownInput(markdown);

    // Convert markdown to HTML string using marked
    const rawHtml = marked.parse(markdown);
    setHtmlOutput(rawHtml);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Markdown to WeChat Article</h1>

      <div className="flex w-full gap-8 flex-1">
        {/* Markdown Input */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Markdown Input</h2>
          <textarea
            className="flex-1 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Enter your Markdown content here..."
            value={markdownInput}
            onChange={handleMarkdownChange}
          ></textarea>
        </div>

        {/* HTML Preview */}
        <div className="flex-1 flex flex-col bg-white p-8 shadow-lg rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">HTML Preview</h2>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${previewMode === 'laptop' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                onClick={() => setPreviewMode('laptop')}
              >
                Laptop View
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${previewMode === 'phone' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                onClick={() => setPreviewMode('phone')}
              >
                Phone View
              </button>
            </div>
          </div>
          <div className={`prose max-w-none flex-1 overflow-auto p-4 ${previewMode === 'phone' ? 'w-[375px] h-[667px] mx-auto my-4 border-8 border-black rounded-[36px] overflow-hidden shadow-xl' : ''
            }`} style={{
              fontFamily: '"Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif',
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#333',
              wordBreak: 'break-word',
            }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownInput}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
