import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { db, UserRecord, TradeRecord, ChecklistRecord } from './server/db';

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

const MODELS_TO_TRY = ['gemini-3.8-flash', 'gemini-flash-latest'];

function getLocalFallback(message: string): { text: string; suggestedRoute?: { label: string; route: string } } {
  const lower = message.toLowerCase();

  if (lower.includes('absorption') || lower.includes('dom') || lower.includes('delta') || lower.includes('cvd') || lower.includes('iceberg') || lower.includes('ladder')) {
    return {
      text: `### Absorption & DOM Mechanics\n\n**Absorption** occurs when aggressive market orders (buyers lifting offers or sellers hitting bids) are completely matched and consumed by resting passive limit orders or reloading icebergs.\n\n* **DOM Signature**: Heavy volume traded at a specific price without price progressing.\n* **CVD Divergence**: CVD prints new extreme highs/lows while the price bar fails to make a higher high/lower low.\n* **Trading Execution**: Wait for aggressive exhaustion. Once the aggressive side stops pushing, responsive participants drive price rapidly in the reverse direction.`,
      suggestedRoute: { label: 'Explore DOM & Orderflow', route: 'education/dom' }
    };
  }

  if (lower.includes('auction market') || lower.includes('amt') || lower.includes('value area') || lower.includes('poc') || lower.includes('balance')) {
    return {
      text: `### Auction Market Theory (AMT) Core Concepts\n\nMarkets exist to facilitate trade via a continuous two-sided auction process:\n\n* **Balance (Acceptance)**: Buyers and sellers agree on price. The market builds a bell-shaped volume profile around the Point of Control (POC).\n* **Imbalance (Discovery)**: One side aggressively moves price seeking new responsive liquidity.\n* **Value Area (70% rule)**: 68-70% of total volume traded during the session (between VAL and VAH). If price opens outside value and rejects, expect rotation through the entire value area.`,
      suggestedRoute: { label: 'Study Auction Market Theory', route: 'education/amt' }
    };
  }

  if (lower.includes('volume profile') || lower.includes('hvn') || lower.includes('lvn')) {
    return {
      text: `### Volume Profile Structural Nodes\n\nUnlike traditional volume indicators that plot volume over time, Volume Profile plots volume **at price**:\n\n* **HVN (High Volume Node)**: Price zones of high consensus and two-sided trading. Acts as market gravity / support-resistance.\n* **LVN (Low Volume Node)**: Rejection zones. Price traverses quickly through LVNs due to low liquidity.\n* **Developing POC**: The dynamic highest volume price level that tracks institutional positioning.`,
      suggestedRoute: { label: 'Learn Volume Profile', route: 'education/volume-profile' }
    };
  }

  if (lower.includes('risk') || lower.includes('position') || lower.includes('contract') || lower.includes('stop loss') || lower.includes('sizing')) {
    return {
      text: `### Institutional Risk Rules\n\n1. **Risk Cap**: Never risk more than 1.0% to 2.0% of total account balance on a single trade.\n2. **Invalidation First**: Determine where your orderflow thesis is invalidated *before* calculating entry.\n3. **Formula**: \`Contracts = (Account Equity × Risk %) ÷ (Stop Distance in Ticks × Tick Value)\`.\n\nUse our interactive Risk Calculator to verify sizing before every execution.`,
      suggestedRoute: { label: 'Open Risk Calculator', route: 'toolkit/risk-calculator' }
    };
  }

  if (lower.includes('psychology') || lower.includes('fomo') || lower.includes('revenge') || lower.includes('discipline') || lower.includes('emotion')) {
    return {
      text: `### Trading Psychology & Process Discipline\n\n* **Probabilistic Mindset**: Any single trade outcome is random; your edge operates over a sample of 100+ trades.\n* **Rule of Invalidation**: An executed stop-out is not a failure; it is information that your hypothesis was incorrect.\n* **Combating FOMO**: If price leaves your Value Area without you, do not chase in low-volume areas. Wait for the retest of the value extreme.`,
      suggestedRoute: { label: 'Read Trading Psychology', route: 'education/psychology' }
    };
  }

  if (lower.includes('journal') || lower.includes('log trade')) {
    return {
      text: `### Journaling Your Edge\n\nTop performers treat trading as a professional enterprise. Record:\n\n* Setup archetype (e.g. VAH rejection, absorption at naked POC)\n* Planned R:R vs. realized R:R\n* Emotional state before and during execution\n\nReview your metrics in the FLW Trade Journal weekly.`,
      suggestedRoute: { label: 'Open Trade Journal', route: 'toolkit/journal' }
    };
  }

  if (lower.includes('monte carlo') || lower.includes('drawdown') || lower.includes('simulation')) {
    return {
      text: `### Monte Carlo Risk Simulation\n\nEven with a 60% win rate and 1.5 R:R, probability dictates that a trader will experience 5 to 8 consecutive losses over a series of 200 trades.\n\nSimulating 1,000 randomized iterations verifies that your maximum drawdown remains well within prop-firm thresholds.`,
      suggestedRoute: { label: 'Open Monte Carlo Simulator', route: 'toolkit/monte-carlo' }
    };
  }

  return {
    text: `### FLW Institutional Orderflow\n\nOrderflow trading is the study of real-time supply and demand dynamics, focusing on:\n\n* **Continuous Double Auctions**: How buyers and sellers discover value\n* **Depth of Market (DOM)**: Passive limit liquidity absorbing aggressive market orders\n* **Profile Distribution**: Value Area High (VAH), Value Area Low (VAL), and POC\n\nExplore our interactive curriculum to master each pillar step-by-step.`,
    suggestedRoute: { label: 'Start AMT Curriculum', route: 'education/amt' }
  };
}

