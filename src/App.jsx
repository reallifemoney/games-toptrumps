import React, { useState, useEffect, useRef } from "react";
import { ref, set, get, onValue, off } from "firebase/database";
import { db } from "./firebase";
import { 
  TrendingUp, TrendingDown, Layers, Leaf, Coins, Globe2, Crown, 
  Users, Copy, Check, RefreshCw, Trophy, Sparkles, HelpCircle, 
  Grid, LogOut, X, Search 
} from "lucide-react";

import logoImg from "./logo.png";

// Import Manager Logos (update paths as needed)
import fidelityLogo from "./fidelity.svg";
import vanguardLogo from "./vanguard.svg";
import lgLogo from "./lg.svg";
import isharesLogo from "./ishares.svg";
import wisdomtreeLogo from "./wisdomtree.svg";
import mgLogo from "./mg.svg";
import artemisLogo from "./artemis.svg";
import arkLogo from "./ark.svg";
import xtrackersLogo from "./ark.svg";
import aegonLogo from "./ark.svg";
import hsbcLogo from "./ark.svg";
import baillieLogo from "./ark.svg";
import invescoLogo from "./ark.svg";
import schrodersLogo from "./ark.svg";
import jpmorganLogo from "./ark.svg";

// ---------- Fund card data ----------
const CARDS = [
  // --- Global Equity & Bond Funds (New 8) ---
  { 
    id: "fid-world", 
    name: "Fidelity Index World Fund P Acc", 
    manager: "Fidelity", 
    logo: fidelityLogo,
    desc: "Invests in thousands of big companies across developed countries worldwide", 
    risk: 5,
    stats: { growth2025: 18.50, holdings: 1400, esg: 3.5, cost: 0.12, countries: 23, growth2022: -7.80 } 
  },
  { 
    id: "van-allcap", 
    name: "Vanguard FTSE Global All Cap Index Fund Acc", 
    manager: "Vanguard", 
    logo: vanguardLogo,
    desc: "Owns a tiny slice of almost every public company in the world", 
    risk: 5,
    stats: { growth2025: 17.20, holdings: 7150, esg: 3.5, cost: 0.23, countries: 49, growth2022: -8.10 } 
  },
  { 
    id: "lg-global-eq", 
    name: "L&G Global Equity Index Fund", 
    manager: "L&G", 
    logo: lgLogo,
    desc: "Spreads your money across hundreds of major international businesses", 
    risk: 5,
    stats: { growth2025: 18.10, holdings: 2200, esg: 3.5, cost: 0.13, countries: 23, growth2022: -7.90 } 
  },
  { 
    id: "van-gb-bond", 
    name: "Vanguard Global Bond Index Fund", 
    manager: "Vanguard", 
    logo: vanguardLogo,
    desc: "Lends money to governments and big companies globally for steady returns", 
    risk: 3,
    stats: { growth2025: 5.30, holdings: 11200, esg: 3.5, cost: 0.15, countries: 55, growth2022: -12.50 } 
  },
  { 
    id: "ish-agbp", 
    name: "iShares Core Global Aggregate Bond UCITS ETF", 
    manager: "iShares", 
    logo: isharesLogo,
    desc: "A giant collection of global loans designed to keep your money safer", 
    risk: 3,
    stats: { growth2025: 5.20, holdings: 11500, esg: 3.5, cost: 0.10, countries: 65, growth2022: -13.10 } 
  },
  { 
    id: "van-smcap", 
    name: "Vanguard Global Small-Cap Index Fund Acc", 
    manager: "Vanguard", 
    logo: vanguardLogo,
    desc: "Focuses on smaller, up-and-coming companies worldwide for higher growth potential", 
    risk: 6,
    stats: { growth2025: 14.30, holdings: 4400, esg: 3.5, cost: 0.29, countries: 23, growth2022: -10.20 } 
  },
  { 
    id: "lg-ispy", 
    name: "L&G Cyber Security UCITS ETF", 
    manager: "L&G", 
    logo: lgLogo,
    desc: "Invests in companies that protect computers and data from hackers", 
    risk: 6,
    stats: { growth2025: 21.60, holdings: 42, esg: 3, cost: 0.69, countries: 8, growth2022: -25.40 } 
  },
  { 
    id: "wt-btc", 
    name: "WisdomTree Physical Bitcoin", 
    manager: "WisdomTree", 
    logo: wisdomtreeLogo,
    desc: "Tracks the price of Bitcoin directly for high-risk, high-reward growth", 
    risk: 7,
    stats: { growth2025: 45.20, holdings: 1, esg: 1, cost: 0.35, countries: 1, growth2022: -64.20 } 
  },

  // --- Regional & Sector Funds (Original 16 Set) ---
  { 
    id: "mg-japan", 
    name: "M&G Japan Fund", 
    manager: "M&G", 
    logo: mgLogo,
    desc: "Invests in innovative Japanese companies, from robotics to electronics", 
    risk: 5,
    stats: { growth2025: 12.40, holdings: 65, esg: 3.5, cost: 0.68, countries: 1, growth2022: -3.50 } 
  },
  { 
    id: "art-euro", 
    name: "Artemis European Growth Fund", 
    manager: "Artemis", 
    logo: artemisLogo,
    desc: "Targets fast-growing top companies across continental Europe", 
    risk: 5,
    stats: { growth2025: 15.80, holdings: 52, esg: 4.0, cost: 0.85, countries: 12, growth2022: -9.20 } 
  },
  { 
    id: "ark-ai", 
    name: "ARK Artificial Intelligence & Tech ETF", 
    manager: "ARK", 
    logo: arkLogo,
    desc: "High-conviction bets on future tech innovators, AI, and automation", 
    risk: 7,
    stats: { growth2025: 32.10, holdings: 35, esg: 2.5, cost: 0.75, countries: 4, growth2022: -45.60 } 
  },
  { 
    id: "xtr-gold", 
    name: "Xtrackers Physical Gold ETC", 
    manager: "Xtrackers", 
    logo: xtrackersLogo,
    desc: "Backed directly by physical gold bullion stored safely in vault vaults", 
    risk: 4,
    stats: { growth2025: 11.20, holdings: 1, esg: 3.0, cost: 0.15, countries: 1, growth2022: 6.80 } 
  },
  { 
    id: "aeg-hy-bond", 
    name: "Aegon High Yield Bond Fund", 
    manager: "Aegon", 
    logo: aegonLogo,
    desc: "Lends to higher-risk companies in exchange for larger monthly income payouts", 
    risk: 4,
    stats: { growth2025: 7.90, holdings: 180, esg: 3.0, cost: 0.58, countries: 15, growth2022: -10.40 } 
  },
  { 
    id: "hsbc-ftse200", 
    name: "HSBC FTSE 250 Index Fund", 
    manager: "HSBC", 
    logo: hsbcLogo,
    desc: "Focuses on medium-sized UK businesses driving local economic growth", 
    risk: 5,
    stats: { growth2025: 9.40, holdings: 250, esg: 3.5, cost: 0.18, countries: 1, growth2022: -19.70 } 
  },
  { 
    id: "bg-smcap", 
    name: "Baillie Gifford Smaller Companies", 
    manager: "Baillie Gifford", 
    logo: baillieLogo,
    desc: "Backs ambitious small UK companies looking to become the titans of tomorrow", 
    risk: 6,
    stats: { growth2025: 16.50, holdings: 75, esg: 4.0, cost: 0.73, countries: 1, growth2022: -28.10 } 
  },
  { 
    id: "inv-clean", 
    name: "Invesco Global Clean Energy ETF", 
    manager: "Invesco", 
    logo: invescoLogo,
    desc: "Invests in solar, wind, and renewable energy companies driving decarbonisation", 
    risk: 6,
    stats: { growth2025: 22.40, holdings: 120, esg: 5.0, cost: 0.60, countries: 18, growth2022: -18.30 } 
  },
  { 
    id: "sch-us-eq", 
    name: "Schroder US Equity Fund", 
    manager: "Schroders", 
    logo: schrodersLogo,
    desc: "Targets leading American blue-chip businesses across tech, retail, and healthcare", 
    risk: 5,
    stats: { growth2025: 20.30, holdings: 60, esg: 3.5, cost: 0.52, countries: 1, growth2022: -14.20 } 
  },
  { 
    id: "jpm-emerging", 
    name: "JPMorgan Emerging Markets Fund", 
    manager: "JPMorgan", 
    logo: jpmorganLogo,
    desc: "Invests in fast-growing developing economies like India, Brazil, and Vietnam", 
    risk: 6,
    stats: { growth2025: 13.80, holdings: 85, esg: 3.0, cost: 0.78, countries: 22, growth2022: -16.90 } 
  },
  { 
    id: "van-s&p500", 
    name: "Vanguard S&P 500 UCITS ETF", 
    manager: "Vanguard", 
    logo: vanguardLogo,
    desc: "Tracks the 500 largest publicly traded companies in the United States", 
    risk: 5,
    stats: { growth2025: 21.10, holdings: 503, esg: 3.5, cost: 0.07, countries: 1, growth2022: -13.10 } 
  },
  { 
    id: "ish-nasdaq", 
    name: "iShares NASDAQ 100 UCITS ETF", 
    manager: "iShares", 
    logo: isharesLogo,
    desc: "Concentrated exposure to 100 major tech and innovation giants in the US", 
    risk: 6,
    stats: { growth2025: 26.80, holdings: 101, esg: 3.5, cost: 0.33, countries: 1, growth2022: -32.40 } 
  },
  { 
    id: "lg-health", 
    name: "L&G Healthcare Breakthrough ETF", 
    manager: "L&G", 
    logo: lgLogo,
    desc: "Invests in medical technology, pharmaceuticals, and modern biotech firms", 
    risk: 6,
    stats: { growth2025: 14.90, holdings: 95, esg: 4.5, cost: 0.49, countries: 14, growth2022: -12.10 } 
  },
  { 
    id: "fid-asia", 
    name: "Fidelity Asia Pacific Focus Fund", 
    manager: "Fidelity", 
    logo: fidelityLogo,
    desc: "Focuses on market-leading companies across Asian developed markets", 
    risk: 6,
    stats: { growth2025: 11.60, holdings: 50, esg: 3.5, cost: 0.90, countries: 9, growth2022: -11.40 } 
  },
  { 
    id: "hsbc-uk-all", 
    name: "HSBC UK All Share Index Fund", 
    manager: "HSBC", 
    logo: hsbcLogo,
    desc: "Spreads investments across companies of all sizes operating in the UK", 
    risk: 5,
    stats: { growth2025: 10.10, holdings: 580, esg: 3.5, cost: 0.06, countries: 1, growth2022: 0.80 } 
  },
  { 
    id: "ish-div", 
    name: "iShares UK Dividend UCITS ETF", 
    manager: "iShares", 
    logo: isharesLogo,
    desc: "Targets 50 high-dividend paying UK businesses to generate regular cash return", 
    risk: 4,
    stats: { growth2025: 8.70, holdings: 50, esg: 3.0, cost: 0.40, countries: 1, growth2022: 4.10 } 
  }
];
const CARD_MAP = Object.fromEntries(CARDS.map(c => [c.id, c]));

