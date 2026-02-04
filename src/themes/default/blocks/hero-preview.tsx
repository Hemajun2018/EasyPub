'use client';

import { useEffect, useState } from 'react';
import { FORMATTING_OPTIONS } from '@/shared/blocks/formatter/types';

// Type for the generated preview samples
interface PreviewSamples {
  article: string;
  generatedAt: string;
  styles: Record<string, string>;
}

export function HeroPreview() {
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);
  const [samples, setSamples] = useState<PreviewSamples | null>(null);
  const [loading, setLoading] = useState(true);

  // Load generated preview samples
  useEffect(() => {
    fetch('/preview-samples.json')
      .then((res) => res.json())
      .then((data: PreviewSamples) => {
        setSamples(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load preview samples:', error);
        setLoading(false);
      });
  }, []);

  // Auto-rotate through templates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStyleIndex((prev) => (prev + 1) % FORMATTING_OPTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentStyle = FORMATTING_OPTIONS[currentStyleIndex];
  const currentFormattedContent = samples?.styles[currentStyle.id] || '';

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-stretch">
        {/* Left: Before - Plain Text */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gray-200 dark:bg-white/10 rounded-2xl opacity-50" />
          <div className="relative bg-white dark:bg-[#131022] rounded-xl border border-gray-200 dark:border-white/10 shadow-xl flex flex-col h-[500px]">
            {/* Header */}
            <div className="h-10 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a162d] flex items-center justify-between px-4 rounded-t-xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                原始内容输入 (Before)
              </span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-white/10" />
              </div>
            </div>
            {/* Content - Plain Text */}
            <div className="flex-1 p-6 text-sm overflow-y-auto text-gray-600 dark:text-gray-400 leading-relaxed">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-400">加载中...</div>
                </div>
              ) : samples ? (
                <>
                  {samples.article.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                  <div className="h-4 w-1 bg-primary animate-pulse inline-block align-middle ml-1" />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-400">
                    请先运行 <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">pnpm preview:generate</code> 生成预览内容
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: After - Phone Preview with Real Template Styles */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-wechat-green rounded-2xl blur opacity-20" />
          <div className="relative bg-gray-100 dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl flex flex-col h-[500px] overflow-hidden items-center justify-center">
            {/* Style Indicator */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="bg-wechat-green text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-widest">
                AI 排版预览
              </span>
              <span className="bg-white/90 dark:bg-black/50 text-gray-800 dark:text-white text-[9px] font-medium px-2 py-1 rounded backdrop-blur">
                {currentStyle.name}
              </span>
            </div>

            {/* Phone Frame */}
            <div className="w-[280px] h-[450px] bg-white rounded-[2.5rem] border-[6px] border-gray-800 shadow-2xl overflow-hidden flex flex-col relative scale-90 transition-all duration-500">
              {/* Status Bar */}
              <div className="h-5 bg-white w-full flex justify-between items-center px-6 text-[8px] font-bold text-gray-800 shrink-0">
                <span>9:41</span>
                <div className="flex gap-1 items-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 22h20V2z" />
                  </svg>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                  </svg>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
                  </svg>
                </div>
              </div>

              {/* WeChat Header */}
              <div className="h-8 border-b border-gray-100 flex items-center px-3 bg-[#f2f2f2] text-black shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
                <span className="ml-2 text-[10px] font-medium">预览文章</span>
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>

              {/* Article Content - Real formatted HTML */}
              <div className="flex-1 overflow-y-auto bg-white p-4 scrollbar-hide">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400 text-xs">加载中...</div>
                  </div>
                ) : currentFormattedContent ? (
                  <>
                    <div className="text-[8px] text-gray-400 mb-3 flex items-center gap-2">
                      <span className="text-[#576b95]">EasyPub AI</span>
                      <span>2024-05-20</span>
                    </div>

                    {/* Render real formatted content */}
                    <div 
                      className="transition-all duration-500" 
                      style={{ transform: 'scale(0.65)', transformOrigin: 'top left', width: '154%' }}
                      dangerouslySetInnerHTML={{ __html: currentFormattedContent }}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400 text-xs text-center px-4">
                      请先运行<br />
                      <code className="bg-gray-100 px-2 py-1 rounded text-[10px]">pnpm preview:generate</code>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Template Carousel Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {FORMATTING_OPTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStyleIndex
                      ? 'w-6 bg-primary'
                      : 'w-1.5 bg-gray-400/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
