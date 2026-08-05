import React, { useState, useEffect, useRef } from "react";
import { ref, set, get, onValue, off } from "firebase/database";
import { db } from "./firebase";
import { 
  TrendingUp, TrendingDown, Layers, Leaf, Coins, Globe2, Crown, 
  Users, Copy, Check, RefreshCw, Trophy, Sparkles, HelpCircle, 
  Grid, LogOut, X, Search, Eye
} from "lucide-react";

import logoImg from "./logo.png";

import confetti from "canvas-confetti";

// Import Manager Logos
import fidelityLogo from "./fidelity.png";
import vanguardLogo from "./vanguard.png";
import lgLogo from "./lg.png";
import isharesLogo from "./ishares.png";
import wisdomtreeLogo from "./wisdomtree.png";
import mgLogo from "./mg.png";
import artemisLogo from "./artemis.png";
import arkLogo from "./ark.png";
import xtrackersLogo from "./xtrackers.png";
import aegonLogo from "./aegon.png";
import hsbcLogo from "./hsbc.png";
import baillieLogo from "./baillie.png";
import invescoLogo from "./invesco.png";
import schrodersLogo from "./schroders.png";
import jpmorganLogo from "./jpmorgan.png";

// ---------- Fund card data (24 Cards) ----------
const CARDS = [
  { id: "fid-world", name: "Fidelity Index World Fund P Acc", manager: "Fidelity", logo: fidelityLogo, desc: "Invests in thousands of big companies across developed countries worldwide", risk: 5, stats: { growth2025: 18.50, holdings: 1400, esg: 3.5, cost: 0.12, countries: 23, growth2022: -7.80 } },
  { id: "van-allcap", name: "Vanguard FTSE Global All Cap Index Fund Acc", manager: "Vanguard", logo: vanguardLogo, desc: "Owns a tiny slice of almost every public company in the world", risk: 5, stats: { growth2025: 17.20, holdings: 7150, esg: 3.5, cost: 0.23, countries: 49, growth2022: -8.10 } },
  { id: "lg-global-eq", name: "L&G Global Equity Index Fund", manager: "L&G", logo: lgLogo, desc: "Spreads your money across hundreds of major international businesses", risk: 5, stats: { growth2025: 18.10, holdings: 2200, esg: 3.5, cost: 0.13, countries: 23, growth2022: -7.90 } },
  { id: "van-gb-bond", name: "Vanguard Global Bond Index Fund", manager: "Vanguard", logo: vanguardLogo, desc: "Lends money to governments and big companies globally for steady returns", risk: 3, stats: { growth2025: 5.30, holdings: 11200, esg: 3.5, cost: 0.15, countries: 55, growth2022: -12.50 } },
  { id: "ish-agbp", name: "iShares Core Global Aggregate Bond UCITS ETF", manager: "iShares", logo: isharesLogo, desc: "A giant collection of global loans designed to keep your money safer", risk: 3, stats: { growth2025: 5.20, holdings: 11500, esg: 3.5, cost: 0.10, countries: 65, growth2022: -13.10 } },
  { id: "van-smcap", name: "Vanguard Global Small-Cap Index Fund Acc", manager: "Vanguard", logo: vanguardLogo, desc: "Focuses on smaller, up-and-coming companies worldwide for higher growth potential", risk: 6, stats: { growth2025: 14.30, holdings: 4400, esg: 3.5, cost: 0.29, countries: 23, growth2022: -10.20 } },
  { id: "lg-ispy", name: "L&G Cyber Security UCITS ETF", manager: "L&G", logo: lgLogo, desc: "Invests in companies that protect computers and data from hackers", risk: 6, stats: { growth2025: 21.60, holdings: 42, esg: 3, cost: 0.69, countries: 8, growth2022: -25.40 } },
  { id: "wt-btc", name: "WisdomTree Physical Bitcoin", manager: "WisdomTree", logo: wisdomtreeLogo, desc: "Tracks the price of Bitcoin directly for high-risk, high-reward growth", risk: 7, stats: { growth2025: 45.20, holdings: 1, esg: 1, cost: 0.35, countries: 1, growth2022: -64.20 } },
  { id: "mg-japan", name: "M&G Japan Fund", manager: "M&G", logo: mgLogo, desc: "Invests in innovative Japanese companies, from robotics to electronics", risk: 5, stats: { growth2025: 12.40, holdings: 65, esg: 3.5, cost: 0.68, countries: 1, growth2022: -3.50 } },
  { id: "art-euro", name: "Artemis European Growth Fund", manager: "Artemis", logo: artemisLogo, desc: "Targets fast-growing top companies across continental Europe", risk: 5, stats: { growth2025: 15.80, holdings: 52, esg: 4.0, cost: 0.85, countries: 12, growth2022: -9.20 } },
  { id: "ark-ai", name: "ARK Artificial Intelligence & Tech ETF", manager: "ARK", logo: arkLogo, desc: "High-conviction bets on future tech innovators, AI, and automation", risk: 7, stats: { growth2025: 32.10, holdings: 35, esg: 2.5, cost: 0.75, countries: 4, growth2022: -45.60 } },
  { id: "xtr-gold", name: "Xtrackers Physical Gold ETC", manager: "Xtrackers", logo: xtrackersLogo, desc: "Backed directly by physical gold bullion stored safely in vault vaults", risk: 4, stats: { growth2025: 11.20, holdings: 1, esg: 3.0, cost: 0.15, countries: 1, growth2022: 6.80 } },
  { id: "aeg-hy-bond", name: "Aegon High Yield Bond Fund", manager: "Aegon", logo: aegonLogo, desc: "Lends to higher-risk companies in exchange for larger monthly income payouts", risk: 4, stats: { growth2025: 7.90, holdings: 180, esg: 3.0, cost: 0.58, countries: 15, growth2022: -10.40 } },
  { id: "hsbc-ftse200", name: "HSBC FTSE 250 Index Fund", manager: "HSBC", logo: hsbcLogo, desc: "Focuses on medium-sized UK businesses driving local economic growth", risk: 5, stats: { growth2025: 9.40, holdings: 250, esg: 3.5, cost: 0.18, countries: 1, growth2022: -19.70 } },
  { id: "bg-smcap", name: "Baillie Gifford Smaller Companies", manager: "Baillie Gifford", logo: baillieLogo, desc: "Backs ambitious small UK companies looking to become the titans of tomorrow", risk: 6, stats: { growth2025: 16.50, holdings: 75, esg: 4.0, cost: 0.73, countries: 1, growth2022: -28.10 } },
  { id: "inv-clean", name: "Invesco Global Clean Energy ETF", manager: "Invesco", logo: invescoLogo, desc: "Invests in solar, wind, and renewable energy companies driving decarbonisation", risk: 6, stats: { growth2025: 22.40, holdings: 120, esg: 5.0, cost: 0.60, countries: 18, growth2022: -18.30 } },
  { id: "sch-us-eq", name: "Schroder US Equity Fund", manager: "Schroders", logo: schrodersLogo, desc: "Targets leading American blue-chip businesses across tech, retail, and healthcare", risk: 5, stats: { growth2025: 20.30, holdings: 60, esg: 3.5, cost: 0.52, countries: 1, growth2022: -14.20 } },
  { id: "jpm-emerging", name: "JPMorgan Emerging Markets Fund", manager: "JPMorgan", logo: jpmorganLogo, desc: "Invests in fast-growing developing economies like India, Brazil, and Vietnam", risk: 6, stats: { growth2025: 13.80, holdings: 85, esg: 3.0, cost: 0.78, countries: 22, growth2022: -16.90 } },
  { id: "van-s&p500", name: "Vanguard S&P 500 UCITS ETF", manager: "Vanguard", logo: vanguardLogo, desc: "Tracks the 500 largest publicly traded companies in the United States", risk: 5, stats: { growth2025: 21.10, holdings: 503, esg: 3.5, cost: 0.07, countries: 1, growth2022: -13.10 } },
  { id: "ish-nasdaq", name: "iShares NASDAQ 100 UCITS ETF", manager: "iShares", logo: isharesLogo, desc: "Concentrated exposure to 100 major tech and innovation giants in the US", risk: 6, stats: { growth2025: 26.80, holdings: 101, esg: 3.5, cost: 0.33, countries: 1, growth2022: -32.40 } },
  { id: "lg-health", name: "L&G Healthcare Breakthrough ETF", manager: "L&G", logo: lgLogo, desc: "Invests in medical technology, pharmaceuticals, and modern biotech firms", risk: 6, stats: { growth2025: 14.90, holdings: 95, esg: 4.5, cost: 0.49, countries: 14, growth2022: -12.10 } },
  { id: "fid-asia", name: "Fidelity Asia Pacific Focus Fund", manager: "Fidelity", logo: fidelityLogo, desc: "Focuses on market-leading companies across Asian developed markets", risk: 6, stats: { growth2025: 11.60, holdings: 50, esg: 3.5, cost: 0.90, countries: 9, growth2022: -11.40 } },
  { id: "hsbc-uk-all", name: "HSBC UK All Share Index Fund", manager: "HSBC", logo: hsbcLogo, desc: "Spreads investments across companies of all sizes operating in the UK", risk: 5, stats: { growth2025: 10.10, holdings: 580, esg: 3.5, cost: 0.06, countries: 1, growth2022: 0.80 } },
  { id: "ish-div", name: "iShares UK Dividend UCITS ETF", manager: "iShares", logo: isharesLogo, desc: "Targets 50 high-dividend paying UK businesses to generate regular cash return", risk: 4, stats: { growth2025: 8.70, holdings: 50, esg: 3.0, cost: 0.40, countries: 1, growth2022: 4.10 } }
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

const MINT = "#eef8eb", GREEN = "#71c558", GREEN_DK = "#3F7E27", PURPLE = "#8c52ff", INK = "#1F2A1F", AMBER = "#C1791C", RED = "#E53935";

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

function launchWinnerConfetti() {
  if (typeof window === "undefined") return;

  const burst = () => {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#71c558", "#8c52ff", "#FFD700"],
      zIndex: 3000,
    });
  };

  window.requestAnimationFrame(burst);
  window.setTimeout(burst, 220);
}

