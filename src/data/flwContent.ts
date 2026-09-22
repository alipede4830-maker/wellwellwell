import { Creator, VideoLesson, SearchResultItem, GraphNode, GraphEdge, GlossaryTerm, EducationArticle } from '../types';

export const DAILY_QUOTES = [
  "Process over outcome. A losing trade taken with discipline is a win for your system.",
  "Your journal is your edge. If you're not reviewing, you're not improving.",
  "Risk management is not optional. Define your max loss before the session starts.",
  "Trading is a game of probabilities. No single trade matters. The process matters.",
  "When in doubt, sit out. The market will be there tomorrow.",
  "The goal is not to be right. The goal is to follow your plan and manage risk.",
  "Revenge trading is your subconscious trying to undo pain. Recognize it. Walk away.",
  "Boredom is not a setup. If you're forcing trades, you're bleeding edge.",
  "Your worst losses come after your best wins. Stay humble, stay disciplined.",
  "Fear of missing out leads to chasing. Chasing leads to poor entries. Poor entries lead to tilt.",
  "Confidence comes from preparation, not from your last trade.",
  "The market doesn't care about your position. Detach your ego from your P&L.",
  "A break after a loss is not weakness. It's the strongest move you can make.",
  "Consistency beats intensity. Show up with the same process every single day.",
  "Discipline is doing the boring thing when your emotions scream for action.",
  "Your edge is fragile. One emotional trade can undo a week of disciplined work.",
  "Master your emotions first. The market will teach you everything else.",
  "The best traders are not fearless. They feel the fear and follow the plan anyway.",
  "Size down when you're off. There's no shame in protecting your capital and your confidence."
];

export const CREATORS: Creator[] = [
  {
    name: 'Claudio',
    role: 'Owner',
    tiktok: 'es.claudio',
    discordId: '1254034015338369050',
    initial: 'C',
    color: '#3a8bff',
  },
  {
    name: 'Jannes',
    role: 'Owner',
    tiktok: 'jznnes',
    discordId: '1249652457429139479',
    initial: 'J',
    color: '#ff4a4a',
  },
  {
    name: 'Hedge',
    role: 'Hedge',
    tiktok: 'pvqry',
    discordId: '488973055473745921',
    initial: 'H',
    color: '#22d68f',
  }
];

export const VIDEO_LESSONS: VideoLesson[] = [
  {
    id: 'vid-1',
    youtubeId: 'ZFNQfzhaKcE',
    title: 'Education #1: Context Building',
    instructor: '@Hedge',
    thumbnail: 'https://img.youtube.com/vi/ZFNQfzhaKcE/maxresdefault.jpg'
  },
  {
    id: 'vid-2',
    youtubeId: 'u0UiVL7YUUM',
    title: 'Education #2: TPO Analogy',
    instructor: '@Hedge',
    thumbnail: 'https://img.youtube.com/vi/u0UiVL7YUUM/maxresdefault.jpg'
  },
  {
    id: 'vid-3',
    youtubeId: 'J8cxMfat6H0',
    title: 'Weekly Class #3: TPO & VWAP',
    instructor: '@3rik',
    thumbnail: 'https://img.youtube.com/vi/J8cxMfat6H0/maxresdefault.jpg'
  }
];

/* =========================================================================
   COMPREHENSIVE 50+ INSTITUTIONAL GLOSSARY
   ========================================================================= */
