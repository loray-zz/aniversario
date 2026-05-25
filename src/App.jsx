import { useState, useEffect, useRef } from "react";

/* ── DESIGN TOKENS ───────────────────────────────────────────── */
const G = {
  bg:        "#09080a",
  surface:   "#0e0c09",
  card:      "#141008",
  border:    "#2c1f0e",
  borderMid: "#1c1508",
  gold:      "#c9922a",
  goldBright:"#e8b84b",
  text:      "#f0e8d8",
  muted:     "#7a6040",
  faint:     "#3a2c18",
  dark:      "#09080a",
};

/* ── GLOBAL CSS ──────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Barlow:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { font-family: 'Barlow', sans-serif; background: ${G.bg}; color: ${G.text}; overflow-x: hidden; }

  @keyframes rise {
    0%   { transform: translateY(0px) scale(1);     opacity: 0; }
    6%   { opacity: 1; }
    93%  { opacity: 0.4; }
    100% { transform: translateY(-108vh) scale(0.3); opacity: 0; }
  }
  @keyframes sway {
    0%, 100% { margin-left: 0px; }
    30%       { margin-left: 22px; }
    70%       { margin-left: -16px; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.35; transform: scale(0.7); }
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes celebrate {
    0%,100% { transform: scale(1) rotate(0deg); }
    25%      { transform: scale(1.1) rotate(-3deg); }
    75%      { transform: scale(1.1) rotate(3deg); }
  }

  .ember { position: fixed; border-radius: 50%; pointer-events: none;
    animation: rise linear infinite, sway ease-in-out infinite; }

  .fu  { animation: fadeUp 0.65s       ease both; }
  .fu1 { animation: fadeUp 0.65s 0.12s ease both; }
  .fu2 { animation: fadeUp 0.65s 0.24s ease both; }
  .fu3 { animation: fadeUp 0.65s 0.38s ease both; }
  .fu4 { animation: fadeUp 0.65s 0.52s ease both; }
  .fu5 { animation: fadeUp 0.65s 0.66s ease both; }

  .btn-fire {
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    background: linear-gradient(135deg, #9a6810, ${G.gold}, ${G.goldBright}, ${G.gold}, #9a6810);
    background-size: 200% auto; color: ${G.dark}; border: none;
    font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 600;
    letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer;
    transition: transform 0.25s, box-shadow 0.25s;
    animation: shimmer 3s linear infinite; padding: 17px 36px;
  }
  .btn-fire:hover { transform: translateY(-3px); box-shadow: 0 14px 44px rgba(201,146,42,0.45); }

  .btn-ghost {
    background: transparent; color: ${G.muted}; border: 1px solid ${G.border};
    font-family: 'Barlow', sans-serif; font-size: 13px; cursor: pointer;
    transition: color 0.2s, border-color 0.2s; padding: 9px 20px;
  }
  .btn-ghost:hover { color: ${G.text}; border-color: ${G.muted}; }

  .chat-input {
    flex: 1; background: ${G.card}; border: 1px solid ${G.border}; border-right: none;
    color: ${G.text}; font-family: 'Barlow', sans-serif; font-size: 15px;
    padding: 14px 16px; outline: none; transition: border-color 0.2s;
  }
  .chat-input:focus  { border-color: ${G.gold}; }
  .chat-input::placeholder { color: ${G.faint}; }

  .send-btn {
    width: 50px; background: ${G.gold}; border: none; color: ${G.dark};
    cursor: pointer; transition: background 0.2s; font-size: 18px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .send-btn:hover    { background: ${G.goldBright}; }
  .send-btn:disabled { background: ${G.border}; color: ${G.faint}; cursor: not-allowed; }

  .dot { width: 7px; height: 7px; background: ${G.gold}; border-radius: 50%;
    animation: blink 1.1s infinite; }
  .dot:nth-child(2) { animation-delay: 0.22s; }
  .dot:nth-child(3) { animation-delay: 0.44s; }

  .msg { animation: msgIn 0.28s ease both; }
  .row-hover:hover { background: rgba(201,146,42,0.04); }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 2px; }
`;

/* ── SHARED COMPONENTS ───────────────────────────────────────── */
function Embers({ n = 20 }) {
  const list = Array.from({ length: n }, (_, i) => ({
    left:  (i * 4.9 + 2.3) % 100,
    size:  1.5 + (i * 0.37) % 3.5,
    dur:   5   + (i * 0.41) % 6,
    sway:  3   + (i * 0.31) % 4,
    delay: (i * 0.53) % 8,
    color: ["#ff6a00","#e8b84b","#ff8c00","#ffd060","#ff4500"][i % 5],
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {list.map((e, i) => (
        <div key={i} className="ember" style={{
          bottom: 0, left: `${e.left}%`,
          width: e.size, height: e.size,
          background: e.color,
          boxShadow: `0 0 ${e.size * 3}px ${e.color}`,
          animationDuration: `${e.dur}s, ${e.sway}s`,
          animationDelay:    `${e.delay}s, ${e.delay * 0.6}s`,
        }} />
      ))}
    </div>
  );
}

function Avatar({ size = 36 }) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      background: `linear-gradient(135deg, #9a6810, ${G.goldBright})`,
      borderRadius: "50%", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: size * 0.45,
    }}>🔥</div>
  );
}

