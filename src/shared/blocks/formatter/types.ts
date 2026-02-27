export enum StyleType {
  RED_INSIGHT_LITE = 'Red Insight Lite',
  ORANGE_PULSE_BRIEF = 'Orange Pulse Brief',
  NYT = 'New York Times',
  CLAUDE = 'Claude Minimalist',
  LITERARY = 'Classic Literary',
  MODERN_WECHAT = 'Modern WeChat',
  LOGIC = 'Logic Thinking',
  ZEN = 'Zen Minimalist',
  QBIT = 'QbitAI Tech',
  TECH_MAG = 'Tech Magazine',
  DEEP_BLUE_BRIEF = 'Deep Blue Brief',
}

export interface FormattingOption {
  id: StyleType;
  name: string;
  description: string;
  previewColor: string;
}

export interface ImagePlan {
  artStyle: string;
  images: {
    prompt: string;
    positionKeyword: string;
  }[];
}

export interface CustomTemplateImageStyles {
  wrapperStyle: string;
  imgStyle: string;
}

export interface CustomTemplateMeta {
  id: string;
  name: string;
  prompt: string;
  sourceUrl?: string;
  createdAt: number;
  palette?: Record<string, string> | null;
  imageBlock?: CustomTemplateImageStyles | null;
}

export const FORMATTING_OPTIONS: FormattingOption[] = [
  {
    id: StyleType.RED_INSIGHT_LITE,
    name: '红色洞察',
    description: '红色编号标题与渐变高亮，组件化表达清晰，公众号兼容优先。',
    previewColor: 'bg-[#DC2626]',
  },
  {
    id: StyleType.ORANGE_PULSE_BRIEF,
    name: '橙势简报',
    description: '橙色编号+橙底标题条，正文节奏强，适合观点型与商业分析类内容。',
    previewColor: 'bg-[#ff8124]',
  },
  {
    id: StyleType.DEEP_BLUE_BRIEF,
    name: '深蓝简报',
    description: '深蓝主色搭配金色点缀，编号条与内容淡蓝背景，沉稳清晰。',
    previewColor: 'bg-[#0762D2]',
  },
  {
    id: StyleType.TECH_MAG,
    name: '科技杂志',
    description: '网格背景，橙色胶囊标题，卡片式引用，极具现代科技感。',
    previewColor: 'bg-[#c66e49]',
  },
  {
    id: StyleType.QBIT,
    name: '量子位',
    description: '科技感强的青绿色主调，左侧高亮边框，适合前沿科技报道。',
    previewColor: 'bg-[#00997f]',
  },
  {
    id: StyleType.LOGIC,
    name: '罗辑思维',
    description: '经典的橙色L型边框与灰色底纹，理性且极具辨识度。',
    previewColor: 'bg-[#e36c09]',
  },
  {
    id: StyleType.ZEN,
    name: '极简禅意',
    description: '大字间距与留白，搭配动态波纹分隔符，轻盈且治愈。',
    previewColor: 'bg-[#f0f0f0]',
  },
  {
    id: StyleType.MODERN_WECHAT,
    name: '知识大V',
    description: '经典橙色主调，卡片式引用，适合深度阅读与观点输出。',
    previewColor: 'bg-orange-500',
  },
  {
    id: StyleType.NYT,
    name: '纽约时报',
    description: '经典衬线字体，首字下沉，极简且权威。',
    previewColor: 'bg-slate-800',
  },
  {
    id: StyleType.CLAUDE,
    name: 'Claude 极简',
    description: '现代无衬线，高对比度，适合技术与评论。',
    previewColor: 'bg-[#b56a5d]',
  },
  {
    id: StyleType.LITERARY,
    name: '文艺书信',
    description: '柔和背景，居中版式，适合散文与情感。',
    previewColor: 'bg-[#5c7c68]',
  },
];