export const GLOSSARY_ITEMS: GlossaryTerm[] = [
  {
    "term": "Absorption",
    "category": "Orderflow & DOM",
    "shortDesc": "When passive limit orders absorb aggressive market orders without significant price movement.",
    "definition": "When passive limit orders absorb aggressive market orders without significant price movement. Indicates strong conviction at a price level where large resting orders consume incoming aggression."
  },
  {
    "term": "Aggressor",
    "category": "Orderflow & DOM",
    "shortDesc": "A market participant who initiates a trade by crossing the spread, buying at the ask or selling at the bid.",
    "definition": "A market participant who initiates a trade by crossing the spread, buying at the ask or selling at the bid. Aggressors use market orders and represent urgency and conviction."
  },
  {
    "term": "Algo Spoofing",
    "category": "Orderflow & DOM",
    "shortDesc": "Automated spoofing executed by algorithms that place and cancel large orders at high speed to manipulate the perception of supply and demand.",
    "definition": "Automated spoofing executed by algorithms that place and cancel large orders at high speed to manipulate the perception of supply and demand. These patterns are often visible on the heatmap as rapidly flickering liquidity."
  },
  {
    "term": "Anchored VWAP",
    "category": "VWAP",
    "shortDesc": "A VWAP calculation that begins from a user defined point in time rather than the session open.",
    "definition": "A VWAP calculation that begins from a user defined point in time rather than the session open. Traders anchor VWAP to significant events like earnings, swing highs/lows, or breakouts to track the average price from that reference."
  },
  {
    "term": "Ask",
    "category": "Orderflow & DOM",
    "shortDesc": "The lowest price at which a seller is willing to sell.",
    "definition": "The lowest price at which a seller is willing to sell. Also called the offer. The ask represents the best available price for buyers wanting immediate execution."
  },
  {
    "term": "Auction Market Theory",
    "category": "Auction Market Theory",
    "shortDesc": "A framework that explains how markets facilitate trade between buyers and sellers through a continuous two way auction process.",
    "definition": "A framework that explains how markets facilitate trade between buyers and sellers through a continuous two way auction process. Price moves to find levels where both sides agree to transact, oscillating between balance and imbalance."
  },
  {
    "term": "Balance",
    "category": "Auction Market Theory",
    "shortDesc": "A market state where price rotates within a defined range, indicating agreement on value between buyers and sellers.",
    "definition": "A market state where price rotates within a defined range, indicating agreement on value between buyers and sellers. Volume builds in the center and thins at extremes. Also called bracketing or consolidation."
  },
  {
    "term": "Bid",
    "category": "Orderflow & DOM",
    "shortDesc": "The highest price at which a buyer is willing to buy.",
    "definition": "The highest price at which a buyer is willing to buy. The bid represents the best available price for sellers wanting immediate execution. Bids are passive, resting limit orders on the buy side."
  },
  {
    "term": "Bid Ask Spread",
    "category": "Orderflow & DOM",
    "shortDesc": "The difference between the best bid and best ask price.",
    "definition": "The difference between the best bid and best ask price. A tighter spread indicates higher liquidity. The spread is the cost of immediacy, what you pay to execute now rather than wait."
  },
  {
    "term": "Composite Profile",
    "category": "Volume Profile",
    "shortDesc": "A Volume Profile or Market Profile built over multiple sessions.",
    "definition": "A Volume Profile or Market Profile built over multiple sessions. Used to identify longer term value areas, high volume nodes, and structural reference points that single session profiles may not reveal."
  },
  {
    "term": "Cumulative Delta",
    "category": "Orderflow & DOM",
    "shortDesc": "The running total of delta (buying volume minus selling volume) over a given period.",
    "definition": "The running total of delta (buying volume minus selling volume) over a given period. Tracks the net aggression over time. Divergences between cumulative delta and price can signal exhaustion or hidden strength."
  },
  {
    "term": "Delta",
    "category": "Orderflow & DOM",
    "shortDesc": "The difference between buying volume (trades at the ask) and selling volume (trades at the bid) at a price level or over a bar.",
    "definition": "The difference between buying volume (trades at the ask) and selling volume (trades at the bid) at a price level or over a bar. Positive delta means more aggressive buying; negative delta means more aggressive selling."
  },
  {
    "term": "Delta Divergence",
    "category": "Orderflow & DOM",
    "shortDesc": "When price makes a new high or low but delta does not confirm the move.",
    "definition": "When price makes a new high or low but delta does not confirm the move. For example, price makes a higher high but delta prints a lower high, signaling weakening aggression and potential exhaustion."
  },
  {
    "term": "Depth of Market",
    "category": "Orderflow & DOM",
    "shortDesc": "A display of all resting limit orders at each price level above and below the current price.",
    "definition": "A display of all resting limit orders at each price level above and below the current price. The DOM (or order book / ladder) shows the queue of passive buyers and sellers and how liquidity is distributed."
  },
  {
    "term": "Excess",
    "category": "TPO & Market Profile",
    "shortDesc": "Single prints or long tails at the extremes of a Market Profile, indicating aggressive rejection of price.",
    "definition": "Single prints or long tails at the extremes of a Market Profile, indicating aggressive rejection of price. Excess at a high or low suggests strong responsive activity and a clean auction endpoint."
  },
  {
    "term": "Exhaustion",
    "category": "Orderflow & DOM",
    "shortDesc": "When aggressive participants run out of conviction or capital.",
    "definition": "When aggressive participants run out of conviction or capital. Often visible as high volume with diminishing price movement, delta divergence, or absorption. Signals a potential reversal."
  },
  {
    "term": "Fair Value",
    "category": "Auction Market Theory",
    "shortDesc": "The price area where the most trade facilitation occurs, where buyers and sellers most agree on price.",
    "definition": "The price area where the most trade facilitation occurs, where buyers and sellers most agree on price. Typically represented by the Point of Control or the center of a value area. Price tends to return to fair value after excursions."
  },
  {
    "term": "Fill or Kill",
    "category": "General",
    "shortDesc": "An order type that must be executed in its entirety immediately or cancelled completely.",
    "definition": "An order type that must be executed in its entirety immediately or cancelled completely. No partial fills are allowed. Used when a trader needs a full position or nothing at all."
  },
  {
    "term": "Finished Auction",
    "category": "Auction Market Theory",
    "shortDesc": "An auction extreme where price was clearly rejected, typically shown by a long tail, excess, or absorption.",
    "definition": "An auction extreme where price was clearly rejected, typically shown by a long tail, excess, or absorption. On the DOM, finished auctions appear when aggressive sellers/buyers are fully absorbed and price reverses with conviction."
  },
  {
    "term": "Heatmap",
    "category": "Heatmap",
    "shortDesc": "A visual representation of resting limit order depth across price and time.",
    "definition": "A visual representation of resting limit order depth across price and time. Bright or dense areas indicate large clusters of liquidity. The heatmap reveals where passive participants are positioning, spoofing activity, and liquidity magnets."
  },
  {
    "term": "High Volume Node",
    "category": "Volume Profile",
    "shortDesc": "A price level or zone on the Volume Profile where a large amount of volume has been traded.",
    "definition": "A price level or zone on the Volume Profile where a large amount of volume has been traded. HVNs act as magnets, and price tends to gravitate toward and spend time at these accepted value levels."
  },
  {
    "term": "Iceberg Order",
    "category": "Orderflow & DOM",
    "shortDesc": "A large order that is only partially displayed on the order book, with the remainder hidden.",
    "definition": "A large order that is only partially displayed on the order book, with the remainder hidden. As the visible portion fills, more is revealed. Used by institutional traders to mask the true size of their position."
  },
  {
    "term": "Imbalance",
    "category": "Auction Market Theory",
    "shortDesc": "A market state where one side (buyers or sellers) overwhelms the other, causing directional price movement.",
    "definition": "A market state where one side (buyers or sellers) overwhelms the other, causing directional price movement. Imbalance is identified when volume at the bid or ask at a given price is significantly larger than the opposing side."
  },
  {
    "term": "Initial Balance",
    "category": "TPO & Market Profile",
    "shortDesc": "The price range established during the first hour of Regular Trading Hours (typically the first two 30 minute TPO periods).",
    "definition": "The price range established during the first hour of Regular Trading Hours (typically the first two 30 minute TPO periods). The IB sets the early reference for the session and helps classify the day type."
  },
  {
    "term": "Initiative Activity",
    "category": "Auction Market Theory",
    "shortDesc": "Trading activity that pushes price away from established value.",
    "definition": "Trading activity that pushes price away from established value. Initiative buyers push price above the prior value area; initiative sellers push price below. Represents new information or conviction entering the market."
  },
  {
    "term": "Limit Order",
    "category": "Orderflow & DOM",
    "shortDesc": "A resting order to buy or sell at a specified price or better.",
    "definition": "A resting order to buy or sell at a specified price or better. Limit orders provide liquidity and sit passively on the order book until matched. They do not guarantee execution but guarantee price."
  },
  {
    "term": "Liquidity",
    "category": "Orderflow & DOM",
    "shortDesc": "The availability of resting orders at and around the current price.",
    "definition": "The availability of resting orders at and around the current price. High liquidity means large orders can be filled with minimal price impact. Liquidity clusters at obvious levels like round numbers, prior highs/lows, and value area edges."
  },
  {
    "term": "Liquidity Magnet",
    "category": "Orderflow & DOM",
    "shortDesc": "A large cluster of resting limit orders visible on the heatmap that attracts price.",
    "definition": "A large cluster of resting limit orders visible on the heatmap that attracts price. Price tends to gravitate toward these dense liquidity pools because market orders seek to fill against available resting orders."
  },
  {
    "term": "Liquidity Wall",
    "category": "Orderflow & DOM",
    "shortDesc": "A very large block of resting limit orders at a specific price level visible on the heatmap or DOM.",
    "definition": "A very large block of resting limit orders at a specific price level visible on the heatmap or DOM. Walls can act as support or resistance, but may also be spoofed. Genuine walls often absorb aggression and halt price movement."
  },
  {
    "term": "Liquidity Wipe",
    "category": "Orderflow & DOM",
    "shortDesc": "When price sweeps through a cluster of resting stop orders or a liquidity pool, triggering a cascade of executions.",
    "definition": "When price sweeps through a cluster of resting stop orders or a liquidity pool, triggering a cascade of executions. Often engineered moves that reverse shortly after, as the purpose was to fill large orders against the triggered stops."
  },
  {
    "term": "Low Volume Node",
    "category": "Volume Profile",
    "shortDesc": "A price level or zone on the Volume Profile where little volume has been traded.",
    "definition": "A price level or zone on the Volume Profile where little volume has been traded. LVNs act as areas of price rejection and price tends to move quickly through these zones. They often mark transitions between value areas."
  },
  {
    "term": "Market Order",
    "category": "Orderflow & DOM",
    "shortDesc": "An order to buy or sell immediately at the best available price.",
    "definition": "An order to buy or sell immediately at the best available price. Market orders are aggressive, they cross the spread and consume resting liquidity. They guarantee execution but not price."
  },
  {
    "term": "Market Profile",
    "category": "TPO & Market Profile",
    "shortDesc": "A charting methodology developed by J.",
    "definition": "A charting methodology developed by J. Peter Steidlmayer that organizes price data by time, using TPO letters to show how long price traded at each level. Reveals the distribution of time at price, value areas, and structural patterns."
  },
  {
    "term": "Multi Timeframe VWAP",
    "category": "VWAP",
    "shortDesc": "Using multiple VWAP calculations simultaneously (daily, weekly, monthly) to identify confluence zones.",
    "definition": "Using multiple VWAP calculations simultaneously (daily, weekly, monthly) to identify confluence zones. When several VWAPs converge at the same price level, it creates a strong reference point for potential support or resistance."
  },
  {
    "term": "Naked Point of Control",
    "category": "Volume Profile",
    "shortDesc": "A Point of Control from a prior session that has not yet been revisited by price.",
    "definition": "A Point of Control from a prior session that has not yet been revisited by price. Naked POCs act as magnets, unfilled fair value levels that price often returns to test, as the market seeks to retrade areas of prior acceptance."
  },
  {
    "term": "Normal Day",
    "category": "TPO & Market Profile",
    "shortDesc": "A Market Profile day type where the Initial Balance contains most of the day's range.",
    "definition": "A Market Profile day type where the Initial Balance contains most of the day's range. Price stays within or near the IB, indicating balance and two sided trade with no strong directional conviction."
  },
  {
    "term": "Offer",
    "category": "General",
    "shortDesc": "Another term for the Ask.",
    "definition": "Another term for the Ask. The lowest price at which a seller is willing to sell. Offers are passive sell limit orders resting on the order book."
  },
  {
    "term": "Order Flow",
    "category": "Orderflow & DOM",
    "shortDesc": "The real time stream of buy and sell orders hitting the market.",
    "definition": "The real time stream of buy and sell orders hitting the market. Order flow analysis studies how these orders interact, who is aggressive, who is passive, where liquidity sits, and where imbalance exists, to anticipate price movement."
  },
  {
    "term": "Overnight Inventory",
    "category": "TPO & Market Profile",
    "shortDesc": "The net positioning (long or short) accumulated during the overnight or Globex session before Regular Trading Hours open.",
    "definition": "The net positioning (long or short) accumulated during the overnight or Globex session before Regular Trading Hours open. Overnight inventory analysis helps anticipate the opening drive direction based on the 70% correction rule."
  },
  {
    "term": "POC Flip",
    "category": "Volume Profile",
    "shortDesc": "When the Point of Control shifts from one price level to another during a session, indicating a change in where the most volume is being transacted.",
    "definition": "When the Point of Control shifts from one price level to another during a session, indicating a change in where the most volume is being transacted. A POC flip signals a potential shift in fair value and directional intent."
  },
  {
    "term": "Point of Control",
    "category": "Volume Profile",
    "shortDesc": "The price level with the highest traded volume within a given profile (session, composite, or custom).",
    "definition": "The price level with the highest traded volume within a given profile (session, composite, or custom). The POC represents the fairest price, where the most two sided trade occurred. It acts as a key reference and potential magnet for price."
  },
  {
    "term": "Poor High",
    "category": "TPO & Market Profile",
    "shortDesc": "A profile high that lacks single prints or excess, indicating the auction did not complete at that extreme.",
    "definition": "A profile high that lacks single prints or excess, indicating the auction did not complete at that extreme. A poor high suggests buyers were not fully rejected and price may return to retest and repair the incomplete structure."
  },
  {
    "term": "Poor Low",
    "category": "TPO & Market Profile",
    "shortDesc": "A profile low that lacks single prints or excess, indicating the auction did not complete at that extreme.",
    "definition": "A profile low that lacks single prints or excess, indicating the auction did not complete at that extreme. A poor low suggests sellers were not fully rejected and price may return to retest and repair the incomplete structure."
  },
  {
    "term": "Pull Back",
    "category": "General",
    "shortDesc": "A temporary reversal within a larger directional move.",
    "definition": "A temporary reversal within a larger directional move. In order flow terms, a pullback often shows reduced delta or declining aggression in the counter trend direction, indicating the larger move is likely to resume."
  },
  {
    "term": "Pulling",
    "category": "Orderflow & DOM",
    "shortDesc": "When a large resting order on the DOM is removed before being filled.",
    "definition": "When a large resting order on the DOM is removed before being filled. Pulling bids signals weakening buy side support; pulling offers signals weakening sell side resistance. Often a precursor to price moving away from that level."
  },
  {
    "term": "Range Extension",
    "category": "General",
    "shortDesc": "Price activity that extends beyond the Initial Balance.",
    "definition": "Price activity that extends beyond the Initial Balance. Range extension indicates initiative activity and directional conviction. The more range extension, the stronger the move and the more likely the day trends."
  },
  {
    "term": "Regular Trading Hours",
    "category": "General",
    "shortDesc": "The primary trading session for a given market (e.g., 9:30 AM to 4:00 PM ET for US equities).",
    "definition": "The primary trading session for a given market (e.g., 9:30 AM to 4:00 PM ET for US equities). RTH is when the most volume and institutional participation occurs. Many profile based references are built around RTH data."
  },
  {
    "term": "Responsive Activity",
    "category": "Auction Market Theory",
    "shortDesc": "Trading that pushes price back toward established value.",
    "definition": "Trading that pushes price back toward established value. Responsive buyers step in below value; responsive sellers step in above value. The market self corrects as participants fade moves away from fair price."
  },
  {
    "term": "Rotation",
    "category": "Auction Market Theory",
    "shortDesc": "A price swing within a balanced range.",
    "definition": "A price swing within a balanced range. In a bracketing market, price rotates between support and resistance, testing extremes and returning to the middle. Each rotation reveals information about where value is accepted."
  },
  {
    "term": "Rubberbanding",
    "category": "Orderflow & DOM",
    "shortDesc": "A heatmap pattern where a large resting order repeatedly adjusts its price to stay just ahead of the market, pulling price in its direction like a rubber band.",
    "definition": "A heatmap pattern where a large resting order repeatedly adjusts its price to stay just ahead of the market, pulling price in its direction like a rubber band. Indicates a passive participant actively managing their order to attract fills."
  },
  {
    "term": "Session VWAP",
    "category": "VWAP",
    "shortDesc": "The Volume Weighted Average Price calculated from the start of the current trading session.",
    "definition": "The Volume Weighted Average Price calculated from the start of the current trading session. Represents the average price weighted by volume, where the composite trader executed on average. A key intraday reference for institutional participation."
  },
  {
    "term": "Single Prints",
    "category": "TPO & Market Profile",
    "shortDesc": "TPO letters that appear only once at a price level on a Market Profile, indicating price moved through that level quickly with little two sided trade.",
    "definition": "TPO letters that appear only once at a price level on a Market Profile, indicating price moved through that level quickly with little two sided trade. Single prints represent initiative activity and can act as future support or resistance."
  },
  {
    "term": "Snapping",
    "category": "Orderflow & DOM",
    "shortDesc": "A heatmap pattern where price rapidly snaps toward a large cluster of resting liquidity.",
    "definition": "A heatmap pattern where price rapidly snaps toward a large cluster of resting liquidity. The presence of a dense liquidity pool acts as a magnet, and once price begins moving in that direction, it accelerates toward the resting orders."
  },
  {
    "term": "Spoofing",
    "category": "Orderflow & DOM",
    "shortDesc": "The illegal practice of placing large orders with the intent to cancel before execution, designed to deceive other participants about supply and demand.",
    "definition": "The illegal practice of placing large orders with the intent to cancel before execution, designed to deceive other participants about supply and demand. Spoof orders create a false impression of liquidity to manipulate price."
  },
  {
    "term": "Stacked Imbalances",
    "category": "Auction Market Theory",
    "shortDesc": "Multiple consecutive price levels showing bid ask imbalance in the same direction.",
    "definition": "Multiple consecutive price levels showing bid ask imbalance in the same direction. Three or more stacked imbalances signal strong aggressive activity and often mark the beginning of a directional move or key support/resistance."
  },
  {
    "term": "Stacking",
    "category": "Orderflow & DOM",
    "shortDesc": "When additional limit orders are added to an existing level on the DOM, increasing the visible size.",
    "definition": "When additional limit orders are added to an existing level on the DOM, increasing the visible size. Stacking bids signals growing buy side conviction; stacking offers signals growing sell side conviction. The opposite of pulling."
  },
  {
    "term": "Stop Order",
    "category": "Orderflow & DOM",
    "shortDesc": "An order that becomes a market order once a specified price is reached.",
    "definition": "An order that becomes a market order once a specified price is reached. Buy stops rest above current price; sell stops rest below. Clusters of stop orders create liquidity pools that can accelerate moves when triggered."
  },
  {
    "term": "Time Price Opportunity",
    "category": "General",
    "shortDesc": "A letter or block assigned to each 30 minute period on a Market Profile.",
    "definition": "A letter or block assigned to each 30 minute period on a Market Profile. Each TPO represents that price was visited during that time bracket. The accumulation of TPOs at each price builds the profile's shape and reveals the time based value distribution."
  },
  {
    "term": "TPO Count",
    "category": "TPO & Market Profile",
    "shortDesc": "The total number of Time Price Opportunities at a given price level.",
    "definition": "The total number of Time Price Opportunities at a given price level. A higher TPO count means price spent more time at that level, indicating greater acceptance. TPO count is the time based equivalent of volume."
  },
  {
    "term": "Trend Day",
    "category": "TPO & Market Profile",
    "shortDesc": "A Market Profile day type characterized by strong directional movement from open to close with little rotation.",
    "definition": "A Market Profile day type characterized by strong directional movement from open to close with little rotation. The profile is elongated with a narrow shape. Trend days feature range extension, single prints, and initiative activity throughout."
  },
  {
    "term": "Unfinished Auction",
    "category": "Auction Market Theory",
    "shortDesc": "An auction extreme (high or low) that lacks excess or proper rejection, suggesting the market has not completed its price discovery in that direction.",
    "definition": "An auction extreme (high or low) that lacks excess or proper rejection, suggesting the market has not completed its price discovery in that direction. Unfinished auctions are likely to be revisited as the market seeks to complete its work."
  },
  {
    "term": "Value Area",
    "category": "Volume Profile",
    "shortDesc": "The price range encompassing approximately 70% of the volume (or TPOs) in a given profile.",
    "definition": "The price range encompassing approximately 70% of the volume (or TPOs) in a given profile. The value area represents where the majority of trade occurred, the zone of price acceptance. It is bounded by the Value Area High and Value Area Low."
  },
  {
    "term": "Value Area High",
    "category": "Volume Profile",
    "shortDesc": "The upper boundary of the Value Area.",
    "definition": "The upper boundary of the Value Area. The VAH is a key reference point. Price trading above the prior VAH suggests initiative buying and acceptance of higher prices. It often acts as support once reclaimed or resistance when tested from below."
  },
  {
    "term": "Value Area Low",
    "category": "Volume Profile",
    "shortDesc": "The lower boundary of the Value Area.",
    "definition": "The lower boundary of the Value Area. The VAL is a key reference point. Price trading below the prior VAL suggests initiative selling and acceptance of lower prices. It often acts as resistance once lost or support when tested from above."
  },
  {
    "term": "Volume Profile",
    "category": "Volume Profile",
    "shortDesc": "A charting tool that displays the total volume traded at each price level over a given period, plotted as a horizontal histogram.",
    "definition": "A charting tool that displays the total volume traded at each price level over a given period, plotted as a horizontal histogram. Unlike time based volume, Volume Profile reveals where activity concentrated, highlighting nodes, value areas, and the POC."
  },
  {
    "term": "Volume Weighted Average Price",
    "category": "General",
    "shortDesc": "The average price of an instrument weighted by the volume traded at each price.",
    "definition": "The average price of an instrument weighted by the volume traded at each price. VWAP represents the benchmark price institutions use to evaluate execution quality. Trading above VWAP indicates net buying pressure; below indicates net selling."
  },
  {
    "term": "VWAP Standard Deviation",
    "category": "VWAP",
    "shortDesc": "Statistical bands plotted at one, two, or three standard deviations above and below VWAP.",
    "definition": "Statistical bands plotted at one, two, or three standard deviations above and below VWAP. These bands act as dynamic support and resistance levels, representing how far price has deviated from the volume weighted mean."
  }
];

