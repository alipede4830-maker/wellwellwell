import { NavRoute } from '../types';

export const ROUTE_MAP: Record<string, { route: NavRoute; title: string; desc: string }> = {
  '/': {
    route: 'home',
    title: 'FLW - Professional Orderflow Education',
    desc: 'Learn to read what most traders never see. Free open orderflow education, auction market theory, depth of market, and institutional volume profiles.'
  },
  '/education': {
    route: 'education',
    title: 'The Curriculum | FLW',
    desc: 'A structured orderflow trading education path from zero to professional. Learn AMT, Volume Profile, Depth of Market, and Psychology.'
  },
  '/education/amt': {
    route: 'education/amt',
    title: 'Auction Market Theory | orderflw | FLW',
    desc: 'What is Auction Market Theory? AMT is a framework for understanding how financial markets operate at their most basic level through continuous double auctions.'
  },
  '/education/volume-profile': {
    route: 'education/volume-profile',
    title: 'Volume Profile | orderflw | FLW',
    desc: 'What is Volume Profile? Visualizing traded volume horizontally across price levels to reveal value areas, POC, HVNs, and LVNs.'
  },
  '/education/tpo': {
    route: 'education/tpo',
    title: 'Time Price Opportunity | orderflw | FLW',
    desc: 'What is Time Price Opportunity? Understanding Market Profile 30-minute letter brackets, Initial Balance, Excess, and Single Prints.'
  },
  '/education/vwap': {
    route: 'education/vwap',
    title: 'Volume Weighted Average Price | orderflw | FLW',
    desc: 'Master institutional benchmark pricing with session and anchored VWAP plus standard deviation distribution bands.'
  },
  '/education/dom': {
    route: 'education/dom',
    title: 'Depth of Market | orderflw | FLW',
    desc: 'What is Depth of Market? Microscopic limit book reading, aggressive market executions, passive iceberg absorption, and pulling & stacking.'
  },
  '/education/psychology': {
    route: 'education/psychology',
    title: 'Psychology | orderflw | FLW',
    desc: 'Two Minds, One Trader. How to overcome subconscious emotional traps, conquer FOMO, manage tilt, and maintain ruthless execution discipline.'
  },
  '/toolkit': {
    route: 'toolkit',
    title: 'Toolkit | FLW',
    desc: 'Orderflow trading tools: Futures Position Size Calculator, Pre-Trade Checklist, Trade Journal, and Monte Carlo Simulator.'
  },
  '/toolkit/risk-calculator': {
    route: 'toolkit/risk-calculator',
    title: 'Risk Calculator | FLW Toolkit',
    desc: 'Calculate precise futures position sizing, tick values, and max dollar risk per contract.'
  },
  '/toolkit/checklist': {
    route: 'toolkit/checklist',
    title: 'Pre-Trade Checklist | FLW Toolkit',
    desc: 'Enforce professional trade validation before executing any market or limit order.'
  },
  '/toolkit/journal': {
    route: 'toolkit/journal',
    title: 'Trade Journal | FLW Toolkit',
    desc: 'Persistent execution logging with win rate, net P&L tracking, and discipline scoring.'
  },
  '/toolkit/monte-carlo': {
    route: 'toolkit/monte-carlo',
    title: 'Monte Carlo Simulator | FLW Toolkit',
    desc: 'Simulate 1,000 runs of 100 consecutive trades to evaluate probability of drawdown and system edge.'
  },
  '/glossary': {
    route: 'glossary',
    title: 'Glossary | FLW',
    desc: 'Searchable dictionary of 50+ orderflow and auction trading terms: POC, VAH, VAL, HVN, LVN, Delta, CVD, VWAP, and Absorption.'
  },
  '/brain': {
    route: 'brain',
    title: 'Knowledge Brain | FLW',
    desc: 'Interactive force-directed knowledge graph of the FLW orderflow education curriculum with 140+ concepts.'
  },
  '/propfirm': {
    route: 'propfirm',
    title: 'Prop Firms | FLW',
    desc: 'Futures prop firms we recommend, featuring our funded partner Onyx Futures with exclusive code CLAUDIO.'
  },
  '/dashboard': {
    route: 'dashboard',
    title: 'Trader Dashboard | FLW',
    desc: 'Member command center with persistent trade journal summary, checklist status, and study roadmap.'
  },
  '/login': {
    route: 'login',
    title: 'Sign In | FLW Members',
    desc: 'Access your persistent orderflow trade journal and personal checklist.'
  },
  '/impressum': {
    route: 'impressum',
    title: 'Imprint | FLW',
    desc: 'Legal information and platform ownership details for FLW (orderflw.com).'
  },
  '/terms': {
    route: 'terms',
    title: 'Terms of Service | FLW',
    desc: 'Terms of service and user agreements for FLW (orderflw.com).'
  },
  '/privacy': {
    route: 'privacy',
    title: 'Privacy Policy | FLW',
    desc: 'Privacy policy and data governance practices at FLW (orderflw.com).'
  },
  '/disclaimer': {
    route: 'disclaimer',
    title: 'Risk Disclaimer | FLW',
    desc: 'Risk disclaimer regarding trading and financial market operations.'
  },
  '/toolkit/session-timer': {
    route: 'toolkit/session-timer',
    title: 'Session Timer | FLW Toolkit',
    desc: 'Real-time countdown and active status for Asia, London, New York RTH and electronic futures sessions.'
  },
  '/toolkit/calendar': {
    route: 'toolkit/calendar',
    title: 'Economic Calendar | FLW Toolkit',
    desc: 'High-impact macroeconomic releases, FOMC, CPI, NFP events that move auction market liquidity.'
  }
};

export function getRouteFromPath(path: string): NavRoute {
  const cleanPath = path.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';
  if (ROUTE_MAP[cleanPath]) {
    return ROUTE_MAP[cleanPath].route;
  }
  // Sub-path fuzzy matching
  if (cleanPath.startsWith('/education/')) {
    const slug = cleanPath.replace('/education/', '');
    return `education/${slug}` as NavRoute;
  }
  if (cleanPath.startsWith('/toolkit/')) {
    const tool = cleanPath.replace('/toolkit/', '');
    return `toolkit/${tool}` as NavRoute;
  }
  if (cleanPath.startsWith('/glossary')) return 'glossary';
  if (cleanPath.startsWith('/brain')) return 'brain';
  if (cleanPath.startsWith('/propfirm')) return 'propfirm';
  if (cleanPath.startsWith('/dashboard')) return 'dashboard';
  if (cleanPath.startsWith('/impressum')) return 'impressum';
  if (cleanPath.startsWith('/terms')) return 'terms';
  if (cleanPath.startsWith('/privacy')) return 'privacy';
  if (cleanPath.startsWith('/disclaimer')) return 'disclaimer';
  return 'home';
}

export function getPathFromRoute(route: NavRoute): string {
  if (route === 'home') return '/';
  return `/${route}`;
}

export function updatePageMetadata(route: NavRoute) {
  const path = getPathFromRoute(route);
  const info = ROUTE_MAP[path] || ROUTE_MAP['/'];
  document.title = info.title;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', info.desc);

  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', info.title);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', info.desc);
}