function StatValue({ v }) {
  if (v === null || v === undefined) return <span style={{ color: AMBER, fontWeight: 700 }}>N/A</span>;
  const isNeg = typeof v === "string" && v.trim().startsWith("-");
  return <span style={{ color: isNeg ? AMBER : GREEN_DK, fontWeight: 700 }}>{v}</span>;
}

function StarIcon({ fillPercentage }) {
  const gradientId = React.useId();
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 2, verticalAlign: "middle" }}>
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={`${fillPercentage}%`} stopColor={GREEN_DK} />
          <stop offset={`${fillPercentage}%`} stopColor="#E0EBE0" />
        </linearGradient>
      </defs>
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={`url(#${gradientId})`}
        stroke={GREEN_DK}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Stars({ n }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(100, (n - i + 1) * 100));
        return <StarIcon key={i} fillPercentage={fill} />;
      })}
    </span>
  );
}

function RiskScale({ risk }) {
  return (
    <div style={{ margin: "16px 0 18px" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#6B7C6B", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
        Risk Rating
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5, 6, 7].map(n => (
          <div key={n} style={{
            flex: 1, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800,
            background: n === risk ? PURPLE : "#EDEAF9",
            color: n === risk ? "#fff" : "#B7ADE8",
          }}>{n}</div>
        ))}
      </div>
    </div>
  );
}