function RichText({ t }) {
  return (
    <>
      {t.split("\n").map((line, i, arr) => (
        <span key={i}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
            p.startsWith("**") && p.endsWith("**")
              ? <strong key={j} style={{ color: G.goldBright }}>{p.slice(2, -2)}</strong>
              : p
          )}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

/* ── LANDING ─────────────────────────────────────────────────── */
function Landing({ onStart, onLogoClick }) {
  const cols = [
    { icon: "📅", label: "QUANDO", lines: ["Sáb · 17 Out", "2026"] },
    { icon: "⏰", label: "HORA",   lines: ["13:00h", "Até a última rodada"] },
    { icon: "🥩", label: "EVENTO", lines: ["Churrasco", "Completo & Resenha"] },
  ];
  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <Embers n={24} />
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 45% at 50% 92%, rgba(200,100,8,0.13) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460, padding: "50px 24px 68px", textAlign: "center" }}>

        {/* Logo 50 — click 5× for admin */}
        <div className="fu" onClick={onLogoClick} style={{ cursor: "default", userSelect: "none" }}>
          <div style={{
            fontFamily: "Playfair Display", fontWeight: 900,
            fontSize: "clamp(96px, 28vw, 148px)", lineHeight: 1,
            color: "transparent", WebkitTextStroke: `2px ${G.gold}`,
            textShadow: `0 0 70px rgba(201,146,42,0.28), 0 0 130px rgba(201,146,42,0.10)`,
            letterSpacing: "-4px",
          }}>50</div>
          <div style={{ fontFamily: "Playfair Display", fontWeight: 700, fontSize: "clamp(22px, 7vw, 38px)", letterSpacing: "0.38em", color: G.gold, marginTop: -10 }}>
            ANOS
          </div>
        </div>

        {/* Divider */}
        <div className="fu1" style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0 24px" }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${G.gold})` }} />
          <span style={{ fontSize: 20 }}>🔥</span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${G.gold})` }} />
        </div>

        {/* Subtitle */}
        <div className="fu1" style={{ marginBottom: 30 }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.45em", color: G.gold, textTransform: "uppercase", marginBottom: 10 }}>
            Meio Século de História
          </div>
          <p style={{ fontFamily: "Playfair Display", fontStyle: "italic", fontSize: 15, color: G.muted, lineHeight: 1.75 }}>
            Fernando convida você para celebrar a marca histórica do cinquentão. Uma tarde de carne na brasa, boa prosa e amizades de sempre.
          </p>
        </div>

        {/* Info grid */}
        <div className="fu2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: G.border, border: `1px solid ${G.border}`, marginBottom: 10 }}>
          {cols.map((c, i) => (
            <div key={i} style={{ background: G.surface, padding: "18px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 7 }}>{c.icon}</div>
              <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.22em", color: G.gold, marginBottom: 7, textTransform: "uppercase" }}>{c.label}</div>
              {c.lines.map((l, j) => (
                <div key={j} style={{ fontSize: 11, color: j === 0 ? G.text : G.muted, lineHeight: 1.55 }}>{l}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="fu3" style={{ background: G.surface, border: `1px solid ${G.border}`, padding: "16px 20px", marginBottom: 38, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>📍</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.25em", color: G.gold, textTransform: "uppercase", marginBottom: 3 }}>Onde</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 1 }}>Condomínio Living Wellness</div>
            <div style={{ fontSize: 12, color: G.muted }}>Espaço Gourmet · Aclimação, São Paulo</div>
          </div>
        </div>

        {/* CTA */}
        <div className="fu4">
          <button className="btn-fire" onClick={onStart} style={{ width: "100%" }}>
            🔥 Confirmar Presença
          </button>
          <div style={{ marginTop: 14, fontSize: 12, color: G.faint }}>Confirme até 10 de outubro</div>
        </div>
      </div>
    </div>
  );
}

/* ── CHAT ────────────────────────────────────────────────────── */
function Chat({ messages, input, setInput, onSend, isTyping, endRef }) {
  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } };
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: G.bg, maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <Embers n={12} />

      {/* Header */}
      <div style={{ position: "relative", zIndex: 2, background: G.surface, borderBottom: `1px solid ${G.border}`, padding: "13px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar size={40} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Brasa</div>
          <div style={{ fontSize: 11, color: G.gold }}>Assistente do Fernando · 50 Anos 🎂</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 14px", position: "relative", zIndex: 1 }}>
        {messages.map((m, i) => (
          <div key={i} className="msg" style={{ marginBottom: 14, display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 8, alignItems: "flex-end" }}>
            {m.role === "assistant" && <Avatar size={30} />}
            <div style={{
              maxWidth: "76%", padding: "11px 15px", fontSize: 14, lineHeight: 1.65,
              background: m.role === "user" ? `linear-gradient(135deg, #8a5c10, ${G.gold})` : G.card,
              border: m.role === "user" ? "none" : `1px solid ${G.border}`,
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
              color: m.role === "user" ? "#f8ead0" : G.text,
            }}>
              {m.role === "assistant" ? <RichText t={m.content} /> : m.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "flex-end" }}>
            <Avatar size={30} />
            <div style={{ padding: "13px 16px", background: G.card, border: `1px solid ${G.border}`, borderRadius: "4px 16px 16px 16px", display: "flex", gap: 5, alignItems: "center" }}>
              <div className="dot" /><div className="dot" /><div className="dot" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ position: "relative", zIndex: 2, background: G.surface, borderTop: `1px solid ${G.border}`, padding: 14 }}>
        <div style={{ display: "flex" }}>
          <input className="chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Digite sua resposta..." disabled={isTyping} />
          <button className="send-btn" onClick={onSend} disabled={isTyping || !input.trim()}>➤</button>
        </div>
      </div>
    </div>
  );
}