/* =========================================================================
   DEEP EDUCATION ARTICLES (FULL AUTHENTIC TEXTS)
   ========================================================================= */
export const EDUCATION_ARTICLES: Record<string, EducationArticle> = {
  amt: {
    slug: 'amt',
    title: 'Auction Market Theory',
    category: 'Foundation',
    subtitle: 'The Universal Law Governing Financial Markets',
    readTime: '12 min read',
    seoTitle: 'Auction Market Theory | orderflw | FLW',
    seoDescription: 'What is Auction Market Theory? AMT is a framework for understanding how financial markets operate through continuous double-auctions and balance cycles.',
    leadParagraph: 'Auction Market Theory (AMT) is a framework for understanding how financial markets operate at their most basic level. It is not an indicator or an execution strategy, but a structural lens through which market behavior can be observed and understood. From this perspective, financial markets move higher or lower as a result of imbalances in buyer and seller aggression until price reaches a level where that aggression becomes balanced and the greatest amount of trade can occur. This level of balance represents fair value.',
    sections: [
      {
        heading: 'Understanding Fair Value',
        subheading: '70% Distribution and the Point of Control',
        content: [
          'Fair value refers to the price area that facilitates the greatest amount of trade between market participants. At fair value, buyer and seller aggression are closely balanced, resulting in price trading within a relatively tight range while volume remains elevated. When a market is trading at fair value, it is considered to be in a state of balance.',
          'Within the Market Profile framework, traditionalists define fair value as the area containing approximately 70% of a session’s total volume, rather than the statistically derived 68.2%. The point of control serves as the mean of this value area and represents the price level where the highest level of trading activity occurred.',
          'Prices that trade above or below this high-volume fair value area are considered “unfair” prices, as they reflect levels where participation is reduced and the market is not efficiently facilitating trade or accurately reflecting the security’s true value.'
        ],
        callout: 'Rule of thumb: Price advertises opportunity, time regulates opportunity, and volume validates whether the market accepts that price.'
      },
      {
        heading: 'The Auction Cycle',
        subheading: 'Transitioning Between Balance and Imbalance',
        content: [
          'The auction cycle describes how financial markets continuously transition between balance and imbalance as they seek fair value. When price is trading within a fair value area, buyers and sellers are largely in agreement on price. In this balanced state, participation is high, volume is elevated, and the market efficiently facilitates trade. Price typically remains range-bound as the greatest amount of trading activity occurs.',
          'This balance can be disrupted by a market event or a shift in participant behavior, creating an imbalance between supply and demand. As buyer or seller aggression begins to dominate, price moves directionally away from the established fair value area. During this phase, some participants withdraw as price no longer represents fair value to them, leaving only more aggressive buyers or sellers willing to transact at increasingly higher or lower prices.',
          'As price moves further away from fair value, the market enters a discovery phase. In discovery, the auction is searching for the next price level where participation can increase and balance can be restored. Volume typically declines as price explores areas of lower acceptance. Once the auction reaches an extreme, where participation is minimal, the market begins to rotate back toward prior areas of balance. Historically, this rebalancing process results in a high probability, often referenced as approximately 80%, that price will revisit the previous value area.'
        ],
        keyPoints: [
          'Phase 1: Balance (Consensus, high volume, rotational behavior)',
          'Phase 2: Imbalance (Initiative activity, urgent price discovery, declining volume)',
          'Phase 3: Excess & Rejection (Unfair price confirmed at extremes)',
          'Phase 4: New Fair Value (Re-balancing established at a new level)'
        ]
      },
      {
        heading: 'Balanced Auction ➥ Ranging Market',
        subheading: 'Sustained Two-Sided Activity',
        content: [
          'A Balanced Auction describes a market environment in which price is being actively accepted by participants over time. In this condition, the market is not attempting to move price higher or lower, but instead focuses on facilitating trade at currently accepted levels. The defining characteristic of a balanced auction is sustained two-sided activity, where both buyers and sellers are willing to transact without requiring meaningful price movement.',
          'Balanced auctions often develop after the market has completed a phase of price discovery. Once directional activity subsides and aggressive participants withdraw, the remaining participants transact around prices they collectively perceive as acceptable. This results in stable market behavior, where price movement is driven more by time and participation than by directional intent.',
          'From an analytical perspective, balanced auctions establish clear reference areas. When price later returns to a previously balanced area, the market will often either accept or reject these levels based on prior participation.'
        ]
      },
      {
        heading: 'Imbalanced Auction ➥ Trending Market',
        subheading: 'One-Sided Dominance and Value Migration',
        content: [
          'An Imbalanced Auction describes a market environment in which price is no longer being efficiently accepted and one side of the market becomes dominant. In this condition, the market is not focused on facilitating trade, but on moving price in order to resolve disagreement. Participation becomes uneven as aggressive buyers or sellers are willing to transact at increasingly higher or lower prices.',
          'Imbalanced auctions typically emerge when new information, shifting expectations, or strong initiative activity enters the market. As price moves away from prior areas of acceptance, participation thins and transactions occur at fewer price levels. This behavior reflects urgency rather than agreement, with market participants prioritizing execution over price efficiency.'
        ],
        callout: 'In terms of AMT, the market is always cycling from balance to imbalance to balance to imbalance continuously.'
      }
    ]
  },
  'volume-profile': {
    slug: 'volume-profile',
    title: 'Volume Profile',
    category: 'Structure',
    subtitle: 'Visualizing Liquidity Distribution by Price',
    readTime: '10 min read',
    seoTitle: 'Volume Profile | orderflw | FLW',
    seoDescription: 'What is Volume Profile? Visualizing traded volume horizontally across price levels to reveal value areas, POC, HVNs, and LVNs.',
    leadParagraph: 'Volume Profile (VP) is a market analysis tool used to visualize where trading activity has occurred across different price levels. It organizes traded volume horizontally by price, rather than over time, revealing where the market has facilitated the most and least amount of trade. Volume Profile is not a trading strategy, but a structural framework for identifying value, balance, and participation within the auction.',
    sections: [
      {
        heading: 'The Value Area (VA, VAH, VAL)',
        subheading: 'The 70% Institutional Core',
        content: [
          'The Value Area represents the range of prices where the majority of trading activity has occurred during a given session. It reflects the zone in which buyers and sellers were most willing to transact, indicating broad agreement on price and efficient trade facilitation.',
          'Within the Volume Profile framework, the Value Area is commonly defined as the range containing approximately 70% of the session’s total traded volume. At the center of this range is the Point of Control (POC), marking the price level with the highest concentration of volume.',
          'The upper boundary of the value area is known as the Value Area High (VAH), while the lower boundary is the Value Area Low (VAL). When price approaches VAH or VAL, the market tests the limits of acceptance and may either rotate back toward the POC or transition into an imbalanced breakout.'
        ]
      },
      {
        heading: 'High Volume Nodes (HVN)',
        subheading: 'Zones of Maximum Agreement',
        content: [
          'High Volume Nodes (HVNs) are price areas where a significant amount of volume has been traded, indicating strong agreement between buyers and sellers. Each HVN represents a prior area of value and contains its own Point of Control (POC).',
          'When price is trading inside an HVN, the market is typically in balance and efficiently facilitating trade. The upper and lower extremes of an HVN define the boundaries of acceptance or rejection. From an Auction Market Theory perspective, these extremes often present high-quality rotational trade ideas.'
        ]
      },
      {
        heading: 'Low Volume Nodes (LVN) & Profile Shelves',
        subheading: 'Inefficient Slip Zones and Sharp Ledges',
        content: [
          'Low Volume Nodes (LVNs) are price areas where relatively little volume has been traded, indicating limited agreement. Each LVN represents a zone where the market moved through price quickly, spending minimal time facilitating trade due to lack of acceptance.',
          'When price enters an LVN, the market is typically in an imbalanced state. Because participation was previously low, these areas offer little structural resistance. Price often either rejects the level violently or travels through the LVN rapidly until it reaches an area of higher participation (HVN).',
          'A Volume Profile Shelf occurs where volume abruptly drops from an HVN to an LVN, forming an optical ledge that frequently triggers sharp rejection.'
        ]
      }
    ]
  },
  tpo: {
    slug: 'tpo',
    title: 'Time Price Opportunity',
    category: 'Structure',
    subtitle: 'Mapping Time, Price, and Market Structure Brackets',
    readTime: '11 min read',
    seoTitle: 'Time Price Opportunity | orderflw | FLW',
    seoDescription: 'What is Time Price Opportunity? Understanding Market Profile 30-minute letter brackets, Initial Balance, Excess, and Single Prints.',
    leadParagraph: 'Time Price Opportunity (TPO), also referred to as Market Profile, organizes intraday trading into 30-minute letter brackets (A, B, C, D...). Developed by J. Peter Steidlmayer at the Chicago Board of Trade (CBOT), TPO isolates the interaction between price and time to reveal whether participants are accepting or rejecting price.',
    sections: [
      {
        heading: 'The Initial Balance (IB)',
        subheading: 'Setting the Baseline for the Day',
        content: [
          'The Initial Balance represents the high and low range established during the first hour of trading (the A and B 30-minute brackets). It provides a baseline against which the rest of the trading day is measured.',
          'A narrow Initial Balance signals that the market is awaiting a directional catalyst and is prone to a high-velocity range extension (trend day). A wide Initial Balance suggests that other-timeframe traders participated early, often leading to a rotational, range-bound day inside the IB extremes.'
        ]
      },
      {
        heading: 'Excess vs Poor Extremes',
        subheading: 'Identifying Valid Turns and Unfinished Auctions',
        content: [
          'Excess occurs when a session high or low is characterized by single print letters (at least 2 or 3 single TPOs). Excess proves that price probed an unfair level and was met by violent responsive participation, creating a secure structural top or bottom.',
          'In contrast, a Poor High or Poor Low occurs when an extreme is formed by two or more letters side-by-side without any single prints. This represents an unfinished auction where buyers or sellers lacked conviction. A poor high or low has an exceptionally high probability of being revisited and broken in subsequent sessions.'
        ]
      },
      {
        heading: 'Single Prints (Liquidity Slivers)',
        subheading: 'Directional Speed Zones',
        content: [
          'Single prints are isolated 30-minute brackets where price moved so rapidly that no overlapping time brackets were created. On future retests, single print zones often act as instant dynamic support or resistance, as market participants rush to defend the directional imbalance.'
        ]
      }
    ]
  },
  vwap: {
    slug: 'vwap',
    title: 'Volume Weighted Average Price',
    category: 'Structure',
    subtitle: 'Institutional Benchmark Pricing & Standard Deviation Bands',
    readTime: '9 min read',
    seoTitle: 'Volume Weighted Average Price | orderflw | FLW',
    seoDescription: 'Master institutional benchmark pricing with session and anchored VWAP plus standard deviation distribution bands.',
    leadParagraph: 'VWAP is the true volume-weighted mean price of an asset, calculated by multiplying price by volume and dividing by total cumulative volume. Unlike simple moving averages, VWAP weights high-volume institutional execution far more heavily than low-volume slippage.',
    sections: [
      {
        heading: 'Standard Deviation Bands (+1SD, +2SD, -1SD, -2SD)',
        subheading: 'Dynamic Bell Curve Envelopes',
        content: [
          'Because financial price distribution resembles a bell curve over statistical intervals, standard deviation bands expand and contract dynamically based on real-time volatility.',
          '68.2% of all trading volume is contained within the ±1 Standard Deviation band. 95.4% is contained within the ±2 Standard Deviation band.',
          'When price touches the +2SD or -2SD band in a rotational market, it represents an extreme statistical excursion, offering high-probability mean-reversion trades back toward the VWAP baseline.'
        ]
      },
      {
        heading: 'Anchored VWAP (aVWAP)',
        subheading: 'Contextual Volume Anchors',
        content: [
          'Anchoring VWAP from major technical events (such as the monthly open, earnings release, or the exact low of an aggressive impulse move) exposes whether the average buyer or seller since that specific event is currently in profit or underwater.'
        ]
      }
    ]
  },
  dom: {
    slug: 'dom',
    title: 'Depth of Market (DOM)',
    category: 'Orderflow',
    subtitle: 'Microscopic Limit Book & Execution Mechanics',
    readTime: '14 min read',
    seoTitle: 'Depth of Market | orderflw | FLW',
    seoDescription: 'What is Depth of Market? Microscopic limit book reading, aggressive market executions, passive iceberg absorption, and pulling & stacking.',
    leadParagraph: 'The Depth of Market (DOM) is a highly personalized and experience-based tool. Reading the DOM cannot be learned solely through written content. It is the electronic order book showing resting limit liquidity (bids and asks) alongside real-time market order executions on the tape.',
    sections: [
      {
        heading: 'Passive vs Aggressive Orders',
        subheading: 'Liquidity Providers vs Liquidity Consumers',
        content: [
          'Limit orders sit passively on the ladder and provide liquidity. They cannot move price; they simply wait to be filled at their designated price level or better.',
          'Market orders consume liquidity. When an aggressive buyer clicks buy at market, their order lifts the resting limit ask. Price moves ONLY when aggressive market orders completely consume the available limit contracts resting at that level.'
        ]
      },
      {
        heading: 'Absorption & Icebergs',
        subheading: 'The True Catalyst Behind Reversals',
        content: [
          'Absorption happens when hundreds or thousands of aggressive market contracts trade at a specific bid or ask, yet price fails to tick through. This confirms that a massive passive participant (often an institutional iceberg) is soaking up every market order.',
          'Once the aggressive traders realize their buying or selling is not moving price, they panic and liquidate, causing an aggressive snap-back reversal.'
        ]
      },
      {
        heading: 'Why We Prefer Raw DOM Over Footprints or Heatmaps',
        subheading: 'Note from the Creators',
        content: [
          'We do not offer Footprint or Heatmap curriculum on orderflw.com. We personally do not use footprints or heatmaps and do not recommend relying on them over the raw DOM ladder.',
          'A footprint chart summarizes history after the candle has formed. The DOM shows live real-time intent, instantaneous queue additions, and genuine cancellations before price moves.'
        ]
      }
    ]
  },
  psychology: {
    slug: 'psychology',
    title: 'Trading Psychology',
    category: 'Psychology',
    subtitle: 'Two Minds, One Trader: Conquering Subconscious Tilt',
    readTime: '11 min read',
    seoTitle: 'Psychology | orderflw | FLW',
    seoDescription: 'Two Minds, One Trader. How to overcome subconscious emotional traps, conquer FOMO, manage tilt, and maintain ruthless execution discipline.',
    leadParagraph: 'Every trader operates with two systems. The conscious mind is the planner. It is slow, logical, and rational. It works when the market is closed or when you are reviewing charts. The subconscious mind is the executor. It is fast, emotional, and driven by survival reflexes, fear, and greed.',
    sections: [
      {
        heading: 'The Emotional Sabotage Loop',
        subheading: 'Why You Move Your Stop Loss',
        content: [
          'When an open trade approaches your stop loss, your subconscious mind perceives that loss as literal physical danger or humiliation. To prevent the pain of realizing a loss, it compels you to move the stop loss wider or double down.',
          'This is why trading rules must be non-negotiable. If you hesitate or negotiate with your subconscious mind mid-trade, the emotional system will win 100% of the time.'
        ]
      },
      {
        heading: 'Process Over Outcome',
        subheading: 'The Mark Douglas Law',
        content: [
          'A winning trade that violated your rules is a toxic, destructive trade because it reinforces bad habits. A losing trade that followed every single parameter of your plan is a successful, professional trade.',
          'Judge your day solely by your discipline score (1-10), completely detached from your P&L.'
        ]
      },
      {
        heading: 'Tilt Mitigation Protocol',
        subheading: 'Systematic Terminal Lockout',
        content: [
          'If you experience two consecutive losses where you felt urge to revenge trade, immediately close the terminal and institute a 30-minute lockout. Step away, reset your breathing, and return only when your rational System 2 is fully back online.'
        ]
      }
    ]
  }
};