const CATEGORIES = [
  { key: "growth2025", label: "2025 Growth", icon: TrendingUp, higherWins: true, fmt: v => `${v.toFixed(2)}%` },
  { key: "holdings", label: "Holdings", icon: Layers, higherWins: true, fmt: v => `${v.toLocaleString()}` },
  { key: "esg", label: "ESG Rating", icon: Leaf, higherWins: true, fmt: v => `${v} / 5` },
  { key: "cost", label: "Cost", icon: Coins, higherWins: false, fmt: v => `${v.toFixed(2)}%`, note: "lower wins" },
  { key: "countries", label: "Countries", icon: Globe2, higherWins: true, fmt: v => `${v}` },
  { key: "growth2022", label: "2022 Growth", icon: TrendingDown, higherWins: true, fmt: v => (v === null || v === undefined ? "N/A" : `${v.toFixed(2)}%`) },
];

const MINT = "#eef8eb", GREEN = "#71c558", GREEN_DK = "#3F7E27", PURPLE = "#8c52ff", INK = "#1F2A1F", AMBER = "#C1791C";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 4; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}
function makeId() {
  return "p_" + Math.random().toString(36).slice(2, 10);
}

function StatValue({ v }) {
  if (v === null || v === undefined) return <span style={{ color: AMBER, fontWeight: 700 }}>N/A</span>;
  const isNeg = typeof v === "string" && v.trim().startsWith("-");
  return <span style={{ color: isNeg ? AMBER : GREEN_DK, fontWeight: 700 }}>{v}</span>;
}