/* ── SUCCESS ─────────────────────────────────────────────────── */
function Success({ onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, position: "relative", overflow: "hidden" }}>
      <Embers n={38} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 380, textAlign: "center" }}>
        <div className="fu"  style={{ fontSize: 64, marginBottom: 20, display: "inline-block", animation: "celebrate 1s ease infinite" }}>🎉</div>
        <div className="fu1" style={{ fontFamily: "Playfair Display", fontSize: 30, fontWeight: 700, marginBottom: 12 }}>Presença Confirmada!</div>
        <div className="fu2" style={{ fontSize: 15, color: G.muted, lineHeight: 1.75, marginBottom: 28 }}>
          Sua confirmação foi registrada. Fernando está ansioso para comemorar esse marco histórico com você! 🥩🔥
        </div>
        <div className="fu3" style={{ background: G.surface, border: `1px solid ${G.border}`, padding: "16px 22px", marginBottom: 30, fontSize: 13, color: G.muted, lineHeight: 2 }}>
          📅 Sábado, 17 de outubro de 2026 · 13:00h<br />
          📍 Condomínio Living Wellness · Aclimação, SP
        </div>
        <div className="fu4">
          <button className="btn-ghost" onClick={onBack} style={{ width: "100%", padding: "12px" }}>← Voltar ao início</button>
        </div>
      </div>
    </div>
  );
}