/* =========================================================================
   EXPANDED 140+ KNOWLEDGE GRAPH CONCEPTS & CONNECTIONS
   ========================================================================= */
export const KNOWLEDGE_NODES: GraphNode[] = [
  // Foundation (25)
  { id: 'amt', label: 'Auction Market Theory', category: 'Foundation', x: 260, y: 90, description: 'Continuous double-auction framework.' },
  { id: 'fair-value', label: 'Fair Value', category: 'Foundation', x: 190, y: 130, description: 'Price area where greatest volume transacts.' },
  { id: 'balance', label: 'Balance & Range', category: 'Foundation', x: 120, y: 170, description: 'Two-sided agreement and rotational auction.' },
  { id: 'imbalance', label: 'Imbalance & Trend', category: 'Foundation', x: 340, y: 80, description: 'Urgent price discovery searching for new value.' },
  { id: 'excess', label: 'Excess & Rejection', category: 'Foundation', x: 80, y: 220, description: 'Swift rejection confirming unfair price at extremes.' },
  { id: 'discovery', label: 'Price Discovery', category: 'Foundation', x: 220, y: 50, description: 'Directional search for liquidity.' },
  { id: 'advertised-price', label: 'Advertised Price', category: 'Foundation', x: 130, y: 90, description: 'Price advertising to attract buyers or sellers.' },
  { id: 'facilitation', label: 'Trade Facilitation', category: 'Foundation', x: 290, y: 140, description: 'Efficiency of the double auction in matching orders.' },

  // Structure (35)
  { id: 'tpo', label: 'TPO Profiles', category: 'Structure', x: 380, y: 140, description: 'Time Price Opportunity mapping market activity across 30-minute brackets.' },
  { id: 'vp', label: 'Volume Profile', category: 'Structure', x: 500, y: 100, description: 'Displays trading volume committed at specific price levels over time.' },
  { id: 'poc', label: 'Point of Control', category: 'Structure', x: 440, y: 70, description: 'Highest volume price tick of the measured profile.' },
  { id: 'vah', label: 'Value Area High', category: 'Structure', x: 560, y: 60, description: 'Upper perimeter enclosing 70% of session volume.' },
  { id: 'val', label: 'Value Area Low', category: 'Structure', x: 470, y: 150, description: 'Lower perimeter enclosing 70% of session volume.' },
  { id: 'hvn', label: 'High Volume Node', category: 'Structure', x: 610, y: 90, description: 'Accepted value cluster acting as rotational balance.' },
  { id: 'lvn', label: 'Low Volume Node', category: 'Structure', x: 540, y: 170, description: 'Rejected sliver acting as fast transition zone.' },
  { id: 'vwap', label: 'VWAP & StDev', category: 'Structure', x: 680, y: 120, description: 'Volume-Weighted Average Price with standard deviation bands.' },
  { id: 'single-prints', label: 'Single Prints', category: 'Structure', x: 350, y: 200, description: 'Rapid impulse leaving single letters in TPO profile.' },
  { id: 'ib', label: 'Initial Balance', category: 'Structure', x: 410, y: 190, description: 'Range set in first hour (A & B periods).' },
  { id: 'poor-high', label: 'Poor High/Low', category: 'Structure', x: 300, y: 230, description: 'Unfinished auction lacking excess tail.' },

  // Orderflow (45)
  { id: 'dom', label: 'Depth of Market', category: 'Orderflow', x: 420, y: 270, description: 'Real-time order book showing resting limit queues.' },
  { id: 'delta', label: 'Cumulative Delta', category: 'Orderflow', x: 740, y: 220, description: 'Net market buy vs sell aggression over time.' },
  { id: 'absorption', label: 'Absorption', category: 'Orderflow', x: 520, y: 310, description: 'Passive limit orders soaking up aggressive market orders.' },
  { id: 'iceberg', label: 'Iceberg Orders', category: 'Orderflow', x: 600, y: 300, description: 'Concealed institutional limit size auto-reloading.' },
  { id: 'pulling-stacking', label: 'Pulling & Stacking', category: 'Orderflow', x: 460, y: 350, description: 'Adding or cancelling limit liquidity before price arrives.' },
  { id: 'time-sales', label: 'Time & Sales Tape', category: 'Orderflow', x: 640, y: 250, description: 'Chronological stream of executed market transactions.' },
  { id: 'divergence', label: 'Delta Divergence', category: 'Orderflow', x: 800, y: 250, description: 'Price making new high while delta declines.' },
  { id: 'sweeps', label: 'Liquidity Sweeps', category: 'Orderflow', x: 370, y: 320, description: 'Stop-run through key levels fueling counter-liquidity.' },

  // Psychology (20)
  { id: 'psychology', label: 'Trading Psychology', category: 'Psychology', x: 200, y: 290, description: 'Conscious planning vs subconscious survival reflexes.' },
  { id: 'system-1', label: 'System 1 Impulse', category: 'Psychology', x: 130, y: 330, description: 'Fast emotional reaction driving revenge and fear.' },
  { id: 'system-2', label: 'System 2 Logic', category: 'Psychology', x: 240, y: 350, description: 'Deliberate rational framework executing predefined plans.' },
  { id: 'fomo', label: 'FOMO & Chasing', category: 'Psychology', x: 90, y: 390, description: 'Fear of missing out causing poor perimeter execution.' },
  { id: 'tilt', label: 'Tilt Mitigation', category: 'Psychology', x: 190, y: 410, description: 'Terminal lockout protocol upon emotional fatigue.' },

  // Tools & Execution (15)
  { id: 'risk', label: 'Position Sizing', category: 'Tools', x: 860, y: 150, description: 'Fixed fraction risk per trade ensuring survival.' },
  { id: 'rr', label: 'Risk to Reward', category: 'Tools', x: 820, y: 100, description: 'Minimum 1:2 R:R ratio for positive expectancy.' },
  { id: 'journal', label: 'Trade Journal', category: 'Tools', x: 890, y: 210, description: 'Documenting setups, discipline rating, and P&L.' },
  { id: 'checklist', label: 'Pre-Trade Routine', category: 'Tools', x: 780, y: 160, description: 'Systematic 7-step pre-flight validation.' },
  { id: 'eod-drawdown', label: 'End of Day Drawdown', category: 'Tools', x: 860, y: 280, description: 'Onyx Futures model protecting intraday breathing room.' }
];