function FundCard({ card, interactive, onPick, highlightKey, dim }) {
  if (!card) return null;
  return (
    <div style={{
      background: "#fff", borderRadius: 22, padding: "26px 22px 18px", width: "100%", maxWidth: 380, boxSizing: "border-box",
      boxShadow: "0 8px 24px rgba(30,50,20,0.12)", opacity: dim ? 0.55 : 1, border: "2px solid #E3F0E1", margin: "0 auto",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <img 
          src={card.logo} 
          alt={`${card.manager} logo`} 
          style={{ width: 52, height: 52, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} 
        />
        <div style={{ fontWeight: 800, fontSize: 18, color: INK, lineHeight: 1.25 }}>{card.name}</div>
      </div>
      
      <div style={{ color: PURPLE, fontSize: 15, fontStyle: "italic", lineHeight: 1.4, margin: "12px 0 16px" }}>
        {card.desc}
      </div>

      <RiskScale risk={card.risk} />

      <hr style={{ border: "none", borderTop: "2px solid #EFF5EC", margin: "18px 0 12px" }} />

      <div>
        {CATEGORIES.map(cat => {
          const raw = card.stats ? card.stats[cat.key] : null;
          const isHighlight = highlightKey === cat.key;
          const Icon = cat.icon;
          const body = cat.key === "esg" ? <Stars n={raw} /> : <StatValue v={raw !== null && raw !== undefined ? cat.fmt(raw) : "N/A"} />;
          const clickable = interactive && typeof onPick === "function";
          return (
            <div
              key={cat.key}
              onClick={clickable ? () => onPick(cat.key) : undefined}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 10px", borderBottom: "1px solid #EFF5EC", cursor: clickable ? "pointer" : "default",
                background: isHighlight ? MINT : "transparent", borderRadius: 10, margin: "2px 0",
                transition: "background 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: INK, fontWeight: 600, fontSize: 15 }}>
                <Icon size={18} color={PURPLE} />
                {cat.label}
                {cat.note && <span style={{ fontSize: 11.5, color: "#9AA89A", fontWeight: 500 }}>({cat.note})</span>}
              </div>
              <div style={{ fontSize: 15.5 }}>{body}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Modals ----------
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(15, 25, 15, 0.6)", display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 16,
    }}>
      <div style={{
        background: "#fff", borderRadius: 22, width: "100%", maxWidth: 480, maxHeight: "85vh",
        display: "flex", flexDirection: "column", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", overflow: "hidden",
      }}>
        <div style={{
          padding: "18px 22px", borderBottom: "1px solid #EFF5EC", display: "flex",
          justifyContent: "space-between", alignItems: "center", background: MINT,
        }}>
          <div style={{ fontWeight: 800, fontSize: 20, color: INK }}>{title}</div>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4 }}>
            <X size={22} color={INK} />
          </button>
        </div>
        <div style={{ padding: 22, overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function RulesModal({ onClose }) {
  return (
    <Modal title="How to Play" onClose={onClose}>
      <div style={{ color: INK, fontSize: 15, lineHeight: 1.65 }}>
        <p style={{ marginTop: 0 }}><b>Goal:</b> Win all the cards in the deck!</p>
        <div style={{ background: MINT, padding: 14, borderRadius: 14, marginBottom: 14 }}>
          <b>1. Pick a Stat:</b> On your turn, look at your top card and choose the stat you think is best.
        </div>
        <div style={{ background: MINT, padding: 14, borderRadius: 14, marginBottom: 14 }}>
          <b>2. Compare Cards:</b> All players compare their top card stats:
          <ul style={{ margin: "8px 0 0", paddingLeft: 22 }}>
            <li><b>Higher wins for:</b> Growth, Holdings, ESG Rating, Countries</li>
            <li><b>Lower wins for:</b> Cost</li>
          </ul>
        </div>
        <div style={{ background: MINT, padding: 14, borderRadius: 14, marginBottom: 14 }}>
          <b>3. Win or Tie:</b>
          <ul style={{ margin: "8px 0 0", paddingLeft: 22 }}>
            <li>The winner takes all played cards and picks next.</li>
            <li>In a <b>tie</b>, cards stay in the pot for the next winner!</li>
          </ul>
        </div>
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
      <div style={{ position: "relative", marginBottom: 18 }}>
        <Search size={20} color="#9AA89A" style={{ position: "absolute", left: 14, top: 14 }} />
        <input 
          value={filter} 
          onChange={e => setFilter(e.target.value)} 
          placeholder="Search funds or managers..."
          style={{
            width: "100%", boxSizing: "border-box", padding: "12px 14px 12px 42px",
            borderRadius: 12, border: "1.5px solid #DCEEDA", fontSize: 15, fontFamily: "'Lexend', sans-serif",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {filtered.map(card => (
          <FundCard key={card.id} card={card} interactive={false} />
        ))}
      </div>
    </Modal>
  );
}

function AdminModal({ onClose, onSpectate }) {
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roomsRef = ref(db, "rooms");
    const handler = onValue(roomsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const list = Object.keys(data).map(code => ({ code, ...data[code] }));
        list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        setAllRooms(list);
      } else {
        setAllRooms([]);
      }
      setLoading(false);
    });
    return () => off(roomsRef, "value", handler);
  }, []);

  return (
    <Modal title="🛡️ Admin Control Panel" onClose={onClose}>
      {loading ? (
        <div style={{ textAlign: "center", padding: 20 }}>Loading live rooms...</div>
      ) : allRooms.length === 0 ? (
        <div style={{ textAlign: "center", padding: 20, color: "#9AA89A" }}>No active rooms found.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {allRooms.map(r => (
            <div key={r.code} style={{ background: MINT, padding: 16, borderRadius: 14, border: "1.5px solid #C7E2C4" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <span style={{ fontWeight: 900, fontSize: 18, color: PURPLE, marginRight: 8 }}>{r.code}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: r.status === "playing" ? GREEN : "#E0E0E0", color: "#fff" }}>
                    {r.status}
                  </span>
                </div>
                <button onClick={() => onSpectate(r.code)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${PURPLE}`, background: "#fff", color: PURPLE, fontWeight: 700, cursor: "pointer" }}>
                  Spectate
                </button>
              </div>
              <div style={{ fontSize: 13, color: INK }}><b>Players:</b> {r.players?.map(p => p.name).join(", ")}</div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// ---------- Main App Component ----------
export default function App() {
  const [screen, setScreen] = useState("home"); 
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
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoTaps, setLogoTaps] = useState(0);

  const listenerRef = useRef(null);

  useEffect(() => {
    const fontId = "lexend-font-link";
    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");
      link.id = fontId;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700;800;900&display=swap";
      document.head.appendChild(link);
    }
  }, []);

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

  useEffect(() => {
    if (room && (room.status === "playing" || room.status === "ended") && screen !== "game") {
      setScreen("game");
    }
  }, [room, screen]);

  function handleLogoClick() {
    if (logoTaps + 1 >= 5) {
      setShowAdmin(true);
      setLogoTaps(0);
    } else {
      setLogoTaps(prev => prev + 1);
    }
  }

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

  const handleJoinClick = () => {
    if (joinCodeInput.toLowerCase() === "rlma") {
      setShowAdmin(true);
      setJoinCodeInput("");
      return;
    }
    joinGame();
  };

// Fire confetti ONLY for the winning player when the game ends
useEffect(() => {
  if (room?.status !== "ended" || !room?.players) return;

  const sorted = [...room.players].map(p => ({
    ...p,
    cardCount: (room.hands?.[p.id] || []).length
  })).sort((a, b) => b.cardCount - a.cardCount);

  const winnerId = sorted[0]?.id;

  if (winnerId !== myId) return;

  const timer = window.setTimeout(() => launchWinnerConfetti(), 120);
  return () => window.clearTimeout(timer);
}, [room?.status, room?.players, room?.hands, myId]);

  async function joinGame(codeToJoin = null, asSpectator = false) {
    setError("");
    const code = (codeToJoin || joinCodeInput).trim().toUpperCase();
    const name = nameInput.trim() || (asSpectator ? "Admin (Viewer)" : "");
    
    if (!code) return setError("Enter a room code");
    if (!asSpectator && !name) return setError("Enter your name first");
    
    setBusy(true);
    const r = await loadRoom(code);
    if (!r) { setBusy(false); return setError("Room not found"); }
    
    if (r.status !== "lobby" && !asSpectator) {
      setBusy(false);
      return setError("That game has already started");
    }

    const me = { id: myId, name: asSpectator ? "👀 Admin" : name, isSpectator: asSpectator };
    const existingPlayers = r.players || [];
    const alreadyIn = existingPlayers.some(p => p.id === myId);
    
    const updated = { 
      ...r, 
      players: alreadyIn ? existingPlayers : [...existingPlayers, me],
      log: [...(r.log || []), { text: `${me.name} ${asSpectator ? "joined as viewer" : "joined"}`, ts: Date.now() }] 
    };
    
    await saveRoom(updated);
    setRoomCode(code);
    setScreen(r.status === "playing" ? "game" : "lobby"); 
    setBusy(false);
  }

  async function exitGame() {
    if (roomCode && room) {
      const updatedPlayers = (room.players || []).filter(p => p.id !== myId);
      if (updatedPlayers.length > 0) {
        const isHost = room.hostId === myId;
        const updatedRoom = {
          ...room,
          players: updatedPlayers,
          hostId: isHost ? updatedPlayers[0].id : room.hostId,
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

  async function reshuffleAndPlayAgain() {
    await startGame();
  }

  async function chooseCategory(catKey) {
    const r = await loadRoom(roomCode);
    if (!r || r.status !== "playing") return;
    const active = r.players.filter(p => (r.hands?.[p.id] || []).length > 0);
    if (r.pickerId !== myId || active.length < 2) return;
    
    const cat = CATEGORIES.find(c => c.key === catKey);
    const revealed = {};
    active.forEach(p => { revealed[p.id] = r.hands[p.id][0]; });
    const values = {};
    active.forEach(p => { values[p.id] = CARD_MAP[revealed[p.id]]?.stats?.[catKey]; });
    
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
      logText = `Tie on ${cat.label}! ${newPile.length} cards in the pot.`;
    } else {
      const winnerId = winners[0];
      const winnerName = r.players.find(p => p.id === winnerId)?.name || "Player";
      const wonCards = shuffle([...active.map(p => revealed[p.id]), ...newPile]);
      newHands[winnerId] = [...newHands[winnerId], ...wonCards];
      newPile = [];
      logText = `${winnerName} won round on ${cat.label}!`;
    }

    const stillActive = r.players.filter(p => (newHands[p.id] || []).length > 0);
    let nextPicker = isTie ? r.pickerId : winners[0];
    if (!stillActive.some(p => p.id === nextPicker)) nextPicker = stillActive[0]?.id;

    let status = r.status;
    if (stillActive.length <= 1) status = "ended";

    const updated = {
      ...r, hands: newHands, pile: newPile, pickerId: nextPicker, status,
      round: { category: catKey, revealed, values, winners, isTie, ts: Date.now() },
      log: [...(r.log || []), { text: logText, ts: Date.now() }].slice(-40),
    };
    await saveRoom(updated);
  }

  function copyCode() {
    if (navigator.clipboard) navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Safe checks for rendering game view
  const myHand = room?.hands?.[myId] || [];
  const activeCard = myHand[0] ? CARD_MAP[myHand[0]] : null;
  const isMyTurn = room?.pickerId === myId;
  const isSpectator = room?.players?.find(p => p.id === myId)?.isSpectator;

  // Sorted Leaderboard calculations
  const leaderboard = room?.players ? [...room.players].map(p => ({
    ...p,
    cardCount: (room.hands?.[p.id] || []).length
  })).sort((a, b) => b.cardCount - a.cardCount) : [];

  const roundSummary = room?.round
    ? (() => {
        if (room.round.isTie) {
          return {
            title: "Tie on the last round",
            body: `Cards stayed in the pot. You now have ${myHand.length} cards.`,
          };
        }

        const winner = room.players?.find(p => p.id === room.round.winners?.[0]);
        if (winner?.id === myId) {
          return {
            title: "You won the last round!",
            body: `You now have ${myHand.length} cards.`,
          };
        }

        return {
          title: `${winner?.name || "Someone"} won the last round`,
          body: `You now have ${myHand.length} cards.`,
        };
      })()
    : null;

  const isHost = room?.hostId === myId;
  const wrap = { minHeight: "100vh", background: MINT, fontFamily: "'Lexend', sans-serif", padding: "18px 16px 60px" };

  return (
    <div style={wrap}>
      {/* Header Bar */}
      <div style={{ maxWidth: 480, margin: "0 auto 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {screen !== "home" ? (
          <button onClick={exitGame} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #C7E2C4", background: "#fff", padding: "8px 14px", borderRadius: 12, color: INK, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            <LogOut size={16} /> Exit
          </button>
        ) : <div />}

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowBrowser(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #C7E2C4", background: "#fff", padding: "8px 14px", borderRadius: 12, color: PURPLE, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            <Grid size={16} /> Browse
          </button>
          <button onClick={() => setShowRules(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #C7E2C4", background: "#fff", padding: "8px 14px", borderRadius: 12, color: GREEN_DK, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            <HelpCircle size={16} /> Rules
          </button>
        </div>
      </div>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showBrowser && <CardsBrowserModal onClose={() => setShowBrowser(false)} />}
      {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} onSpectate={(code) => { setShowAdmin(false); joinGame(code, true); }} />}

      {/* Screen 1: Home */}
      {screen === "home" && (
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img src={logoImg} alt="Top Funds Logo" onClick={handleLogoClick} style={{ maxHeight: 150, maxWidth: "100%", objectFit: "contain", cursor: "pointer" }} />
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 6px 18px rgba(30,50,20,0.08)", marginBottom: 16 }}>
            <label style={{ fontSize: 14, fontWeight: 700, color: INK }}>Your Name</label>
            <input 
              value={nameInput} 
              onChange={e => setNameInput(e.target.value)} 
              placeholder="e.g. Alex"
              style={{ width: "100%", boxSizing: "border-box", marginTop: 8, marginBottom: 18, padding: "12px 14px", borderRadius: 12, border: "1.5px solid #DCEEDA", fontSize: 16, fontFamily: "'Lexend', sans-serif" }}
            />

            <button onClick={hostGame} disabled={busy} style={{ width: "100%", padding: 14, borderRadius: 14, background: GREEN_DK, color: "#fff", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer", marginBottom: 16 }}>
              Host New Game
            </button>

            <div style={{ display: "flex", gap: 10 }}>
              <input 
                value={joinCodeInput} 
                onChange={e => setJoinCodeInput(e.target.value.toUpperCase())} 
                placeholder="ROOM CODE" 
                maxLength={4}
                style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: "1.5px solid #DCEEDA", fontSize: 16, textAlign: "center", fontWeight: 800, letterSpacing: 2, fontFamily: "'Lexend', sans-serif" }}
              />
              <button onClick={handleJoinClick} disabled={busy} style={{ padding: "12px 20px", borderRadius: 12, background: PURPLE, color: "#fff", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
                Join
              </button>
            </div>
            {error && <div style={{ color: RED, fontSize: 14, fontWeight: 700, marginTop: 12, textAlign: "center" }}>{error}</div>}
          </div>
        </div>
      )}

      {/* Screen 2: Lobby */}
      {screen === "lobby" && room && (
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 6px 18px rgba(30,50,20,0.08)", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#6B7C6B", textTransform: "uppercase" }}>Room Code</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: PURPLE, letterSpacing: 4, margin: "6px 0 14px" }}>{room.code}</div>
            
            <button onClick={copyCode} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #DCEEDA", background: MINT, padding: "8px 16px", borderRadius: 10, color: INK, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 20 }}>
              {copied ? <Check size={16} color={GREEN_DK} /> : <Copy size={16} />} 
              {copied ? "Copied!" : "Copy Code"}
            </button>

            <div style={{ textAlign: "left", marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: INK, marginBottom: 10 }}>Players Joined ({room.players?.length || 0})</div>
              {room.players?.map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: MINT, borderRadius: 10, marginBottom: 6, fontWeight: 700, color: INK }}>
                  <span>{p.name} {p.id === room.hostId && "👑 Host"}</span>
                </div>
              ))}
            </div>

            {room.hostId === myId ? (
              <button onClick={startGame} style={{ width: "100%", padding: 14, borderRadius: 14, background: GREEN_DK, color: "#fff", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
                Start Game
              </button>
            ) : (
              <div style={{ color: "#6B7C6B", fontWeight: 600, fontSize: 15 }}>Waiting for host to start...</div>
            )}
            {error && <div style={{ color: RED, fontSize: 14, fontWeight: 700, marginTop: 12 }}>{error}</div>}
          </div>
        </div>
      )}

      {/* Screen 3: Active Game & Game Over Screen */}
      {screen === "game" && room && (
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          {room.status === "ended" ? (
            /* GAME OVER LEADERBOARD VIEW */
            <div style={{ background: "#fff", borderRadius: 22, padding: 24, boxShadow: "0 8px 24px rgba(30,50,20,0.12)", textAlign: "center" }}>
              <Trophy size={48} color={AMBER} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 26, fontWeight: 900, color: INK, marginBottom: 4 }}>Game Over!</div>
              <div style={{ fontSize: 16, color: PURPLE, fontWeight: 800, marginBottom: 20 }}>
                👑 {leaderboard[0]?.name} Wins!
              </div>

              {/* Leaderboard Table */}
              <div style={{ textAlign: "left", marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#6B7C6B", textTransform: "uppercase", marginBottom: 8 }}>
                  Final Standings
                </div>
                {leaderboard.map((p, idx) => (
                  <div 
                    key={p.id} 
                    style={{ 
                      display: "flex", 
                      justifySpace: "between", 
                      alignItems: "center", 
                      padding: "12px 14px", 
                      background: idx === 0 ? MINT : "#F8FAF8", 
                      borderRadius: 12, 
                      marginBottom: 8, 
                      border: idx === 0 ? "1.5px solid #C7E2C4" : "1px solid #EFF5EC" 
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 800, fontSize: 16, color: idx === 0 ? GREEN_DK : "#6B7C6B", width: 20 }}>
                        #{idx + 1}
                      </span>
                      <span style={{ fontWeight: 700, color: INK, fontSize: 16 }}>
                        {p.name} {idx === 0 && "🏆"}
                      </span>
                    </div>
                    <span style={{ fontWeight: 800, color: PURPLE, fontSize: 15 }}>
                      {p.cardCount} {p.cardCount === 1 ? "card" : "cards"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Reshuffle & Play Again Action */}
              {isHost ? (
                <button 
                  onClick={reshuffleAndPlayAgain} 
                  style={{ 
                    width: "100%", padding: 14, borderRadius: 14, background: GREEN_DK, 
                    color: "#fff", border: "none", fontWeight: 800, fontSize: 16, 
                    cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 
                  }}
                >
                  <RefreshCw size={18} /> Reshuffle & Play Again
                </button>
              ) : (
                <div style={{ color: "#6B7C6B", fontWeight: 600, fontSize: 15 }}>
                  Waiting for host to restart game...
                </div>
              )}
            </div>
          ) : (
            /* ACTIVE GAMEPLAY VIEW */
            <>
              {isSpectator ? (
                <div style={{ background: INK, color: "#fff", padding: 12, borderRadius: 14, textAlign: "center", marginBottom: 16, fontWeight: 700 }}>
                  👀 Spectator Mode
                </div>
              ) : (
                <div style={{ background: isMyTurn ? GREEN_DK : "#fff", color: isMyTurn ? "#fff" : INK, padding: 12, borderRadius: 14, textAlign: "center", marginBottom: 16, fontWeight: 800, border: isMyTurn ? "none" : "2px solid #DCEEDA" }}>
                  {isMyTurn ? "✨ Your Turn — Choose a Stat!" : `Waiting for ${room.players.find(p => p.id === room.pickerId)?.name || "player"}...`}
                </div>
              )}

              {/* Player Hand info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 4px" }}>
                <span style={{ fontWeight: 800, color: INK }}>You have {myHand.length} cards</span>
                {room.pile?.length > 0 && <span style={{ color: AMBER, fontWeight: 800 }}>Pot: {room.pile.length} cards</span>}
              </div>

              {/* Round result banner */}
              <div style={{ background: isMyTurn ? GREEN_DK : "#fff", color: isMyTurn ? "#fff" : INK, padding: 14, borderRadius: 14, textAlign: "center", marginBottom: 16, fontWeight: 800, border: isMyTurn ? "none" : "2px solid #DCEEDA" }}>
                {roundSummary ? (
                  <>
                    <div>{roundSummary.title}</div>
                    <div style={{ fontSize: 14, marginTop: 4, fontWeight: 700, opacity: 0.95 }}>{roundSummary.body}</div>
                  </>
                ) : isMyTurn ? (
                  "✨ Your Turn — Choose a Stat!"
                ) : (
                  `Waiting for ${room.players.find(p => p.id === room.pickerId)?.name || "player"}...`
                )}
              </div>

              {/* Primary Card View */}
              {activeCard ? (
                <FundCard 
                  card={activeCard} 
                  interactive={isMyTurn && room.status === "playing"} 
                  onPick={chooseCategory} 
                  highlightKey={room.round?.category}
                />
              ) : (
                <div style={{ background: "#fff", borderRadius: 22, padding: 40, textAlign: "center", color: "#6B7C6B", fontWeight: 700 }}>
                  {myHand.length === 0 ? "You're out of cards!" : "Loading active card..."}
                </div>
              )}

              {/* Action Logs */}
              <div style={{ marginTop: 20, background: "#fff", borderRadius: 16, padding: 16, border: "1px solid #E3F0E1" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#6B7C6B", textTransform: "uppercase", marginBottom: 8 }}>Game Log</div>
                <div style={{ maxHeight: 100, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                  {[...(room.log || [])].reverse().slice(0, 5).map((l, i) => (
                    <div key={i} style={{ fontSize: 13, color: INK }}>• {l.text}</div>
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