/* ── ADMIN LOGIN ─────────────────────────────────────────────── */
function AdminLogin({ value, onChange, onLogin, loading, error, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ width: "100%", maxWidth: 300, textAlign: "center" }}>
        <div style={{ fontFamily: "Playfair Display", fontSize: 24, marginBottom: 6 }}>Área Restrita</div>
        <div style={{ fontSize: 13, color: G.muted, marginBottom: 28 }}>Acesso exclusivo para o aniversariante 🔥</div>
        <input
          type="password"
          placeholder="Senha"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && onLogin()}
          style={{
            width: "100%", background: G.card,
            border: `1px solid ${error ? "#c93030" : G.border}`,
            color: G.text, fontFamily: "Barlow", fontSize: 15,
            padding: "13px 16px", outline: "none", marginBottom: 8,
            transition: "border-color 0.2s",
          }}
        />
        {error && <div style={{ fontSize: 12, color: "#e05030", marginBottom: 10 }}>Senha incorreta. Tente novamente.</div>}
        <button className="btn-fire" onClick={onLogin} disabled={loading} style={{ width: "100%", marginBottom: 10, opacity: loading ? 0.6 : 1 }}>
          {loading ? "Verificando..." : "Entrar"}
        </button>
        <button className="btn-ghost" onClick={onBack} style={{ width: "100%" }}>← Voltar</button>
      </div>
    </div>
  );
}