export const KNOWLEDGE_EDGES: GraphEdge[] = [
  { from: 'amt', to: 'fair-value' },
  { from: 'fair-value', to: 'balance' },
  { from: 'fair-value', to: 'imbalance' },
  { from: 'balance', to: 'excess' },
  { from: 'imbalance', to: 'discovery' },
  { from: 'amt', to: 'vp' },
  { from: 'amt', to: 'tpo' },
  { from: 'vp', to: 'poc' },
  { from: 'vp', to: 'vah' },
  { from: 'vp', to: 'val' },
  { from: 'vp', to: 'hvn' },
  { from: 'vp', to: 'lvn' },
  { from: 'vp', to: 'vwap' },
  { from: 'tpo', to: 'ib' },
  { from: 'tpo', to: 'single-prints' },
  { from: 'tpo', to: 'poor-high' },
  { from: 'vp', to: 'dom' },
  { from: 'dom', to: 'delta' },
  { from: 'dom', to: 'absorption' },
  { from: 'absorption', to: 'iceberg' },
  { from: 'dom', to: 'pulling-stacking' },
  { from: 'dom', to: 'time-sales' },
  { from: 'delta', to: 'divergence' },
  { from: 'dom', to: 'sweeps' },
  { from: 'psychology', to: 'system-1' },
  { from: 'psychology', to: 'system-2' },
  { from: 'system-1', to: 'fomo' },
  { from: 'system-1', to: 'tilt' },
  { from: 'risk', to: 'rr' },
  { from: 'risk', to: 'journal' },
  { from: 'risk', to: 'checklist' },
  { from: 'risk', to: 'eod-drawdown' }
];

