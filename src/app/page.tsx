'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { THEMES, Theme } from '../styles/themes';
import { DEFAULT_MARKDOWN } from '../constants/defaultMarkdown';

export default function Home() {
  const [markdownInput, setMarkdownInput] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'laptop' | 'phone'>('phone');
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isSynchronizingScroll = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMarkdown = localStorage.getItem('markdownInput');
      if (storedMarkdown) {
        setMarkdownInput(storedMarkdown); // eslint-disable-line react-hooks/set-state-in-effect
      } else {
        setMarkdownInput(DEFAULT_MARKDOWN); // eslint-disable-line react-hooks/set-state-in-effect
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('markdownInput', markdownInput);
    }
  }, [markdownInput]);

  const handleScroll = useCallback((scrolledElement: EventTarget, targetElement: HTMLElement | null) => {
    if (isSynchronizingScroll.current || !targetElement) {
      return;
    }

    isSynchronizingScroll.current = true;

    const { scrollTop, scrollHeight, clientHeight } = scrolledElement as HTMLElement;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    targetElement.scrollTop = scrollPercentage * (targetElement.scrollHeight - targetElement.clientHeight);

    setTimeout(() => {
      isSynchronizingScroll.current = false;
    }, 50); // Debounce to prevent rapid toggling
  }, []);

  const handleInputScroll = useCallback((event: React.UIEvent<HTMLTextAreaElement>) => {
    handleScroll(event.currentTarget, previewRef.current);
  }, [handleScroll]);

  const handlePreviewScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    handleScroll(event.currentTarget, inputRef.current);
  }, [handleScroll]);

  // Update markdown and trigger HTML conversion
  const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownInput(event.target.value);
  };

  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [showToast, setShowToast] = useState(false);


  const copyToClipboard = async () => {
    try {
      let htmlContentToCopy = '';
      if (contentRef.current) {
        // Get the innerHTML of the rendered content, which includes applied styles
        htmlContentToCopy = contentRef.current.innerHTML;
      }

      const htmlBlob = new Blob([htmlContentToCopy], { type: 'text/html' });
      const textBlob = new Blob([markdownInput], { type: 'text/plain' });
      const item = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      });
      await navigator.clipboard.write([item]);
      setCopyStatus('copied');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to copy rich text: ', error);
      // Fallback to plain text copy if rich text fails
      navigator.clipboard.writeText(markdownInput);
      setCopyStatus('copied'); // Still show copied even if it's plain text
      setShowToast(true);
    }
    setTimeout(() => setCopyStatus('idle'), 30000);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-purple-100 p-6 md:p-12 flex flex-col items-center font-sans">
      <div className="max-w-7xl w-full flex flex-col flex-1">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Markdown 转 公众号内容
            </h1>
          </div>
          <div>

          </div>
          <div className="flex gap-2 bg-white/50 p-1 rounded-full backdrop-blur-sm border border-white/20 shadow-inner">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedTheme.id === theme.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-white/50'
                  }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${copyStatus === 'copied'
                ? 'bg-green-500 text-white scale-105'
                : 'bg-white text-gray-800 hover:bg-gray-50 active:scale-95'
                }`}
            >
              {copyStatus === 'copied' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  已复制
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                  复制
                </>
              )}
            </button>
          </div>
        </header>
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50">
            已将富文本内容复制到剪贴板，可直接粘贴 (Ctrl + V) 到微信编辑器
          </div>
        )}

        <div className="flex flex-col lg:flex-row w-full gap-8 flex-1">
          {/* Markdown Input */}
          <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                输入 Markdown 内容
              </h2>
            </div>
            <textarea
              ref={inputRef}
              className="flex-1 p-4 bg-gray-50/50 border-none rounded-xl focus:ring-2 focus:ring-blue-400 font-mono text-sm resize-none overflow-y-auto"
              placeholder="将文本内容拷贝到这里"
              value={markdownInput}
              onChange={handleMarkdownChange}
              onScroll={handleInputScroll}
            ></textarea>
          </div>

          {/* HTML Preview */}
          <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                预览
              </h2>
              <div className="flex bg-gray-200/50 p-1 rounded-full">
                <button
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${previewMode === 'phone' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setPreviewMode('phone')}
                >
                  手机
                </button>
                <button
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${previewMode === 'laptop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setPreviewMode('laptop')}
                >
                  桌面
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-50">
              {/* 外层：控制“设备尺寸” */}
              <div
                className={`transition-all duration-500 ${previewMode === 'phone' ? 'max-w-[375px] mx-auto my-4 aspect-[9/19]' : 'w-full h-[100vh]'}`}
              >
                {/* 中层：滚动容器（关键！） */}
                <div
                  ref={previewRef}
                  onScroll={handlePreviewScroll}
                  className={`h-full overflow-auto bg-white border border-gray-100 transition-all duration-500 ${previewMode === 'phone' ? 'rounded-[50px]' : 'rounded-xl'
                    }`}
                >
                  {/* 内容层：只控制 padding，不影响布局 */}
                  <div
                    ref={contentRef}
                    className={`wechat-content max-w-none ${previewMode === 'phone' ? 'p-4 pt-8' : 'p-6'
                      }`}
                    style={selectedTheme.styles.container}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => <h1 style={selectedTheme.styles.h1} {...props} />,
                        h2: ({ node, ...props }) => <h2 style={selectedTheme.styles.h2} {...props} />,
                        h3: ({ node, ...props }) => <h3 style={selectedTheme.styles.h3} {...props} />,
                        p: ({ node, ...props }) => <p style={selectedTheme.styles.p} {...props} />,
                        blockquote: ({ node, ...props }) => (
                          <blockquote style={selectedTheme.styles.blockquote} {...props} />
                        ),
                        code: ({ node, inline, ...props }: any) =>
                          inline ? (
                            <code style={selectedTheme.styles.code} {...props} />
                          ) : (
                            <pre style={selectedTheme.styles.pre}>
                              <code {...props} />
                            </pre>
                          ),
                        ul: ({ node, ...props }) => <ul style={selectedTheme.styles.ul} {...props} />,
                        ol: ({ node, ...props }) => <ol style={selectedTheme.styles.ol} {...props} />,
                        li: ({ node, ...props }) => <li style={selectedTheme.styles.li} {...props} />,
                        a: ({ node, ...props }) => <a style={selectedTheme.styles.link} {...props} />,
                        strong: ({ node, ...props }) => (
                          <strong style={selectedTheme.styles.strong} {...props} />
                        ),
                        table: ({ node, ...props }) => (
                          <table style={selectedTheme.styles.table} {...props} />
                        ),
                        thead: ({ node, ...props }) => (
                          <thead style={selectedTheme.styles.thead} {...props} />
                        ),
                        tbody: ({ node, ...props }) => (
                          <tbody style={selectedTheme.styles.tbody} {...props} />
                        ),
                        tr: ({ node, ...props }) => (
                          <tr style={selectedTheme.styles.tr} {...props} />
                        ),
                        th: ({ node, ...props }) => (
                          <th style={selectedTheme.styles.th} {...props} />
                        ),
                        td: ({ node, ...props }) => (
                          <td style={selectedTheme.styles.td} {...props} />
                        ),
                      }}
                    >
                      {markdownInput}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