/* ── ADMIN DASHBOARD ─────────────────────────────────────────── */
function Admin({ rsvps, totalGuests, adminPwd, onBack, onRefresh, loading, setRsvps, setTotalGuests }) {
  const [editingId,   setEditingId]   = useState(null);
  const [editForm,    setEditForm]    = useState({});
  const [confirmClear, setConfirmClear] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const daysLeft = Math.max(0, Math.ceil((new Date("2026-10-17") - new Date()) / 86400000));
  const stats = [
    { icon: "✅", label: "Confirmações",    val: rsvps.length },
    { icon: "👥", label: "Total de pessoas", val: totalGuests },
    { icon: "📅", label: "Dias restantes",  val: daysLeft },
  ];

  // ── EXPORT EXCEL ────────────────────────────────────────────
  function exportExcel() {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.onload = () => {
      const XLSX = window.XLSX;

      const header = [["Nome Completo", "Nº de Pessoas", "WhatsApp", "Restrição Alimentar", "Mensagem", "Data de Confirmação"]];
      const rows = rsvps.map(r => [
        r.name,
        r.guests,
        r.whatsapp,
        r.dietary || "Nenhuma",
        r.message || "",
        new Date(r.timestamp).toLocaleString("pt-BR"),
      ]);

      const totaisRow = [
        "TOTAL",
        totalGuests,
        "", "", "", "",
      ];

      const data = [...header, ...rows, [], totaisRow];
      const ws   = XLSX.utils.aoa_to_sheet(data);

      // Column widths
      ws["!cols"] = [
        { wch: 28 }, // Nome
        { wch: 14 }, // Pessoas
        { wch: 18 }, // WhatsApp
        { wch: 22 }, // Restrição
        { wch: 30 }, // Mensagem
        { wch: 20 }, // Data
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Confirmados");
      XLSX.writeFile(wb, `confirmados-fernando-50.xlsx`);
    };
    document.head.appendChild(script);
  }

  // ── EXPORT PDF ──────────────────────────────────────────────
  function exportPDF() {
    const win = window.open("", "_blank");
    const rows = rsvps.map((r, i) => `
      <tr style="background:${i % 2 === 0 ? "#1a1408" : "#0e0c09"}">
        <td>${r.name}</td>
        <td style="text-align:center">${r.guests}</td>
        <td>${r.whatsapp}</td>
        <td>${r.dietary || "Nenhuma"}</td>
        <td>${r.message || "—"}</td>
        <td>${new Date(r.timestamp).toLocaleString("pt-BR", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" })}</td>
      </tr>`).join("");

    win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>Confirmados — Fernando 50 Anos</title>
<style>
  body { font-family: Arial, sans-serif; background: #09080a; color: #f0e8d8; margin: 0; padding: 32px; }
  h1   { color: #c9922a; font-size: 24px; margin-bottom: 4px; }
  p    { color: #7a6040; font-size: 13px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th   { background: #c9922a; color: #09080a; padding: 10px 12px; text-align: left; font-weight: bold; }
  td   { padding: 9px 12px; border-bottom: 1px solid #2c1f0e; }
  .stats { display: flex; gap: 24px; margin-bottom: 28px; }
  .stat  { background: #1a1408; border: 1px solid #2c1f0e; padding: 16px 24px; text-align: center; }
  .stat-num { font-size: 28px; color: #c9922a; font-weight: bold; }
  .stat-lbl { font-size: 11px; color: #7a6040; margin-top: 4px; }
  @media print { body { background: white; color: black; } th { background: #333; color: white; } td { border-color: #ccc; } .stat { background: #f5f5f5; border-color: #ccc; } .stat-num { color: #c9922a; } }
</style>
</head><body>
<h1>🔥 Fernando — 50 Anos</h1>
<p>Lista de confirmados gerada em ${new Date().toLocaleString("pt-BR")} · Evento: Sáb 17/10/2026 às 13h · Condomínio Living Wellness, Aclimação-SP</p>
<div class="stats">
  <div class="stat"><div class="stat-num">${rsvps.length}</div><div class="stat-lbl">Confirmações</div></div>
  <div class="stat"><div class="stat-num">${totalGuests}</div><div class="stat-lbl">Total de pessoas</div></div>
  <div class="stat"><div class="stat-num">${daysLeft}</div><div class="stat-lbl">Dias restantes</div></div>
</div>
<table>
  <thead><tr><th>Nome</th><th>Pessoas</th><th>WhatsApp</th><th>Restrição</th><th>Mensagem</th><th>Confirmado em</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
</body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  }

  async function deleteOne(id) {
    if (!window.confirm("Remover este convidado?")) return;
    setActionLoading(true);
    await fetch("/api/admin-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: adminPwd, id }),
    });
    onRefresh();
    setActionLoading(false);
  }

  async function clearAll() {
    setActionLoading(true);
    await fetch("/api/admin-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: adminPwd, deleteAll: true }),
    });
    setConfirmClear(false);
    onRefresh();
    setActionLoading(false);
  }

  function startEdit(r) {
    setEditingId(r.id);
    setEditForm({ name: r.name, guests: r.guests, whatsapp: r.whatsapp, dietary: r.dietary || "", message: r.message || "" });
  }

  async function saveEdit(id) {
    setActionLoading(true);
    await fetch("/api/admin-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: adminPwd, id, ...editForm }),
    });
    setEditingId(null);
    onRefresh();
    setActionLoading(false);
  }

  const inputStyle = {
    background: G.card, border: `1px solid ${G.border}`, color: G.text,
    fontFamily: "Barlow", fontSize: 13, padding: "6px 10px", outline: "none",
    width: "100%", marginBottom: 6,
  };

  return (
    <div style={{ minHeight: "100vh", background: G.bg, padding: "24px 16px 48px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "Playfair Display", fontSize: 22 }}>Dashboard 🔥</div>
            <div style={{ fontSize: 12, color: G.muted }}>Confirmações em tempo real</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {rsvps.length > 0 && <>
              <button className="btn-ghost" onClick={exportExcel} style={{ padding: "8px 14px", fontSize: 12 }}>⬇ Excel</button>
              <button className="btn-ghost" onClick={exportPDF} style={{ padding: "8px 14px", fontSize: 12 }}>⬇ PDF</button>
            </>}
            <button className="btn-ghost" onClick={onRefresh} style={{ padding: "8px 14px", fontSize: 12 }}>
              {loading ? "..." : "↻ Atualizar"}
            </button>
            <button className="btn-ghost" onClick={onBack} style={{ padding: "8px 14px", fontSize: 12 }}>← Sair</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: G.surface, border: `1px solid ${G.border}`, padding: "18px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: "Playfair Display", fontSize: 34, fontWeight: 700, color: G.gold }}>{s.val}</div>
              <div style={{ fontSize: 10, color: G.muted, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* List */}
        <div style={{ background: G.surface, border: `1px solid ${G.border}` }}>
          <div style={{ padding: "12px 18px", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.22em", color: G.gold, textTransform: "uppercase" }}>
              Lista de Confirmados
            </div>
            {rsvps.length > 0 && (
              confirmClear
                ? <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: G.muted }}>Tem certeza?</span>
                    <button onClick={clearAll} disabled={actionLoading} style={{ fontSize: 11, padding: "4px 10px", background: "#c93030", color: "#fff", border: "none", cursor: "pointer" }}>
                      Sim, limpar
                    </button>
                    <button onClick={() => setConfirmClear(false)} className="btn-ghost" style={{ fontSize: 11, padding: "4px 10px" }}>
                      Cancelar
                    </button>
                  </div>
                : <button onClick={() => setConfirmClear(true)} className="btn-ghost" style={{ fontSize: 11, padding: "4px 12px", color: "#c93030", borderColor: "#c93030" }}>
                    🗑 Limpar lista
                  </button>
            )}
          </div>

          {rsvps.length === 0
            ? <div style={{ padding: 52, textAlign: "center", fontSize: 14, color: G.faint }}>Nenhuma confirmação ainda 🥩</div>
            : rsvps.map((r, i) => (
              <div key={r.id || i} style={{ padding: "14px 18px", borderBottom: i < rsvps.length - 1 ? `1px solid ${G.borderMid}` : "none" }}>

                {editingId === r.id ? (
                  /* ── EDIT MODE ── */
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 6, marginBottom: 6 }}>
                      <input style={inputStyle} value={editForm.name} onChange={e => setEditForm(f => ({...f, name: e.target.value}))} placeholder="Nome completo" />
                      <input style={inputStyle} type="number" value={editForm.guests} onChange={e => setEditForm(f => ({...f, guests: e.target.value}))} placeholder="Pessoas" />
                    </div>
                    <input style={inputStyle} value={editForm.whatsapp} onChange={e => setEditForm(f => ({...f, whatsapp: e.target.value}))} placeholder="WhatsApp" />
                    <input style={inputStyle} value={editForm.dietary} onChange={e => setEditForm(f => ({...f, dietary: e.target.value}))} placeholder="Restrição alimentar" />
                    <input style={inputStyle} value={editForm.message} onChange={e => setEditForm(f => ({...f, message: e.target.value}))} placeholder="Mensagem (opcional)" />
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <button className="btn-fire" onClick={() => saveEdit(r.id)} disabled={actionLoading} style={{ padding: "8px 20px", fontSize: 12 }}>
                        💾 Salvar
                      </button>
                      <button className="btn-ghost" onClick={() => setEditingId(null)} style={{ padding: "8px 16px", fontSize: 12 }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── VIEW MODE ── */
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{r.name}</div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0, marginLeft: 8 }}>
                        <span style={{ fontSize: 11, background: G.borderMid, border: `1px solid ${G.border}`, padding: "2px 9px", color: G.gold }}>
                          {r.guests} {r.guests === 1 ? "pessoa" : "pessoas"}
                        </span>
                        <button onClick={() => startEdit(r)} style={{ fontSize: 11, padding: "2px 8px", background: "transparent", border: `1px solid ${G.border}`, color: G.muted, cursor: "pointer" }}>
                          ✏️
                        </button>
                        <button onClick={() => deleteOne(r.id)} disabled={actionLoading} style={{ fontSize: 11, padding: "2px 8px", background: "transparent", border: "1px solid #c93030", color: "#c93030", cursor: "pointer" }}>
                          🗑
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: G.muted, display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                      {r.whatsapp && <span>📱 {r.whatsapp}</span>}
                      {r.dietary && r.dietary !== "Nenhuma" && <span>🥗 {r.dietary}</span>}
                      {r.message && <span style={{ fontStyle: "italic", color: G.faint }}>💬 "{r.message}"</span>}
                    </div>
                    <div style={{ fontSize: 10, color: G.faint, marginTop: 5 }}>
                      {new Date(r.timestamp).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                )}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

/* ── ROOT APP ────────────────────────────────────────────────── */
export default function App() {
  const [view,        setView]        = useState("landing");
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [isTyping,    setIsTyping]    = useState(false);
  const [rsvps,       setRsvps]       = useState([]);
  const [totalGuests, setTotalGuests] = useState(0);
  const [adminInput,  setAdminInput]  = useState("");
  const [adminPwd,    setAdminPwd]    = useState("");
  const [adminError,  setAdminError]  = useState(false);
  const [adminLoading,setAdminLoading]= useState(false);
  const [clicks,      setClicks]      = useState(0);
  const endRef  = useRef(null);
  const convRef = useRef([]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  /* Load RSVPs from backend */
  async function loadRsvps(pwd) {
    const password = pwd !== undefined ? pwd : adminPwd;
    setAdminLoading(true);
    try {
      const res = await fetch(`/api/admin-rsvps?password=${encodeURIComponent(password)}`);
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      const list = data.rsvps || [];
      setRsvps(list);
      setTotalGuests(list.reduce((s, x) => s + (x.guests || 0), 0));
      return true;
    } catch (_) {
      return false;
    } finally {
      setAdminLoading(false);
    }
  }

  /* Save RSVP via backend */
  async function saveRsvp(d) {
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d),
    });
  }

  /* Start chat */
  function startChat() {
    convRef.current = [];
    setMessages([{
      role: "assistant",
      content: "Ei! 🔥 Bem-vindo à confirmação de presença do aniversário de 50 anos do Fernando!\n\nSou o **Brasa**, seu assistente aqui. Vou precisar de algumas infos rapidinhas pra garantir seu lugar no churrasco. 🥩\n\nPode começar me dizendo seu **nome completo**?",
    }]);
    setView("chat");
  }

  /* Send message via backend */
  async function sendMessage() {
    if (!input.trim() || isTyping) return;
    const userMsg = { role: "user", content: input.trim() };
    setInput("");
    const conv = [...convRef.current, userMsg];
    convRef.current = conv;
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conv }),
      });
      const data = await res.json();

      // Backend handles everything — just check the flag
      if (data.complete && data.rsvpData) {
        await saveRsvp(data.rsvpData);
        // Fire WhatsApp notifications (don't await — don't block UX)
        fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.rsvpData),
        }).catch(() => {});
        setIsTyping(false);
        setView("success");
        return;
      }

      const text = data.message || "";
      convRef.current = [...conv, { role: "assistant", content: text }];
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch (_) {
      setMessages(prev => [...prev, { role: "assistant", content: "Ops, tive um probleminha aqui. Pode tentar de novo? 😅" }]);
    }
    setIsTyping(false);
  }

  /* Admin: logo click easter egg */
  function handleLogoClick() {
    const n = clicks + 1;
    setClicks(n);
    if (n >= 5) { setClicks(0); setView("admin-login"); }
  }

  /* Admin: login */
  async function handleAdminLogin() {
    setAdminError(false);
    const ok = await loadRsvps(adminInput);
    if (ok) {
      setAdminPwd(adminInput);
      setAdminInput("");
      setView("admin");
    } else {
      setAdminError(true);
    }
  }

  return (
    <>
      <style>{CSS}</style>
      {view === "landing"     && <Landing     onStart={startChat} onLogoClick={handleLogoClick} />}
      {view === "chat"        && <Chat        messages={messages} input={input} setInput={setInput} onSend={sendMessage} isTyping={isTyping} endRef={endRef} />}
      {view === "success"     && <Success     onBack={() => setView("landing")} />}
      {view === "admin-login" && <AdminLogin  value={adminInput} onChange={setAdminInput} onLogin={handleAdminLogin} loading={adminLoading} error={adminError} onBack={() => setView("landing")} />}
      {view === "admin"       && <Admin       rsvps={rsvps} totalGuests={totalGuests} adminPwd={adminPwd} onBack={() => setView("landing")} onRefresh={() => loadRsvps()} loading={adminLoading} setRsvps={setRsvps} setTotalGuests={setTotalGuests} />}
    </>
  );
}
