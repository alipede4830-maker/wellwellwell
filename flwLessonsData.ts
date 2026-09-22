import lessonsJson from './flwLessonsData.json';

export interface QuizQuestion {
  question: string;
  options: string[];
  correct?: number;
  explanation?: string;
}

export interface TableOfContentItem {
  id: string;
  title: string;
  level: number;
}

export interface LessonItem {
  slug: string;
  phase: string;
  phaseNum: string;
  phaseTitle: string;
  category: string;
  title: string;
  subtitle: string;
  readTime: string;
  author: string;
  authorAvatar: string;
  tableOfContents: TableOfContentItem[];
  contentMarkdown: string;
  quizQuestions?: QuizQuestion[] | null;
}

export const LESSONS_DATA: LessonItem[] = lessonsJson as LessonItem[];

export const LESSONS_BY_SLUG: Record<string, LessonItem> = LESSONS_DATA.reduce(
  (acc, item) => {
    acc[item.slug] = item;
    return acc;
  },
  {} as Record<string, LessonItem>
);

export interface CurriculumPhase {
  phase: string;
  phaseNum: string;
  title: string;
  desc: string;
  lessons: {
    slug: string;
    title: string;
    subtitle: string;
    category: string;
    readTime: string;
    badge?: string;
  }[];
}

export const CURRICULUM_PHASES: CurriculumPhase[] = [
  {
    phase: 'Phase 01',
    phaseNum: '01',
    title: 'Software Setup',
    desc: 'Pick the right platform before you start.',
    lessons: [
      {
        slug: 'software',
        title: 'Trading Software',
        subtitle: 'Compare platforms (Quantower, ATAS, MotiveWave, Sierra Chart)',
        category: 'Software Setup',
        readTime: '3 min read'
      }
    ]
  },
  {
    phase: 'Phase 02',
    phaseNum: '02',
    title: 'Core Knowledge',
    desc: 'The theoretical foundation. Auction Market Theory, volume profiling, and reading the tape.',
    lessons: [
      {
        slug: 'amt',
        title: 'Auction Market Theory',
        subtitle: 'The universal mechanics of financial markets',
        category: 'Core Knowledge',
        readTime: '16 min read',
        badge: 'Foundation'
      },
      {
        slug: 'volume-profile',
        title: 'Volume Profile',
        subtitle: 'Value areas',
        category: 'Core Knowledge',
        readTime: '7 min read'
      },
      {
        slug: 'tpo',
        title: 'TPO',
        subtitle: 'Time at price',
        category: 'Core Knowledge',
        readTime: '12 min read'
      },
      {
        slug: 'footprint',
        title: 'Footprint',
        subtitle: 'Inside the candle',
        category: 'Core Knowledge',
        readTime: '1 min read'
      },
      {
        slug: 'dom',
        title: 'DOM',
        subtitle: 'Order book',
        category: 'Core Knowledge',
        readTime: '9 min read'
      },
      {
        slug: 'vwap',
        title: 'VWAP',
        subtitle: 'Fair value anchor',
        category: 'Core Knowledge',
        readTime: '6 min read'
      },
      {
        slug: 'heatmap',
        title: 'Heatmap',
        subtitle: 'Liquidity map',
        category: 'Core Knowledge',
        readTime: '1 min read'
      }
    ]
  },
  {
    phase: 'Phase 03',
    phaseNum: '03',
    title: 'Psychology & Edge',
    desc: 'Your edge is fragile. Your mind protects it.',
    lessons: [
      {
        slug: 'psychology',
        title: 'Psychology',
        subtitle: 'Two minds, one trader: conquering subconscious tilt',
        category: 'Psychology & Edge',
        readTime: '9 min read'
      },
      {
        slug: 'edge',
        title: 'Finding Your Edge',
        subtitle: 'The five non-negotiable pillars of trading edge',
        category: 'Psychology & Edge',
        readTime: '2 min read'
      }
    ]
  },
  {
    phase: 'Phase 04',
    phaseNum: '04',
    title: 'Trading Models',
    desc: 'Context + Trigger = Execution. Four proven setups.',
    lessons: [
      {
        slug: 'vld',
        title: 'VLD Model',
        subtitle: 'Value Level Deviation',
        category: 'Trading Models',
        readTime: '4 min read'
      },
      {
        slug: '1vw',
        title: '1VW Model',
        subtitle: 'One VWAP Wide',
        category: 'Trading Models',
        readTime: '4 min read'
      },
      {
        slug: 'os9',
        title: 'OS9 Model',
        subtitle: 'Overlapping Setup',
        category: 'Trading Models',
        readTime: '3 min read'
      },
      {
        slug: 'onvp',
        title: 'ONVP Model',
        subtitle: 'Overnight Volume Profile',
        category: 'Trading Models',
        readTime: '3 min read'
      },
      {
        slug: 'creating-models',
        title: 'Creating Models',
        subtitle: 'Building your toolset and execution checklist',
        category: 'Trading Models',
        readTime: '5 min read'
      }
    ]
  }
];