const SYSTEM_INSTRUCTION = `You are the FLW AI Assistant — an institutional orderflow & Auction Market Theory (AMT) mentor for the FLW trading platform founded by Claudio.

Your expertise covers:
1. Auction Market Theory (AMT): Continuous double auctions, balance (acceptance) vs. imbalance (price discovery), Value Area (VAH, VAL, POC), Initial Balance (IB), Excess, Single Prints, responsive vs. initiating activity.
2. Depth of Market (DOM) & Order Flow: Passive limit liquidity vs. aggressive market orders, absorption at key levels, pulling & stacking, iceberg orders, Cumulative Volume Delta (CVD) and CVD divergence.
3. Market Profile & Volume Profile: Developing profiles, composite profiles, HVNs (high volume nodes), LVNs (low volume nodes), naked POCs.
4. Execution, Risk Management & Trading Psychology: Hard invalidations defined before entry, 1-2% maximum risk, process over P&L, emotional detachment, avoiding revenge trading, trade journaling.
5. FLW Tools & Curriculum: Guide students to our educational modules (AMT, DOM, Volume Profile, Psychology) and tools (Risk Calculator, Trade Journal, Monte Carlo Simulator, Session Timer, Pre-Trade Checklist).

Instructions:
- Keep answers clear, rigorous, institutional, and direct. Avoid generic stock market generalities.
- Emphasize probability and risk discipline at all times.
- Format with clean Markdown paragraphs and concise bullet points.
- When relevant, you can recommend specific FLW sections:
  - "education/amt" for Auction Market Theory
  - "education/dom" for DOM and absorption
  - "education/volume-profile" for Volume Profile
  - "education/psychology" for Trading Psychology
  - "toolkit/risk-calculator" for Position Sizing
  - "toolkit/journal" for Trade Journal
  - "toolkit/monte-carlo" for Risk Simulation`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  const JWT_SECRET = process.env.JWT_SECRET || 'flw-institutional-secret-key-2026';

  // Helper to resolve session from cookie or Authorization header
  function getAuthUser(req: express.Request): { userId: string; email: string; name: string } | null {
    let token = req.cookies?.flw_session;
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace(/^Bearer\s+/i, '');
    }
    if (!token) return null;
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };
    } catch {
      return null;
    }
  }

  function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const sessionUser = getAuthUser(req);
    if (!sessionUser) {
      res.status(401).json({ error: 'Unauthorized', message: 'Authentication required. Please sign in.' });
      return;
    }
    (req as any).user = sessionUser;
    next();
  }

  function toUserProfile(user: UserRecord) {
    return {
      name: user.name,
      email: user.email,
      accountEquity: user.accountEquity,
      riskPercent: user.riskPercent,
      preferredInstrument: user.preferredInstrument,
      propFirmCode: user.propFirmCode,
      isLoggedIn: true,
      memberSince: user.memberSince
    };
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Gemini AI Chat API
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback response if key is not configured
        const fallback = getLocalFallback(message);
        res.json({
          text: fallback.text,
          suggestedRoute: fallback.suggestedRoute,
          fallback: true
        });
        return;
      }

      // Format previous conversation context if provided
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item && item.text) {
            contents.push({
              role: item.sender === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }]
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      let replyText: string | null = null;

      // Try modern primary model first, fallback to alternate if high demand (503)
      for (const model of MODELS_TO_TRY) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
              maxOutputTokens: 800
            }
          });

          if (response && response.text) {
            replyText = response.text;
            break;
          }
        } catch (modelErr: any) {
          console.warn(`[Gemini Chat] Model "${model}" temporarily unavailable (${modelErr?.status || modelErr?.code || 'error'}): ${modelErr?.message || modelErr}. Trying fallback...`);
        }
      }

      // If all upstream Gemini models were experiencing high demand (503) or rate limits, use institutional fallback
      if (!replyText) {
        console.warn('[Gemini Chat] All upstream models busy. Serving offline institutional knowledge answer.');
        const fallback = getLocalFallback(message);
        res.json({
          text: fallback.text,
          suggestedRoute: fallback.suggestedRoute,
          fallback: true
        });
        return;
      }

      // Determine if a curriculum route can be suggested
      let suggestedRoute: { label: string; route: string } | undefined;
      const lowerReply = (replyText + ' ' + message).toLowerCase();

      if (lowerReply.includes('auction market') || lowerReply.includes('amt') || lowerReply.includes('value area')) {
        suggestedRoute = { label: 'Study Auction Market Theory', route: 'education/amt' };
      } else if (lowerReply.includes('dom') || lowerReply.includes('absorption') || lowerReply.includes('cvd') || lowerReply.includes('delta')) {
        suggestedRoute = { label: 'Explore DOM & Orderflow', route: 'education/dom' };
      } else if (lowerReply.includes('volume profile') || lowerReply.includes('poc') || lowerReply.includes('hvn')) {
        suggestedRoute = { label: 'Learn Volume Profile', route: 'education/volume-profile' };
      } else if (lowerReply.includes('psychology') || lowerReply.includes('fomo') || lowerReply.includes('discipline')) {
        suggestedRoute = { label: 'Read Trading Psychology', route: 'education/psychology' };
      } else if (lowerReply.includes('risk') || lowerReply.includes('position size') || lowerReply.includes('contract')) {
        suggestedRoute = { label: 'Open Risk Calculator', route: 'toolkit/risk-calculator' };
      } else if (lowerReply.includes('journal') || lowerReply.includes('log trade')) {
        suggestedRoute = { label: 'Open Trade Journal', route: 'toolkit/journal' };
      } else if (lowerReply.includes('monte carlo') || lowerReply.includes('drawdown')) {
        suggestedRoute = { label: 'Open Monte Carlo Simulator', route: 'toolkit/monte-carlo' };
      }

      res.json({
        text: replyText,
        suggestedRoute
      });
    } catch (error: any) {
      console.warn('Handling /api/chat with graceful fallback:', error?.message || error);
      const fallback = getLocalFallback(req.body?.message || '');
      res.json({
        text: fallback.text,
        suggestedRoute: fallback.suggestedRoute,
        fallback: true
      });
    }
  });

  // ==========================================
  // AUTHENTICATION ENDPOINTS
  // ==========================================

  // Check current session
  app.get('/api/auth/me', async (req, res) => {
    const session = getAuthUser(req);
    if (!session) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const user = await db.getUserById(session.userId);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    res.json({ user: toUserProfile(user) });
  });

  // Direct login / sign up with Discord username or email
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { handle, email } = req.body;
      const rawHandle = (handle && typeof handle === 'string' ? handle.trim() : '') || 'claudio_017';
      const cleanName = rawHandle.replace(/^@/, '');
      const userEmail = (email && typeof email === 'string' ? email.trim().toLowerCase() : '') || `${cleanName.toLowerCase()}@discord.gg`;
      const userId = 'usr_' + cleanName.toLowerCase().replace(/[^a-z0-9_]/g, '');

      let user = await db.getUserByEmail(userEmail);
      if (!user) {
        user = await db.getUserById(userId);
      }

      if (!user) {
        user = {
          id: userId,
          name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
          email: userEmail,
          accountEquity: 50000,
          riskPercent: 1.0,
          preferredInstrument: 'NQ',
          propFirmCode: 'CLAUDIO',
          memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
        await db.upsertUser(user);
      }

      // Generate JWT session token
      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      // Set cookie for session persistence in iframes and cross-site
      res.cookie('flw_session', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        user: toUserProfile(user),
        token
      });
    } catch (e: any) {
      console.error('Error in /api/auth/login:', e);
      res.status(500).json({ error: 'Failed to process login', message: e?.message || 'Server error' });
    }
  });

  // Sign out / clear session
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('flw_session', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    res.json({ success: true });
  });

  // Discord OAuth URL Generator
  app.get('/api/auth/discord/url', (req, res) => {
    const clientId = process.env.DISCORD_CLIENT_ID?.trim();
    if (!clientId) {
      res.json({
        configured: false,
        message: 'DISCORD_CLIENT_ID is not configured in .env'
      });
      return;
    }

    const hostUrl = process.env.APP_URL ? process.env.APP_URL.replace(/\/$/, '') : `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${hostUrl}/auth/callback`;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify email guilds.join'
    });

    res.json({
      configured: true,
      url: `https://discord.com/api/oauth2/authorize?${params.toString()}`
    });
  });

  // Discord OAuth Callback
  app.get(['/auth/callback', '/auth/callback/', '/api/auth/discord/callback', '/api/auth/discord/callback/'], async (req, res) => {
    const code = req.query.code as string;
    const clientId = process.env.DISCORD_CLIENT_ID?.trim();
    const clientSecret = process.env.DISCORD_CLIENT_SECRET?.trim();

    const hostUrl = process.env.APP_URL ? process.env.APP_URL.replace(/\/$/, '') : `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${hostUrl}/auth/callback`;

    if (code && clientId && clientSecret) {
      try {
        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri
          })
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
          });

          if (userRes.ok) {
            const discordUser = await userRes.json();
            const discordId = discordUser.id;
            const displayName = discordUser.global_name || discordUser.username || 'Trader';
            const discordEmail = discordUser.email || `${discordUser.username}@discord.gg`;
            const userId = 'discord_' + discordId;

            let user = await db.getUserById(userId);
            if (!user) {
              user = {
                id: userId,
                name: displayName,
                email: discordEmail,
                accountEquity: 50000,
                riskPercent: 1.0,
                preferredInstrument: 'NQ',
                propFirmCode: 'CLAUDIO',
                memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                discordId,
                avatar: discordUser.avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${discordUser.avatar}.png` : undefined
              };
            }
            await db.upsertUser(user);
            // Add user to your Discord server
const guildId = process.env.DISCORD_GUILD_ID?.trim();
const botToken = process.env.DISCORD_BOT_TOKEN?.trim();
if (guildId && botToken) {
  try {
    await fetch(`https://discord.com/api/guilds/${guildId}/members/${discordId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ access_token: tokenData.access_token })
    });
  } catch (joinErr) {
    console.warn('[Discord] Failed to auto-join guild:', joinErr);
  }
}

            const sessionToken = jwt.sign(
              { userId: user.id, email: user.email, name: user.name },
              JWT_SECRET,
              { expiresIn: '30d' }
            );

            res.cookie('flw_session', sessionToken, {
              httpOnly: true,
              secure: true,
              sameSite: 'none',
              maxAge: 30 * 24 * 60 * 60 * 1000
            });

            // Return popup postMessage as instructed by oauth-integration skill
            res.send(`
              <!DOCTYPE html>
              <html>
                <head><title>Authentication Successful</title></head>
                <body style="background:#0b0c0e;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
                  <script>
                    if (window.opener) {
                      window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', token: ${JSON.stringify(sessionToken)} }, '*');
                      window.close();
                    } else {
                      window.location.href = '/dashboard';
                    }
                  </script>
                  <p style="font-size:14px;letter-spacing:0.05em;">Authentication successful. Closing window...</p>
                </body>
              </html>
            `);
            return;
          }
        }
      } catch (err) {
        console.error('Discord OAuth exchange error:', err);
      }
    }

    // Fallback or error response for popup
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Authentication</title></head>
        <body style="background:#0b0c0e;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR' }, '*');
              window.close();
            } else {
              window.location.href = '/login';
            }
          </script>
          <p>Authentication window completed. You may close this tab.</p>
        </body>
      </html>
    `);
  });

  // ==========================================
  // TRADES ENDPOINTS (Protected)
  // ==========================================
  app.get('/api/trades', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const trades = await db.getTrades(user.userId);
      res.json({ success: true, trades });
    } catch (e: any) {
      res.status(500).json({ error: 'Failed to fetch trades', message: e?.message });
    }
  });

  app.post('/api/trades', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      if (Array.isArray(req.body.trades)) {
        const saved = await db.saveTrades(user.userId, req.body.trades);
        res.json({ success: true, trades: saved });
      } else {
        const trade = req.body.trade || req.body;
        const saved = await db.addTrade(user.userId, trade);
        res.json({ success: true, trades: saved });
      }
    } catch (e: any) {
      res.status(500).json({ error: 'Failed to save trade', message: e?.message });
    }
  });

  app.delete('/api/trades/:id', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      await db.deleteTrade(user.userId, req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: 'Failed to delete trade', message: e?.message });
    }
  });

  // ==========================================
  // CHECKLIST ENDPOINTS (Protected)
  // ==========================================
  app.get('/api/checklist', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const checklist = await db.getChecklist(user.userId);
      res.json({ success: true, checklist });
    } catch (e: any) {
      res.status(500).json({ error: 'Failed to fetch checklist', message: e?.message });
    }
  });

  app.put('/api/checklist', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const items = Array.isArray(req.body.items) ? req.body.items : req.body;
      const saved = await db.saveChecklist(user.userId, items);
      res.json({ success: true, checklist: saved });
    } catch (e: any) {
      res.status(500).json({ error: 'Failed to update checklist', message: e?.message });
    }
  });

  // ==========================================
  // PROFILE ENDPOINTS (Protected)
  // ==========================================
  app.get('/api/profile', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const profile = await db.getUserById(user.userId);
      if (!profile) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ success: true, user: toUserProfile(profile) });
    } catch (e: any) {
      res.status(500).json({ error: 'Failed to fetch profile', message: e?.message });
    }
  });

  app.put('/api/profile', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const existing = await db.getUserById(user.userId);
      if (!existing) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const updated: UserRecord = {
        ...existing,
        name: req.body.name || existing.name,
        accountEquity: req.body.accountEquity !== undefined ? Number(req.body.accountEquity) : existing.accountEquity,
        riskPercent: req.body.riskPercent !== undefined ? Number(req.body.riskPercent) : existing.riskPercent,
        preferredInstrument: req.body.preferredInstrument || existing.preferredInstrument,
        propFirmCode: req.body.propFirmCode || existing.propFirmCode
      };

      await db.upsertUser(updated);
      res.json({ success: true, user: toUserProfile(updated) });
    } catch (e: any) {
      res.status(500).json({ error: 'Failed to update profile', message: e?.message });
    }
  });

  // Vite middleware in development vs static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FLW Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
