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
          <div className="relative bg-white dark:bg-[#131022] rounded-xl border border-gray-200 dark:border-white/10 shadow-xl flex flex-col h-[600px]">
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
          <div className="relative bg-gray-100 dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl flex flex-col h-[600px] overflow-hidden items-center justify-center">
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
            <div className="w-[260px] h-[540px] bg-white rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden flex flex-col relative scale-[0.98] transition-all duration-500 ring-1 ring-white/20">
              
              {/* Dynamic Island (iPhone Pro Look) */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-20 flex items-center justify-between px-3">
                <div className="w-1 h-1 rounded-full bg-blue-500/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              </div>

              {/* Status Bar */}
              <div className="h-7 bg-white w-full flex justify-between items-center px-8 text-[8px] font-bold text-black shrink-0 pt-1">
                <span>9:41</span>
                <div className="flex gap-1 items-center">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 22h20V2z" />
                  </svg>
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
                  </svg>
                </div>
              </div>

              {/* WeChat Header */}
              <div className="h-9 flex items-center px-4 bg-white text-black shrink-0 relative">
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div className="flex gap-1 ml-auto">
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                </div>
              </div>

              {/* Article Content - Real formatted HTML */}
              <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400 text-xs">加载中...</div>
                  </div>
                ) : currentFormattedContent ? (
                  <div 
                    className="transition-all duration-500" 
                    style={{ 
                      transform: 'scale(0.55)', 
                      transformOrigin: 'top left', 
                      width: '182%',
                      padding: '24px 20px'
                    }}
                  >
                    {/* Official WeChat Article Header */}
                    <div className="mb-6">
                      <h1 className="text-[18px] font-bold leading-[1.4] mb-4 text-[#333] tracking-tighter">
                        EasyPub：AI 驱动的智能公众号排版助手
                      </h1>
                      
                      <div className="flex items-center gap-x-2 mb-3 whitespace-nowrap">
                        <span className="bg-[#f0f0f0] text-[#888] text-[10px] px-1.5 py-0.5 rounded-sm shrink-0">原创</span>
                        <span className="text-[#888] text-[12px] shrink-0">何慢慢</span>
                        <span className="text-[#576b95] text-[12px] font-medium shrink-0">EasyPub</span>
                        <span className="text-[#b2b2b2] text-[12px] shrink-0">2026-02-04 22:23</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[#b2b2b2] text-[13px]">
                        <span>北京</span>
                        <div className="flex items-center gap-1.5 text-[#576b95]">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3V11H5v-1a7 7 0 0 1 14 0v1h-4v9h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z" />
                          </svg>
                          <span className="font-bold">2734人收听</span>
                        </div>
                      </div>
                    </div>

                    {/* Render real formatted content */}
                    {/* We remove the first title if it exists in the content to avoid duplication */}
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: currentFormattedContent
                            // Removing any block (h1-h6, p, section, div) that contains the main title text
                            .replace(/<(h[1-6]|p|section|div)[^>]*>(?:<[^>]+>)*\s*EasyPub[：:][\s\S]*?排版助手\s*(?:<\/[^>]+>)*<\/\1>/i, '')
                          .replace(/<(section|div|p)[^>]*>\s*<\/\1>/gi, '') // Clean up empty containers
                          .replace(/margin-top:\s*-\d+(\.\d+)?em/gi, 'margin-top: 0') // Fix overlap for specific styles like "Logic Thinking"
                        }}
                      />
                  </div>
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
