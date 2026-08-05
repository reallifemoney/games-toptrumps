import React, { useState, useEffect, useRef } from "react";
import { ref, set, get, onValue, off } from "firebase/database";
import { db } from "./firebase";
import { 
  TrendingUp, TrendingDown, Layers, Leaf, Coins, Globe2, Crown, 
  Users, Copy, Check, RefreshCw, Trophy, Sparkles, HelpCircle, 
  Grid, LogOut, X, Search 
} from "lucide-react";

// Set your logo path here (assuming image is saved in src/public folder)
import logoImg from "./logo.png"; // Replace or update path if needed

// ---------- Fund card data ----------
const CARDS = [
  { id: "mng-japan", name: "M&G Japan Fund Acc", manager: "M&G", color: "#0d8f6e", desc: "Invests in companies that are based in or do most of their business in Japan", risk: 6,
    stats: { growth2025: 22.17, holdings: 60, esg: 4, cost: 0.47, countries: 1, growth2022: 6.25 } },
  { id: "axa-tech", name: "AXA Framlington Global Tech Fund Acc", manager: "AXA", color: "#00147a", desc: "Invests in equities believed to benefit from increase in use of technology", risk: 6,
    stats: { growth2025: 13.03, holdings: 48, esg: 3.5, cost: 0.82, countries: 6, growth2022: -29.70 } },
  { id: "bg-em", name: "Baillie Gifford Emerging Markets Leading Acc", manager: "BG", color: "#1a1a1a", desc: "Holds companies from emerging countries believed to perform well in the future", risk: 7,
    stats: { growth2025: 26.07, holdings: 52, esg: 3, cost: 0.78, countries: 9, growth2022: -16.43 } },
  { id: "aegon-hy", name: "Aegon High Yield Bond Fund Acc", manager: "aegon", color: "#0057ff", desc: "Corporate bonds from across the world that give high interest (so higher risk)", risk: 4,
    stats: { growth2025: 10.72, holdings: 163, esg: 3, cost: 0.58, countries: 12, growth2022: -9.27 } },
  { id: "ark-ai", name: "ARK AI and Robotics ETF Acc", manager: "ARK", color: "#111111", desc: "Invests in companies that should benefit from increased use of AI & robotics", risk: 7,
    stats: { growth2025: 28.96, holdings: 43, esg: 3, cost: 0.75, countries: 6, growth2022: null } },
  { id: "hsbc-ftse", name: "HSBC FTSE 100 UK Index Fund Acc", manager: "HSBC", color: "#db0011", desc: "Invests in most companies in the FTSE 100 index (100 biggest companies in UK)", risk: 5,
    stats: { growth2025: 25.49, holdings: 100, esg: 3, cost: 0.10, countries: 1, growth2022: 5.08 } },
  { id: "artemis-eu", name: "Artemis SmartGARP European Equity Acc", manager: "Artemis", color: "#0b1f4d", desc: "Uses tech to pick strong European equities and adjusts plan to maximise growth", risk: 6,
    stats: { growth2025: 55.90, holdings: 88, esg: 3, cost: 0.84, countries: 8, growth2022: 2.00 } },
  { id: "br-mymap", name: "BlackRock MyMap 5 Select ESG Fund Acc", manager: "BlackRock", color: "#000000", desc: "Holds around 65% equity, 35% bonds and excludes any not meeting ESG criteria", risk: 5,
    stats: { growth2025: 11.40, holdings: 5500, esg: 4, cost: 0.17, countries: 42, growth2022: -13.30 } },
  { id: "rl-mmkt", name: "Royal London Short-Term Money Market Acc", manager: "Royal London", color: "#3d0e4f", desc: "Gains interest from cash deposits and very low risk Government bonds", risk: 1,
    stats: { growth2025: 4.76, holdings: 66, esg: 4, cost: 0.10, countries: 8, growth2022: 1.69 } },
  { id: "xtr-gold", name: "Xtrackers Physical Gold ETC", manager: "DWS", color: "#555555", desc: "Holds gold bars so you don't have to", risk: 7,
    stats: { growth2025: 76.71, holdings: 1, esg: 3, cost: 0.25, countries: 1, growth2022: 6.89 } },
  { id: "van-ls100", name: "Vanguard LifeStrategy 100% Equity Fund Acc", manager: "Vanguard", color: "#800000", desc: "Ready-made portfolio only containing equities", risk: 5,
    stats: { growth2025: 16.04, holdings: 8660, esg: 3.5, cost: 0.20, countries: 50, growth2022: -6.25 } },
  { id: "van-ls20", name: "Vanguard LifeStrategy 20% Equity Fund Acc", manager: "Vanguard", color: "#800000", desc: "Ready-made portfolio with around 80% in bonds", risk: 4,
    stats: { growth2025: 7.20, holdings: 22000, esg: 3.5, cost: 0.20, countries: 50, growth2022: -15.84 } },
  { id: "ishares-ffs", name: "iShares Developed World Fossil Fuel Screened Acc", manager: "iShares", color: "#6cb33f", desc: "Fund of equities that comply with certain ESG rules", risk: 5,
    stats: { growth2025: 13.10, holdings: 1191, esg: 4, cost: 0.12, countries: 23, growth2022: -11.60 } },
  { id: "abrdn-gcb", name: "abrdn Global Corp Bond Screened Tracker Acc", manager: "abrdn", color: "#000000", desc: "Fund of corporate bonds provided company meets ESG rules", risk: 4,
    stats: { growth2025: 6.77, holdings: 9035, esg: 4, cost: 0.10, countries: 27, growth2022: -15.14 } },
  { id: "aviva-mm", name: "Aviva Multi-Manager 40-85% Shares Inc", manager: "Aviva", color: "#ffd200", desc: "Manager decides how much equity to hold based on markets, between 40 and 85%", risk: 5,
    stats: { growth2025: 12.31, holdings: 3750, esg: 3, cost: 1.27, countries: 42, growth2022: -9.37 } },
  { id: "aegon-eth", name: "Aegon Ethical Equity Fund Acc", manager: "aegon", color: "#0057ff", desc: "Fund of equities that meet certain ESG criteria", risk: 6,
    stats: { growth2025: 2.43, holdings: 64, esg: 4.5, cost: 0.77, countries: 5, growth2022: -22.41 } },
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

const MINT = "#EAF6EA", GREEN = "#5FAE3A", GREEN_DK = "#3F7E27", PURPLE = "#6E4EE8", INK = "#1F2A1F", AMBER = "#C1791C";

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
    <div style={{ display: "flex", gap: 4, margin: "8px 0 14px" }}>
      {[1, 2, 3, 4, 5, 6, 7].map(n => (
        <div key={n} style={{
          width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700,
          background: n === risk ? PURPLE : "#EDEAF9",
          color: n === risk ? "#fff" : "#B7ADE8",
        }}>{n}</div>
      ))}
    </div>
  );
}

