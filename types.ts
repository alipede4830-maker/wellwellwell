export type NavRoute =
  | 'home'
  | 'education'
  | 'education/software'
  | 'education/amt'
  | 'education/volume-profile'
  | 'education/tpo'
  | 'education/vwap'
  | 'education/dom'
  | 'education/footprint'
  | 'education/heatmap'
  | 'education/psychology'
  | 'education/edge'
  | 'education/creating-models'
  | 'education/vld'
  | 'education/1vw'
  | 'education/os9'
  | 'education/onvp'
  | 'toolkit'
  | 'toolkit/journal'
  | 'toolkit/risk-calculator'
  | 'toolkit/session-timer'
  | 'toolkit/checklist'
  | 'toolkit/calendar'
  | 'toolkit/monte-carlo'
  | 'glossary'
  | 'brain'
  | 'propfirm'
  | 'dashboard'
  | 'login'
  | 'impressum'
  | 'terms'
  | 'privacy'
  | 'disclaimer';

export interface Creator {
  name: string;
  role: 'Owner' | 'Hedge';
  tiktok?: string;
  tiktokHandle?: string;
  discordId?: string;
  discordUserId?: string;
  discordHandle?: string;
  displayName?: string;
  initial?: string;
  color?: string;
  avatar?: string;
}

export interface VideoLesson {
  id: string;
  youtubeId: string;
  title: string;
  instructor: string;
  thumbnail: string;
}

export interface SearchResultItem {
  title: string;
  description: string;
  url: string;
  type: 'page' | 'lesson' | 'glossary' | 'tool';
  category?: string;
}

export interface DomLevel {
  price: number;
  delta: number;
  mktSell: number;
  mktBuy: number;
  lmtBid: number;
  lmtAsk: number;
  pull: number;
  avgSize: number;
}

export interface TimeAndSaleTrade {
  id: string;
  time: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
}

export interface GraphNode {
  id: string;
  label: string;
  category: 'Foundation' | 'Structure' | 'Orderflow' | 'Psychology' | 'Tools';
  x: number;
  y: number;
  description: string;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  shortDesc: string;
}

export interface JournalTrade {
  id: string;
  date: string;
  instrument: string;
  setup: string;
  entryPrice: number;
  exitPrice: number;
  direction: 'LONG' | 'SHORT';
  pnl: number;
  status: 'WIN' | 'LOSS' | 'BE';
  notes?: string;
  disciplineRating: number;
}

export interface EducationArticle {
  slug: string;
  title: string;
  category: string;
  subtitle: string;
  readTime: string;
  seoTitle: string;
  seoDescription: string;
  leadParagraph: string;
  sections: {
    heading: string;
    subheading?: string;
    content: string[];
    callout?: string;
    diagramLabel?: string;
    keyPoints?: string[];
  }[];
}