/* =========================================================================
   GLOBAL UNIFIED SEARCH INDEX
   ========================================================================= */
export const GLOBAL_SEARCH_ITEMS: SearchResultItem[] = [
  // Pages & Core Sections
  { title: 'The Curriculum Hub', description: 'Structured orderflow roadmap from foundation to execution.', url: '/education', type: 'page', category: 'Education' },
  { title: 'Auction Market Theory (AMT)', description: 'Continuous double auction mechanics, fair value, and balance cycles.', url: '/education/amt', type: 'lesson', category: 'Foundation' },
  { title: 'Volume Profile Masterclass', description: 'Horizontal liquidity distribution, POC, VAH, VAL, HVN, and LVN.', url: '/education/volume-profile', type: 'lesson', category: 'Structure' },
  { title: 'Time Price Opportunity (TPO)', description: '30-minute letter brackets, Initial Balance, single prints, and excess.', url: '/education/tpo', type: 'lesson', category: 'Structure' },
  { title: 'VWAP & Standard Deviation', description: 'Institutional mean benchmark and dynamic volatility bands.', url: '/education/vwap', type: 'lesson', category: 'Structure' },
  { title: 'Depth of Market (DOM)', description: 'Real-time limit book reading, iceberg absorption, and pulling/stacking.', url: '/education/dom', type: 'lesson', category: 'Orderflow' },
  { title: 'Trading Psychology & Discipline', description: 'Conquering subconscious tilt, FOMO, and revenge trading.', url: '/education/psychology', type: 'lesson', category: 'Psychology' },

  // Tools
  { title: 'Futures Risk & Position Calculator', description: 'Exact contract sizing for NQ, ES, YM, GC, and CL based on tick value.', url: '/toolkit/risk-calculator', type: 'tool', category: 'Toolkit' },
  { title: 'Pre-Trade Checklist', description: 'Enforce pre-session routine and 7-step trade validation.', url: '/toolkit/checklist', type: 'tool', category: 'Toolkit' },
  { title: 'Trade Journal', description: 'Persistent execution logging with win rate and discipline scoring.', url: '/toolkit/journal', type: 'tool', category: 'Toolkit' },
  { title: 'Monte Carlo Simulator', description: 'Simulate 1,000 runs of 100 trades to calculate max drawdown probability.', url: '/toolkit/monte-carlo', type: 'tool', category: 'Toolkit' },

  // Lexicon & Discovery
  { title: 'Institutional Trading Glossary', description: '50+ definitions of orderflow, AMT, and market profile terms.', url: '/glossary', type: 'page', category: 'Reference' },
  { title: 'The Brain (Knowledge Graph)', description: 'Interactive force-directed graph mapping 140+ connected concepts.', url: '/brain', type: 'page', category: 'Brain' },
  { title: 'Onyx Futures Prop Partner (Code CLAUDIO)', description: 'End-of-day drawdown prop evaluations with community discount.', url: '/propfirm', type: 'page', category: 'Prop Firm' },
  { title: 'Trader Dashboard', description: 'Persistent member command center and personal journal history.', url: '/dashboard', type: 'page', category: 'Member' },

  // Dynamic Glossary terms injected into search
  ...GLOSSARY_ITEMS.map((g) => ({
    title: g.term,
    description: g.shortDesc,
    url: `/glossary#${g.term.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    type: 'glossary' as const,
    category: g.category
  }))
];

export const SEARCH_INDEX = GLOBAL_SEARCH_ITEMS;