function FundCard({ card, interactive, onPick, highlightKey, dim }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "18px 18px 10px", width: "100%", maxWidth: 340, boxSizing: "border-box",
      boxShadow: "0 6px 18px rgba(30,50,20,0.10)", opacity: dim ? 0.55 : 1, border: "2px solid #E3F0E1", margin: "0 auto",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, background: card.color, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0,
        }}>{card.manager.slice(0, 2).toUpperCase()}</div>
        <div style={{ fontWeight: 800, fontSize: 15, color: INK, lineHeight: 1.15 }}>{card.name}</div>
      </div>
      <div style={{ color: PURPLE, fontSize: 12.5, fontStyle: "italic", marginBottom: 8 }}>{card.desc}</div>
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
                padding: "9px 6px", borderBottom: "1px solid #EFF5EC", cursor: clickable ? "pointer" : "default",
                background: isHighlight ? "#EAF6EA" : "transparent", borderRadius: 8,
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
      background: MINT, borderRadius: 20, border: "2px dashed #C7E2C4", width: "100%", maxWidth: 340, margin: "0 auto",
      minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
    }}>
      <img src={logoImg} alt="Top Funds Logo" style={{ maxHeight: 60, maxWidth: "80%", objectFit: "contain" }} />
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
          justify: "space-between", alignItems: "center", background: MINT,
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
        <p style={{ marginTop: 0 }}><b>Goal:</b> Win all the fund cards in the deck!</p>
        
        <div style={{ background: MINT, padding: 12, borderRadius: 12, marginBottom: 12 }}>
          <b>1. Pick a Stat:</b> On your turn, look at your top card and choose the stat you think is best (e.g., highest Growth or lowest Cost).
        </div>

        <div style={{ background: MINT, padding: 12, borderRadius: 12, marginBottom: 12 }}>
          <b>2. Compare Cards:</b> All players reveal their top card for that category:
          <ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>
            <li><b>Higher Wins:</b> Growth, Holdings, ESG Rating, Countries</li>
            <li><b>Lower Wins:</b> Cost</li>
          </ul>
        </div>

        <div style={{ background: MINT, padding: 12, borderRadius: 12, marginBottom: 12 }}>
          <b>3. Win or Tie:</b>
          <ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>
            <li>The winner takes all played cards and goes next.</li>
            <li>In a <b>Tie</b>, cards go into the pot. The next round's winner gets the pot too!</li>
          </ul>
        </div>

        <p style={{ marginBottom: 0, textAlign: "center", color: PURPLE, fontWeight: 700 }}>
          The last player remaining with cards wins the game!
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
            borderRadius: 10, border: "1.5px solid #DCEEDA", fontSize: 14,
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

  // subscribe to live updates for the current room
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
      // Remove self from room players list if quitting active session
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

  // ================= RENDER =================
  const wrap = { minHeight: "100vh", background: MINT, fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif", padding: "16px 14px 60px" };

  return (
    <div style={wrap}>
      {/* Persistent Nav Actions across screens */}
      <div style={{ maxWidth: 460, margin: "0 auto 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {screen !== "home" ? (
          <button onClick={exitGame} style={{
            display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #C7E2C4", background: "#fff",
            padding: "6px 12px", borderRadius: 10, color: INK, fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
            <LogOut size={15} /> Exit
          </button>
        ) : <div />}

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowBrowser(true)} style={{
            display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #C7E2C4", background: "#fff",
            padding: "6px 12px", borderRadius: 10, color: PURPLE, fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
            <Grid size={15} /> Browse Cards
          </button>
          <button onClick={() => setShowRules(true)} style={{
            display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #C7E2C4", background: "#fff",
            padding: "6px 12px", borderRadius: 10, color: GREEN_DK, fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
            <HelpCircle size={15} /> Rules
          </button>
        </div>
      </div>

      {/* Popups */}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showBrowser && <CardsBrowserModal onClose={() => setShowBrowser(false)} />}

      {/* Screen 1: Home */}
      {screen === "home" && (
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <img src={logoImg} alt="Top Funds Logo" style={{ maxHeight: 110, maxWidth: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 6px 18px rgba(30,50,20,0.08)", marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: INK }}>Your name</label>
            <input value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="e.g. Leo"
              style={{ width: "100%", boxSizing: "border-box", marginTop: 6, marginBottom: 16, padding: "10px 12px", borderRadius: 10, border: "1.5px solid #DCEEDA", fontSize: 15 }} />

            <button onClick={hostGame} disabled={busy} style={{
              width: "100%", padding: "12px", borderRadius: 12, border: "none", background: GREEN, color: "#fff",
              fontWeight: 800, fontSize: 15, cursor: "pointer", marginBottom: 14,
            }}>Host a new game</button>

            <div style={{ textAlign: "center", color: "#9AA89A", fontSize: 12, margin: "6px 0 12px" }}>— or join one —</div>
            <input value={joinCodeInput} onChange={e => setJoinCodeInput(e.target.value.toUpperCase())} placeholder="Room code" maxLength={4}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #DCEEDA", fontSize: 15, letterSpacing: 4, textAlign: "center", marginBottom: 10, textTransform: "uppercase" }} />
            <button onClick={joinGame} disabled={busy} style={{
              width: "100%", padding: "12px", borderRadius: 12, border: `2px solid ${PURPLE}`, background: "#fff", color: PURPLE,
              fontWeight: 800, fontSize: 15, cursor: "pointer",
            }}>Join a game</button>
            {error && <div style={{ color: "#C0392B", fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</div>}
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: 16, fontSize: 13, color: "#5A6B5A" }}>
            <b>How it works:</b> one person hosts and shares the 4-letter code. Everyone joins on their own phone or laptop. On your turn, pick a stat from your top card — whoever's fund wins that stat takes all the cards. Most cards when the deck runs out wins!
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
                <img src={logoImg} alt="Top Funds Logo" style={{ maxHeight: 75, maxWidth: "100%", objectFit: "contain", marginBottom: 12 }} />
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
                    cursor: room.players.length < 2 ? "default" : "pointer",
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
                  fontWeight: 800, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
                }}><RefreshCw size={16} /> Reshuffle & play again</button>
              )}
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <img src={logoImg} alt="Top Funds Logo" style={{ maxHeight: 50, maxWidth: "100%", objectFit: "contain" }} />
                <div style={{ fontSize: 12, color: "#9AA89A", marginTop: 4 }}>Room {roomCode} {(room.pile || []).length > 0 && `· pot: ${(room.pile || []).length}`}</div>
              </div>

              {/* scoreboard */}
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
                        borderRadius: 8, background: won ? "#EAF6EA" : "transparent", marginBottom: 4,
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