function Stars({ n }) {
  const full = Math.floor(n);
  const half = n - full >= 0.5;
  return (
    <span style={{ color: GREEN_DK, letterSpacing: 1 }}>
      {"★".repeat(full)}
      {half ? "✦" : ""}
      {"☆".repeat(Math.max(0, 5 - full - (half ? 1 : 0)))}
    </span>
  );
}

function RiskScale({ risk }) {
  return (
    <div style={{ margin: "14px 0 16px" }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#6B7C6B", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
        Risk Rating
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3, 4, 5, 6, 7].map(n => (
          <div key={n} style={{
            width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700,
            background: n === risk ? PURPLE : "#EDEAF9",
            color: n === risk ? "#fff" : "#B7ADE8",
          }}>{n}</div>
        ))}
      </div>
    </div>
  );
}

function FundCard({ card, interactive, onPick, highlightKey, dim }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "22px 20px 14px", width: "100%", maxWidth: 350, boxSizing: "border-box",
      boxShadow: "0 6px 18px rgba(30,50,20,0.10)", opacity: dim ? 0.55 : 1, border: "2px solid #E3F0E1", margin: "0 auto",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <img 
          src={card.logo} 
          alt={`${card.manager} logo`} 
          style={{ width: 46, height: 46, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} 
        />
        <div style={{ fontWeight: 800, fontSize: 16, color: INK, lineHeight: 1.2 }}>{card.name}</div>
      </div>
      <div style={{ color: PURPLE, fontSize: 14, fontStyle: "italic", lineHeight: 1.35, margin: "10px 0 14px" }}>
        {card.desc}
      </div>
      <RiskScale risk={card.risk} />
      <div>
        {CATEGORIES.map(cat => {
          const raw = card.stats[cat.key];
          const isHighlight = highlightKey === cat.key;
          const Icon = cat.icon;
          const body = cat.key === "esg" ? <Stars n={raw} /> : <StatValue v={cat.fmt(raw)} />;
          const clickable = interactive && typeof onPick === "function";
          return (
            <div
              key={cat.key}
              onClick={clickable ? () => onPick(cat.key) : undefined}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 8px", borderBottom: "1px solid #EFF5EC", cursor: clickable ? "pointer" : "default",
                background: isHighlight ? MINT : "transparent", borderRadius: 8,
                transition: "background 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: INK, fontWeight: 600, fontSize: 13.5 }}>
                <Icon size={16} color={PURPLE} />
                {cat.label}
                {cat.note && <span style={{ fontSize: 10.5, color: "#9AA89A", fontWeight: 500 }}>({cat.note})</span>}
              </div>
              <div style={{ fontSize: 14 }}>{body}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CardBack() {
  return (
    <div style={{
      background: MINT, borderRadius: 20, border: "2px dashed #C7E2C4", width: "100%", maxWidth: 350, margin: "0 auto",
      minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
    }}>
      <img src={logoImg} alt="Top Funds Logo" style={{ maxHeight: 80, maxWidth: "85%", objectFit: "contain" }} />
    </div>
  );
}

// ---------- Modal Components ----------
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(15, 25, 15, 0.6)", display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 16,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, maxHeight: "85vh",
        display: "flex", flexDirection: "column", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid #EFF5EC", display: "flex",
          justifyContent: "space-between", alignItems: "center", background: MINT,
        }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: INK }}>{title}</div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}>
            <X size={20} color={INK} />
          </button>
        </div>
        <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function RulesModal({ onClose }) {
  return (
    <Modal title="How to Play" onClose={onClose}>
      <div style={{ color: INK, fontSize: 14, lineHeight: 1.6 }}>
        <p style={{ marginTop: 0 }}><b>Goal:</b> Win all the cards in the deck!</p>
        
        <div style={{ background: MINT, padding: 12, borderRadius: 12, marginBottom: 12 }}>
          <b>1. Pick a Stat:</b> On your turn, look at your top card and choose the stat you think is best (e.g., highest growth or lowest cost).
        </div>

        <div style={{ background: MINT, padding: 12, borderRadius: 12, marginBottom: 12 }}>
          <b>2. Compare Cards:</b> All players compare against that category of their top card:
          <ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>
            <li><b>Higher wins for:</b> Growth, Holdings, ESG Rating, Countries</li>
            <li><b>Lower wins for:</b> Cost</li>
          </ul>
        </div>

        <div style={{ background: MINT, padding: 12, borderRadius: 12, marginBottom: 12 }}>
          <b>3. Win or Tie:</b>
          <ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>
            <li>The winner takes all played cards and goes next.</li>
            <li>In the event of a <b>tie</b>, cards go into the pot. The next round's winner gets the pot too!</li>
          </ul>
        </div>

        <p style={{ marginBottom: 0, textAlign: "center", color: PURPLE, fontWeight: 700 }}>
          The player that gets all the cards wins the game!
        </p>
      </div>
    </Modal>
  );
}

function CardsBrowserModal({ onClose }) {
  const [filter, setFilter] = useState("");
  const filtered = CARDS.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.manager.toLowerCase().includes(filter.toLowerCase()) ||
    c.desc.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Modal title={`All Funds (${CARDS.length})`} onClose={onClose}>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search size={18} color="#9AA89A" style={{ position: "absolute", left: 12, top: 12 }} />
        <input 
          value={filter} 
          onChange={e => setFilter(e.target.value)} 
          placeholder="Search funds or managers..."
          style={{
            width: "100%", boxSizing: "border-box", padding: "10px 12px 10px 38px",
            borderRadius: 10, border: "1.5px solid #DCEEDA", fontSize: 14, fontFamily: "'Lexend', sans-serif",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map(card => (
          <FundCard key={card.id} card={card} interactive={false} />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#9AA89A", padding: 20 }}>No funds matching "{filter}"</div>
        )}
      </div>
    </Modal>
  );
}

// ---------- Main App Component ----------
export default function App() {
  const [screen, setScreen] = useState("home"); // home | lobby | game
  const [myId] = useState(makeId);
  const [nameInput, setNameInput] = useState("");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const listenerRef = useRef(null);

  // Load Lexend font dynamically
  useEffect(() => {
    const fontId = "lexend-font-link";
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // ---- Firebase helpers ----
  async function loadRoom(code) {
    const snap = await get(ref(db, `rooms/${code}`));
    return snap.exists() ? snap.val() : null;
  }
  async function saveRoom(newRoom) {
    newRoom.updatedAt = Date.now();
    await set(ref(db, `rooms/${newRoom.code}`), newRoom);
    setRoom(newRoom);
  }

  useEffect(() => {
    if (!roomCode) return;
    const roomRef = ref(db, `rooms/${roomCode}`);
    const handler = onValue(roomRef, snap => {
      if (snap.exists()) setRoom(snap.val());
    });
    listenerRef.current = roomRef;
    return () => off(roomRef, "value", handler);
  }, [roomCode]);

  async function hostGame() {
    setError("");
    if (!nameInput.trim()) return setError("Enter your name first");
    setBusy(true);
    const code = makeCode();
    const me = { id: myId, name: nameInput.trim() };
    const newRoom = {
      code, status: "lobby", players: [me], hostId: myId, hands: {}, pickerId: myId, pile: [],
      round: null, log: [{ text: `${me.name} created the room`, ts: Date.now() }],
    };
    await saveRoom(newRoom);
    setRoomCode(code);
    setScreen("lobby");
    setBusy(false);
  }

  async function joinGame() {
    setError("");
    if (!nameInput.trim() || !joinCodeInput.trim()) return setError("Enter your name and the room code");
    setBusy(true);
    const code = joinCodeInput.trim().toUpperCase();
    const r = await loadRoom(code);
    if (!r) { setBusy(false); return setError("Room not found — check the code"); }
    if (r.status !== "lobby") { setBusy(false); return setError("That game has already started"); }
    const me = { id: myId, name: nameInput.trim() };
    const updated = { ...r, players: [...r.players, me], log: [...r.log, { text: `${me.name} joined`, ts: Date.now() }] };
    await saveRoom(updated);
    setRoomCode(code);
    setScreen("lobby");
    setBusy(false);
  }

  async function exitGame() {
    if (roomCode && room) {
      const updatedPlayers = room.players.filter(p => p.id !== myId);
      if (updatedPlayers.length > 0) {
        const isHost = room.hostId === myId;
        const updatedRoom = {
          ...room,
          players: updatedPlayers,
          hostId: isHost ? updatedPlayers[0].id : room.hostId,
          log: [...(room.log || []), { text: `${room.players.find(p => p.id === myId)?.name || 'A player'} left the game`, ts: Date.now() }],
        };
        await saveRoom(updatedRoom);
      }
    }
    setRoomCode("");
    setRoom(null);
    setScreen("home");
  }

  async function startGame() {
    const r = await loadRoom(roomCode);
    if (!r) return;
    if (r.players.length < 2) return setError("Need at least 2 players to start");
    const deckIds = shuffle(CARDS.map(c => c.id));
    const n = r.players.length;
    const hands = {};
    r.players.forEach(p => { hands[p.id] = []; });
    deckIds.forEach((id, i) => hands[r.players[i % n].id].push(id));
    const updated = {
      ...r, status: "playing", hands, pickerId: r.players[0].id, pile: [], round: null,
      log: [...r.log, { text: "Game started — cards dealt!", ts: Date.now() }],
    };
    await saveRoom(updated);
  }

  async function chooseCategory(catKey) {
    const r = await loadRoom(roomCode);
    if (!r || r.status !== "playing") return;
    const active = r.players.filter(p => (r.hands[p.id] || []).length > 0);
    if (r.pickerId !== myId || active.length < 2) return;
    const cat = CATEGORIES.find(c => c.key === catKey);
    const revealed = {};
    active.forEach(p => { revealed[p.id] = r.hands[p.id][0]; });
    const values = {};
    active.forEach(p => { values[p.id] = CARD_MAP[revealed[p.id]].stats[catKey]; });
    const scored = active.map(p => {
      const v = values[p.id];
      const s = (v === null || v === undefined) ? (cat.higherWins ? -Infinity : Infinity) : v;
      return { pid: p.id, s };
    });
    const best = cat.higherWins ? Math.max(...scored.map(e => e.s)) : Math.min(...scored.map(e => e.s));
    const winners = scored.filter(e => e.s === best).map(e => e.pid);
    const isTie = winners.length > 1;

    const newHands = { ...r.hands };
    active.forEach(p => { newHands[p.id] = newHands[p.id].slice(1); });
    let newPile = [...(r.pile || [])];
    let logText;
    if (isTie) {
      active.forEach(p => newPile.push(revealed[p.id]));
      logText = `Tie on ${cat.label}! ${newPile.length} card${newPile.length === 1 ? "" : "s"} sitting in the pot.`;
    } else {
      const winnerId = winners[0];
      const winnerName = r.players.find(p => p.id === winnerId).name;
      const wonCards = shuffle([...active.map(p => revealed[p.id]), ...newPile]);
      newHands[winnerId] = [...newHands[winnerId], ...wonCards];
      newPile = [];
      logText = `${winnerName} won the round on ${cat.label}!`;
    }
    const stillActive = r.players.filter(p => (newHands[p.id] || []).length > 0);
    let nextPicker = isTie ? r.pickerId : winners[0];
    if (!stillActive.some(p => p.id === nextPicker)) nextPicker = stillActive[0]?.id;

    let status = r.status;
    if (stillActive.length <= 1) status = "ended";

    const updated = {
      ...r, hands: newHands, pile: newPile, pickerId: nextPicker, status,
      round: { category: catKey, revealed, values, winners, isTie, ts: Date.now() },
      log: [...r.log, { text: logText, ts: Date.now() }].slice(-40),
    };
    await saveRoom(updated);
  }

  async function playAgain() {
    await startGame();
  }

  function copyCode() {
    if (navigator.clipboard) navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  useEffect(() => {
    if (room && (room.status === "playing" || room.status === "ended") && screen !== "game") setScreen("game");
  }, [room, screen]);

  const wrap = { minHeight: "100vh", background: MINT, fontFamily: "'Lexend', sans-serif", padding: "16px 14px 60px" };

  return (
    <div style={wrap}>
      <div style={{ maxWidth: 460, margin: "0 auto 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {screen !== "home" ? (
          <button onClick={exitGame} style={{
            display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #C7E2C4", background: "#fff",
            padding: "6px 12px", borderRadius: 10, color: INK, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Lexend', sans-serif",
          }}>
            <LogOut size={15} /> Exit
          </button>
        ) : <div />}

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowBrowser(true)} style={{
            display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #C7E2C4", background: "#fff",
            padding: "6px 12px", borderRadius: 10, color: PURPLE, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Lexend', sans-serif",
          }}>
            <Grid size={15} /> Browse Cards
          </button>
          <button onClick={() => setShowRules(true)} style={{
            display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #C7E2C4", background: "#fff",
            padding: "6px 12px", borderRadius: 10, color: GREEN_DK, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Lexend', sans-serif",
          }}>
            <HelpCircle size={15} /> Rules
          </button>
        </div>
      </div>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showBrowser && <CardsBrowserModal onClose={() => setShowBrowser(false)} />}

      {/* Screen 1: Home */}
      {screen === "home" && (
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <img src={logoImg} alt="Top Funds Logo" style={{ maxHeight: 140, maxWidth: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 6px 18px rgba(30,50,20,0.08)", marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: INK }}>Your name</label>
            <input value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="e.g. Leo"
              style={{ width: "100%", boxSizing: "border-box", marginTop: 6, marginBottom: 16, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #DCEEDA", fontSize: 15, fontFamily: "'Lexend', sans-serif" }} />

            <button onClick={hostGame} disabled={busy} style={{
              width: "100%", padding: "12px", borderRadius: 12, border: "none", background: GREEN, color: "#fff",
              fontWeight: 800, fontSize: 15, cursor: "pointer", marginBottom: 14, fontFamily: "'Lexend', sans-serif",
            }}>Host a new game</button>

            <div style={{ textAlign: "center", color: "#9AA89A", fontSize: 12, margin: "6px 0 12px" }}>— or join one —</div>
            <input value={joinCodeInput} onChange={e => setJoinCodeInput(e.target.value.toUpperCase())} placeholder="Room code" maxLength={4}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #DCEEDA", fontSize: 15, letterSpacing: 4, textAlign: "center", marginBottom: 10, textTransform: "uppercase", fontFamily: "'Lexend', sans-serif" }} />
            <button onClick={joinGame} disabled={busy} style={{
              width: "100%", padding: "12px", borderRadius: 12, border: `2px solid ${PURPLE}`, background: "#fff", color: PURPLE,
              fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "'Lexend', sans-serif",
            }}>Join a game</button>
            {error && <div style={{ color: "#C0392B", fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</div>}
          </div>
        </div>
      )}

      {/* Screen 2: Lobby */}
      {screen === "lobby" && (
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          {!room ? (
            <div style={{ textAlign: "center", padding: 20 }}>Loading room…</div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <img src={logoImg} alt="Top Funds Logo" style={{ maxHeight: 95, maxWidth: "100%", objectFit: "contain", marginBottom: 12 }} />
                <div style={{ fontSize: 13, color: "#6B7C6B", marginBottom: 4 }}>Room code</div>
                <div onClick={copyCode} style={{
                  fontSize: 44, fontWeight: 900, letterSpacing: 8, color: PURPLE, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 10,
                }}>
                  {roomCode} {copied ? <Check size={26} color={GREEN_DK} /> : <Copy size={22} />}
                </div>
                <div style={{ fontSize: 12, color: "#9AA89A" }}>tap to copy · share with your group</div>
              </div>
              <div style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 6px 18px rgba(30,50,20,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, color: INK, marginBottom: 12 }}>
                  <Users size={18} color={PURPLE} /> Players ({room.players.length})
                </div>
                {room.players.map(p => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 4px", fontSize: 15, color: INK }}>
                    {p.id === room.hostId && <Crown size={16} color={GREEN_DK} />}
                    {p.name} {p.id === myId && <span style={{ color: "#9AA89A", fontSize: 12 }}>(you)</span>}
                  </div>
                ))}
                {room.hostId === myId ? (
                  <button onClick={startGame} disabled={room.players.length < 2} style={{
                    width: "100%", marginTop: 16, padding: "12px", borderRadius: 12, border: "none",
                    background: room.players.length < 2 ? "#CBE3C7" : GREEN, color: "#fff", fontWeight: 800, fontSize: 15,
                    cursor: room.players.length < 2 ? "default" : "pointer", fontFamily: "'Lexend', sans-serif",
                  }}>{room.players.length < 2 ? "Waiting for more players…" : `Start game (${room.players.length} players, ${CARDS.length} cards)`}</button>
                ) : (
                  <div style={{ marginTop: 16, textAlign: "center", color: "#6B7C6B", fontSize: 13.5 }}>Waiting for the host to start the game…</div>
                )}
                {error && <div style={{ color: "#C0392B", fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</div>}
              </div>
            </>
          )}
        </div>
      )}

      {/* Screen 3: Game */}
      {screen === "game" && (
        <div style={{ maxWidth: 460, margin: "0 auto" }}>
          {!room ? (
            <div style={{ textAlign: "center", padding: 20 }}>Loading…</div>
          ) : room.status === "ended" ? (
            <div style={{ textAlign: "center" }}>
              <Trophy size={48} color={GREEN_DK} style={{ margin: "10px auto" }} />
              <div style={{ fontSize: 26, fontWeight: 900, color: INK }}>
                {([...room.players].map(p => ({ ...p, count: (room.hands[p.id] || []).length })).sort((a, b) => b.count - a.count)[0])?.name} wins!
              </div>
              <div style={{ color: "#6B7C6B", marginBottom: 20 }}>with all funds</div>
              <div style={{ background: "#fff", borderRadius: 16, padding: 18, textAlign: "left" }}>
                {[...room.players].map(p => ({ ...p, count: (room.hands[p.id] || []).length })).sort((a, b) => b.count - a.count).map((p, i) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 4px", borderBottom: "1px solid #EFF5EC" }}>
                    <span style={{ fontWeight: 700, color: INK }}>{i + 1}. {p.name}</span>
                    <span style={{ color: PURPLE, fontWeight: 700 }}>{p.count} cards</span>
                  </div>
                ))}
              </div>
              {room.hostId === myId && (
                <button onClick={playAgain} style={{
                  marginTop: 20, padding: "12px 20px", borderRadius: 12, border: "none", background: GREEN, color: "#fff",
                  fontWeight: 800, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Lexend', sans-serif",
                }}><RefreshCw size={16} /> Reshuffle & play again</button>
              )}
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <img src={logoImg} alt="Top Funds Logo" style={{ maxHeight: 65, maxWidth: "100%", objectFit: "contain" }} />
                <div style={{ fontSize: 12, color: "#9AA89A", marginTop: 4 }}>Room {roomCode} {(room.pile || []).length > 0 && `· pot: ${(room.pile || []).length}`}</div>
              </div>

              {/* Scoreboard */}
              <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14, paddingBottom: 2 }}>
                {[...room.players].map(p => ({ ...p, count: (room.hands[p.id] || []).length })).sort((a, b) => b.count - a.count).map(p => (
                  <div key={p.id} style={{
                    flex: "0 0 auto", background: p.id === room.pickerId ? PURPLE : "#fff", color: p.id === room.pickerId ? "#fff" : INK,
                    borderRadius: 12, padding: "8px 12px", fontSize: 13, fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}>{p.name}{p.id === myId ? " (you)" : ""} · {p.count}</div>
                ))}
              </div>

              <div style={{ textAlign: "center", marginBottom: 14, fontWeight: 700, color: room.pickerId === myId ? GREEN_DK : INK, fontSize: 14.5 }}>
                {(room.hands[myId] || []).length === 0 ? "You're out of cards — spectating" : room.pickerId === myId ? "Your turn — tap a stat below to play it" : `Waiting for ${room.players.find(p => p.id === room.pickerId)?.name || "…"} to choose a stat`}
              </div>

              {(room.hands[myId] || [])[0] ? (
                <FundCard card={CARD_MAP[(room.hands[myId] || [])[0]]} interactive={room.pickerId === myId} onPick={chooseCategory} />
              ) : (
                <CardBack />
              )}

              {room.round && (
                <div style={{ marginTop: 18, background: "#fff", borderRadius: 16, padding: 14 }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5, color: INK, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={15} color={PURPLE} /> Last round: {CATEGORIES.find(c => c.key === room.round.category)?.label}
                  </div>
                  {room.players.filter(p => room.round.revealed[p.id]).map(p => {
                    const c = CARD_MAP[room.round.revealed[p.id]];
                    const won = room.round.winners.includes(p.id);
                    const cat = CATEGORIES.find(catItem => catItem.key === room.round.category);
                    return (
                      <div key={p.id} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 8px",
                        borderRadius: 8, background: won ? MINT : "transparent", marginBottom: 4,
                      }}>
                        <span style={{ fontSize: 13, color: INK }}>{p.name}: {c.name}</span>
                        <span style={{ fontWeight: 800, color: won ? GREEN_DK : "#9AA89A" }}>{cat.fmt(room.round.values[p.id])}{won && !room.round.isTie ? " 🏆" : ""}</span>
                      </div>
                    );
                  })}
                  {room.round.isTie && <div style={{ fontSize: 12.5, color: AMBER, marginTop: 4 }}>Tie! Cards held in the pot for next round.</div>}
                </div>
              )}

              <div style={{ marginTop: 18 }}>
                <div style={{ fontWeight: 800, fontSize: 12.5, color: "#9AA89A", marginBottom: 6 }}>ACTIVITY</div>
                <div style={{ background: "#fff", borderRadius: 12, padding: "8px 12px", maxHeight: 140, overflowY: "auto" }}>
                  {[...(room.log || [])].reverse().map((l, i) => (
                    <div key={i} style={{ fontSize: 12.5, color: "#5A6B5A", padding: "3px 0" }}>{l.text}</div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
