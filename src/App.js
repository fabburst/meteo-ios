/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";

// ─────────────────────────────────────────────────────────────────────────────
// WEATHER ICONS SVG
// ─────────────────────────────────────────────────────────────────────────────
function SunIcon({ s = 52 }) {
  return <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="10" fill="#FFD426"/>
    {[0,45,90,135,180,225,270,315].map((d,i)=>{
      const r=d*Math.PI/180;
      return <line key={i} x1={26+14*Math.cos(r)} y1={26+14*Math.sin(r)} x2={26+20*Math.cos(r)} y2={26+20*Math.sin(r)} stroke="#FFD426" strokeWidth="2.5" strokeLinecap="round"/>;
    })}
  </svg>;
}
function MoonIcon({ s = 52 }) {
  return <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
    <path d="M27 8C17 8 10 16 10 25C10 36 18 44 29 44C37 44 43 40 46 33C41 36 34 36 28 30C22 24 22 15 27 8Z" fill="#E8EAFF"/>
    <circle cx="38" cy="15" r="1.5" fill="#E8EAFF" opacity="0.7"/>
    <circle cx="43" cy="24" r="1" fill="#E8EAFF" opacity="0.5"/>
  </svg>;
}
function PartlyCloudyIcon({ s = 52 }) {
  return <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
    <circle cx="20" cy="24" r="8" fill="#FFD426"/>
    {[225,270,315,0,45].map((d,i)=>{
      const r=d*Math.PI/180;
      return <line key={i} x1={20+11*Math.cos(r)} y1={24+11*Math.sin(r)} x2={20+16*Math.cos(r)} y2={24+16*Math.sin(r)} stroke="#FFD426" strokeWidth="2" strokeLinecap="round"/>;
    })}
    <rect x="17" y="29" width="24" height="12" rx="6" fill="white" opacity="0.92"/>
    <rect x="22" y="23" width="17" height="10" rx="5" fill="white" opacity="0.92"/>
  </svg>;
}
function CloudIcon({ s = 52 }) {
  return <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
    <rect x="7" y="26" width="38" height="16" rx="8" fill="white" opacity="0.88"/>
    <rect x="13" y="18" width="25" height="14" rx="7" fill="white" opacity="0.88"/>
    <rect x="18" y="13" width="18" height="12" rx="6" fill="white" opacity="0.8"/>
  </svg>;
}
function RainIcon({ s = 52 }) {
  return <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
    <rect x="7" y="12" width="38" height="16" rx="8" fill="#7A9DC5"/>
    <rect x="13" y="6" width="25" height="13" rx="6.5" fill="#7A9DC5"/>
    {[[14,32],[21,36],[28,32],[35,36],[17,40],[24,44],[31,40]].map(([x,y],i)=>(
      <line key={i} x1={x} y1={y} x2={x-3} y2={y+7} stroke="#5BA3D9" strokeWidth="2.5" strokeLinecap="round"/>
    ))}
  </svg>;
}
function StormIcon({ s = 52 }) {
  return <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
    <rect x="4" y="8" width="44" height="17" rx="8.5" fill="#3D4A5C"/>
    <rect x="12" y="4" width="28" height="13" rx="6.5" fill="#3D4A5C"/>
    <polyline points="28,27 22,39 28,39 22,51" stroke="#FFE14D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}
function SnowIcon({ s = 52 }) {
  return <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
    <rect x="7" y="10" width="38" height="16" rx="8" fill="#BEE3F8"/>
    <rect x="13" y="5" width="25" height="13" rx="6.5" fill="#BEE3F8"/>
    {[[16,33],[23,37],[30,33],[37,37],[20,42],[27,46]].map(([x,y],i)=>(
      <g key={i}>
        <line x1={x} y1={y-3} x2={x} y2={y+3} stroke="#7EC8E3" strokeWidth="2" strokeLinecap="round"/>
        <line x1={x-2.5} y1={y-1.5} x2={x+2.5} y2={y+1.5} stroke="#7EC8E3" strokeWidth="2" strokeLinecap="round"/>
        <line x1={x-2.5} y1={y+1.5} x2={x+2.5} y2={y-1.5} stroke="#7EC8E3" strokeWidth="2" strokeLinecap="round"/>
      </g>
    ))}
  </svg>;
}
function FogIcon({ s = 52 }) {
  return <svg width={s} height={s} viewBox="0 0 52 52" fill="none">
    {[12,20,28,36,44].map((y,i)=>(
      <rect key={i} x={8+i*2} y={y} width={36-i*4} height="3" rx="1.5" fill="white" opacity={0.9-i*0.12}/>
    ))}
  </svg>;
}

function getWx(code, isDay) {
  if (code === 0) return { Icon: isDay ? SunIcon : MoonIcon, label: isDay ? "Ensoleillé" : "Dégagé", bg: isDay ? "sunny" : "night" };
  if ([1,2].includes(code)) return { Icon: PartlyCloudyIcon, label: "Nuages épars", bg: isDay ? "partly" : "night" };
  if (code === 3) return { Icon: CloudIcon, label: "Nuageux", bg: "cloudy" };
  if ([45,48].includes(code)) return { Icon: FogIcon, label: "Brouillard", bg: "fog" };
  if ([51,53,55,61,63,65,80,81,82].includes(code)) return { Icon: RainIcon, label: "Pluie", bg: "rain" };
  if ([71,73,75,77,85,86].includes(code)) return { Icon: SnowIcon, label: "Neige", bg: "snow" };
  if ([95,96,99].includes(code)) return { Icon: StormIcon, label: "Orages", bg: "storm" };
  return { Icon: CloudIcon, label: "Variable", bg: "cloudy" };
}

// ─────────────────────────────────────────────────────────────────────────────
// LIQUID GLASS ANIMATED BG
// ─────────────────────────────────────────────────────────────────────────────
const THEMES = {
  sunny:  { a:"#1a6bb5", b:"#4db8f5", c:"#a8e6ff" },
  night:  { a:"#06061a", b:"#0d0d2e", c:"#1a1a4a" },
  partly: { a:"#2a5fa8", b:"#4a8bc8", c:"#7ab8e8" },
  cloudy: { a:"#3a4f6a", b:"#5a6f8a", c:"#7a8faa" },
  fog:    { a:"#606a7a", b:"#808a9a", c:"#a0aaba" },
  rain:   { a:"#1e2e42", b:"#2e4a64", c:"#3e6a84" },
  snow:   { a:"#3a5a7a", b:"#6a8aaa", c:"#9ab0c8" },
  storm:  { a:"#0e0e22", b:"#14142e", c:"#1e1e42" },
};

function AnimBg({ bg }) {
  const ref = useRef(null);
  const theme = THEMES[bg] || THEMES.sunny;
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, t = 0;
    const W = canvas.width = canvas.offsetWidth * devicePixelRatio;
    const H = canvas.height = canvas.offsetHeight * devicePixelRatio;
    canvas.style.width = canvas.offsetWidth + "px";
    canvas.style.height = canvas.offsetHeight + "px";

    const pts = Array.from({length: bg==="night" ? 120 : bg==="rain" ? 150 : bg==="snow" ? 80 : 0}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: bg==="rain" ? -1.5-Math.random()*3 : (Math.random()-.5)*.4,
      vy: bg==="rain" ? 8+Math.random()*8 : bg==="snow" ? .6+Math.random() : 0,
      r: Math.random()*(bg==="rain"?1.5:3)+.5,
      o: Math.random()*.7+.3, ph: Math.random()*6.28
    }));

    function draw() {
      t += 0.008;
      ctx.clearRect(0,0,W,H);
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, theme.a); g.addColorStop(.6, theme.b); g.addColorStop(1, theme.c);
      ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

      // Liquid glass blobs
      if (bg !== "night") {
        for (let i=0; i<3; i++) {
          const bx = W*.2 + W*.6*((i*.37+t*.12+Math.sin(t+i))%1);
          const by = H*.1 + H*.8*((i*.43+t*.08+Math.cos(t*.7+i))%1);
          const gr = ctx.createRadialGradient(bx,by,0,bx,by,W*.4);
          gr.addColorStop(0,"rgba(255,255,255,0.06)");
          gr.addColorStop(1,"rgba(255,255,255,0)");
          ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(bx,by,W*.4,0,Math.PI*2); ctx.fill();
        }
      }

      pts.forEach(p => {
        ctx.save();
        if (bg==="night") {
          p.o = .5 + Math.sin(t*2+p.ph)*.3;
          ctx.globalAlpha = p.o; ctx.fillStyle = "#fff";
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r*.6,0,Math.PI*2); ctx.fill();
        } else if (bg==="rain") {
          ctx.globalAlpha = p.o*.7; ctx.strokeStyle = "rgba(160,210,255,.7)"; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x+p.vx*2.5,p.y+p.vy*2.5); ctx.stroke();
          p.x+=p.vx; p.y+=p.vy; if(p.y>H){p.y=-10;p.x=Math.random()*W;}
        } else if (bg==="snow") {
          ctx.globalAlpha = p.o; ctx.fillStyle = "rgba(255,255,255,.9)";
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
          p.x+=p.vx+Math.sin(t+p.ph)*.4; p.y+=p.vy; p.ph+=.02;
          if(p.y>H){p.y=-10;p.x=Math.random()*W;}
        }
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [bg, theme]);
  return <canvas ref={ref} className="bg-canvas"/>;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const DAYS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MONTHS = ["jan","fév","mar","avr","mai","jui","jul","aoû","sep","oct","nov","déc"];
const fmt = n => Math.round(n);

// ─────────────────────────────────────────────────────────────────────────────
// EXPANDED MODAL (tap card → detail view)
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DRAGGABLE CARD GRID
// ─────────────────────────────────────────────────────────────────────────────
function DragGrid({ cards, onReorder }) {
  const dragIdx = useRef(null);
  const [over, setOver] = useState(null);

  return (
    <div className="drag-grid">
      {cards.map((card, i) => (
        <div
          key={card.id}
          className={`drag-cell ${over === i ? "drag-over" : ""}`}
          draggable
          onDragStart={() => { dragIdx.current = i; }}
          onDragOver={e => { e.preventDefault(); setOver(i); }}
          onDragEnd={() => { setOver(null); if (dragIdx.current !== null && dragIdx.current !== over) { onReorder(dragIdx.current, over ?? i); } dragIdx.current = null; }}
          onDrop={e => { e.preventDefault(); onReorder(dragIdx.current, i); setOver(null); dragIdx.current = null; }}
        >
          {card.node}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MINI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function WindCompass({ deg, speed, gusts }) {
  const dirs = ["N","NE","E","SE","S","SO","O","NO"];
  const dir = dirs[Math.round(deg/45)%8];
  return (
    <div className="wind-wrap">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r="40" stroke="rgba(255,255,255,.15)" strokeWidth="1" fill="rgba(255,255,255,.04)"/>
        {[0,90,180,270].map((d,i)=>{
          const lbl=["N","E","S","O"][i]; const r=d*Math.PI/180;
          return <text key={d} x={45+32*Math.sin(r)} y={45-32*Math.cos(r)+4} textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="11" fontWeight="600">{lbl}</text>;
        })}
        {[45,135,225,315].map((d,i)=>{
          const r=d*Math.PI/180;
          return <circle key={d} cx={45+32*Math.sin(r)} cy={45-32*Math.cos(r)} r="1.5" fill="rgba(255,255,255,.3)"/>;
        })}
        <line x1="45" y1="45" x2={45+30*Math.sin(deg*Math.PI/180)} y2={45-30*Math.cos(deg*Math.PI/180)} stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="45" cy="45" r="4" fill="white"/>
      </svg>
      <div className="wind-info">
        <span className="wind-speed">{fmt(speed)}<span className="wind-u"> km/h</span></span>
        <span className="wind-dir">{dir}</span>
        {gusts && <span className="wind-gust">Rafales {fmt(gusts)}</span>}
      </div>
    </div>
  );
}

function UVBar({ uv }) {
  const labels = ["Faible","Modéré","Élevé","T. élevé","Extrême"];
  const level = uv<=2?0:uv<=5?1:uv<=7?2:uv<=10?3:4;
  return (
    <div className="uvb">
      <div className="uvb-track">
        <div className="uvb-grad"/>
        <div className="uvb-thumb" style={{left:`${Math.min(uv/12,1)*100}%`}}/>
      </div>
      <div className="uvb-row"><span>Faible</span><span>Élevé</span><span>Max</span></div>
      <div className="uvb-lv">{labels[level]}</div>
    </div>
  );
}

function HumBar({ val }) {
  return (
    <div>
      <div className="hum-track"><div className="hum-fill" style={{width:`${val}%`}}/></div>
      <div className="uvb-row"><span>0%</span><span>50%</span><span>100%</span></div>
    </div>
  );
}

function SunArc({ sunrise, sunset }) {
  const r = new Date(sunrise), s = new Date(sunset);
  const tot = s-r, el = new Date()-r;
  const p = Math.max(0,Math.min(1,el/tot));
  const tf = d=>d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
  const cx = 10+p*180, cy = 70-Math.sin(p*Math.PI)*60;
  return (
    <div className="sun-arc-wrap">
      <svg viewBox="0 0 200 80" fill="none" width="100%">
        <defs><linearGradient id="sk" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#FF7B2C"/><stop offset="50%" stopColor="#FFD426"/><stop offset="100%" stopColor="#FF7B2C"/></linearGradient></defs>
        <path d="M10 70 Q100 5 190 70" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" fill="none" strokeDasharray="5 4"/>
        {p>0&&p<1&&<circle cx={cx} cy={cy} r="7" fill="#FFD426" filter="url(#glow)"/>}
        <defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      </svg>
      <div className="sun-times">
        <div><span>🌅</span><span>{tf(r)}</span></div>
        <div><span>🌇</span><span>{tf(s)}</span></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Card({ title, icon, onClick, children, className="" }) {
  return (
    <div className={`lg-card ${className}`} onClick={onClick} role={onClick?"button":undefined} tabIndex={onClick?0:undefined}>
      <div className="card-hdr">
        <span className="card-ico">{icon}</span>
        <span className="card-ttl">{title}</span>
        {onClick && <span className="card-chev">›</span>}
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "wind"|"uv"|"humidity"|"sunrise"|"pressure"|"visibility"|"feelslike"|"hourly"|"daily"
  const [cardOrder, setCardOrder] = useState(["wind","uv","humidity","sunrise","pressure","visibility","feelslike"]);

  const fetchW = useCallback(async (lat,lon) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,windgusts_10m,is_day,relative_humidity_2m,precipitation,visibility,pressure_msl,uv_index&hourly=temperature_2m,weathercode,precipitation_probability,windspeed_10m,apparent_temperature&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant,uv_index_max,sunrise,sunset&wind_speed_unit=kmh&timezone=auto&forecast_days=10`;
      const data = await (await fetch(url)).json();
      setWeather(data);
      try {
        const g = await (await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=fr`)).json();
        setCity(g.address?.city || g.address?.town || g.address?.village || g.address?.county || "Ma position");
      } catch { setCity("Ma position"); }
    } catch { setCity("Erreur réseau"); }
    finally { setLoading(false); }
  }, []);

  const locate = useCallback(() => {
    setLoading(true);
    if (!navigator.geolocation) { fetchW(48.8566,2.3522); return; }
    navigator.geolocation.getCurrentPosition(
      p=>fetchW(p.coords.latitude,p.coords.longitude),
      ()=>{ fetchW(48.8566,2.3522); setCity("Paris"); }
    );
  }, [fetchW]);

  useEffect(() => { locate(); }, [locate]);

  const reorder = (from, to) => {
    if (from === null || to === null || from === to) return;
    setCardOrder(prev => {
      const n = [...prev];
      const [item] = n.splice(from, 1);
      n.splice(to, 0, item);
      return n;
    });
  };

  const cur = weather?.current;
  const daily = weather?.daily;
  const hourly = weather?.hourly;
  const code = cur?.weathercode ?? 0;
  const isDay = cur?.is_day ?? 1;
  const { Icon, label, bg } = getWx(code, isDay);

  const now = new Date();
  const hourSlice = hourly ? hourly.time.map((t,i)=>({
    time: new Date(t), temp: hourly.temperature_2m[i],
    code: hourly.weathercode[i], precip: hourly.precipitation_probability[i],
  })).filter(h=>h.time>=now).slice(0,24) : [];

  // Module cards definitions
  const cardDefs = {
    wind: {
      title: "VENT", icon: "💨",
      preview: cur ? `${fmt(cur.windspeed_10m)} km/h` : "—",
      detail: cur ? <div><WindCompass deg={cur.winddirection_10m} speed={cur.windspeed_10m} gusts={cur.windgusts_10m}/><p className="mod-txt">Le vent souffle depuis le {["Nord","Nord-Est","Est","Sud-Est","Sud","Sud-Ouest","Ouest","Nord-Ouest"][Math.round(cur.winddirection_10m/45)%8]}.</p></div> : null,
    },
    uv: {
      title: "INDICE UV", icon: "☀️",
      preview: cur ? `${fmt(cur.uv_index || 0)}` : "—",
      detail: cur ? <div><div className="big-val">{fmt(cur.uv_index||0)}</div><UVBar uv={cur.uv_index||0}/><p className="mod-txt">{cur.uv_index<=2?"Protection solaire non nécessaire.":cur.uv_index<=5?"Protection recommandée.":cur.uv_index<=7?"Protection indispensable.":"Risque élevé, évitez l'exposition."}</p></div> : null,
    },
    humidity: {
      title: "HUMIDITÉ", icon: "💧",
      preview: cur ? `${fmt(cur.relative_humidity_2m)}%` : "—",
      detail: cur ? <div><div className="big-val">{fmt(cur.relative_humidity_2m)}%</div><HumBar val={cur.relative_humidity_2m}/><p className="mod-txt">{cur.relative_humidity_2m<30?"Air sec — restez hydraté.":cur.relative_humidity_2m<60?"Confort optimal.":"Humidité élevée."}</p></div> : null,
    },
    sunrise: {
      title: "LEVER/COUCHER", icon: "🌅",
      preview: daily?.sunrise?.[0] ? new Date(daily.sunrise[0]).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}) : "—",
      detail: daily?.sunrise?.[0] ? <div><SunArc sunrise={daily.sunrise[0]} sunset={daily.sunset[0]}/><div className="sun-detail-row"><div><div className="big-val" style={{fontSize:32}}>{new Date(daily.sunrise[0]).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div><div className="mod-lbl">Lever</div></div><div><div className="big-val" style={{fontSize:32}}>{new Date(daily.sunset[0]).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div><div className="mod-lbl">Coucher</div></div></div></div> : null,
    },
    pressure: {
      title: "PRESSION", icon: "🔵",
      preview: cur ? `${fmt(cur.pressure_msl)} hPa` : "—",
      detail: cur ? <div><div className="big-val">{fmt(cur.pressure_msl)}<span style={{fontSize:20,opacity:.7}}> hPa</span></div><p className="mod-txt">{cur.pressure_msl>1013?"Haute pression — temps stable prévu.":"Basse pression — temps perturbé possible."}</p></div> : null,
    },
    visibility: {
      title: "VISIBILITÉ", icon: "👁️",
      preview: cur ? `${fmt(cur.visibility/1000)} km` : "—",
      detail: cur ? <div><div className="big-val">{fmt(cur.visibility/1000)}<span style={{fontSize:20,opacity:.7}}> km</span></div><p className="mod-txt">{cur.visibility>=10000?"Excellente visibilité.":cur.visibility>=5000?"Bonne visibilité.":"Visibilité réduite — soyez prudent."}</p></div> : null,
    },
    feelslike: {
      title: "RESSENTI", icon: "🌡️",
      preview: cur ? `${fmt(cur.apparent_temperature)}°` : "—",
      detail: cur ? <div><div className="big-val">{fmt(cur.apparent_temperature)}°</div><p className="mod-txt">Température réelle : {fmt(cur.temperature_2m)}°. {cur.apparent_temperature<cur.temperature_2m?"Le vent refroidit l'atmosphère.":"L'humidité augmente la sensation de chaleur."}</p></div> : null,
    },
  };

  return (
    <div className="app">
      <AnimBg bg={bg}/>
      <div className="overlay"/>

      {loading && !cur ? (
        <div className="splash">
          <SunIcon s={72}/>
          <div className="splash-lbl">Météo</div>
          <div className="spinner"/>
        </div>
      ) : (
        <div className="scroll-root">
          <div className="safe-top"/>

          {/* HEADER */}
          <header className="header">
            <button className="loc-btn" onClick={locate} aria-label="Relocaliser">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3.5" fill="white"/>
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" stroke="white" strokeWidth="1.5" fill="none"/>
              </svg>
            </button>
            <div className="hdr-c">
              <div className="hdr-ma">Ma localisation</div>
              <div className="hdr-city">{city}</div>
            </div>
            <div style={{width:36}}/>
          </header>

          {cur && <>
            {/* HERO */}
            <section className="hero">
              <div className="hero-city">{city}</div>
              <div className="hero-icon-wrap"><Icon s={80}/></div>
              <div className="hero-temp">{fmt(cur.temperature_2m)}°</div>
              <div className="hero-label">{label}</div>
              <div className="hero-hl">
                H:{fmt(daily?.temperature_2m_max?.[0])}° · L:{fmt(daily?.temperature_2m_min?.[0])}°
              </div>
            </section>

            {/* HOURLY CARD */}
            <div className="lg-card" style={{cursor:"pointer"}} onClick={()=>setModal("hourly")}>
              <div className="card-hdr">
                <span className="card-ico">🕐</span>
                <span className="card-ttl">PRÉVISIONS HEURE PAR HEURE</span>
                <span className="card-chev">›</span>
              </div>
              <div className="divider"/>
              <div className="hourly-scroll">
                {hourSlice.map((h,i)=>{
                  const { Icon: HI } = getWx(h.code,1);
                  return (
                    <div key={i} className={`h-item ${i===0?"h-now":""}`}>
                      <div className="h-t">{i===0?"Maint.":h.time.getHours()+"h"}</div>
                      {h.precip>15&&<div className="h-pr">{h.precip}%</div>}
                      {h.precip<=15&&<div className="h-pr"/>}
                      <div className="h-ic"><HI s={24}/></div>
                      <div className="h-tp">{fmt(h.temp)}°</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 10-DAY CARD */}
            <div className="lg-card" style={{cursor:"pointer"}} onClick={()=>setModal("daily")}>
              <div className="card-hdr">
                <span className="card-ico">📅</span>
                <span className="card-ttl">PRÉVISIONS 10 JOURS</span>
                <span className="card-chev">›</span>
              </div>
              {daily && daily.time.map((t,i)=>{
                const d = new Date(t);
                const lbl = i===0?"Aujourd'hui":i===1?"Demain":DAYS[d.getDay()]+" "+d.getDate()+" "+MONTHS[d.getMonth()];
                const { Icon: DI } = getWx(daily.weathercode[i]);
                const maxT = Math.max(...daily.temperature_2m_max);
                const minT = Math.min(...daily.temperature_2m_min);
                const rng = maxT-minT||1;
                const bl = ((daily.temperature_2m_min[i]-minT)/rng)*100;
                const bw = ((daily.temperature_2m_max[i]-daily.temperature_2m_min[i])/rng)*100;
                return (
                  <div key={t} className={`d-row ${i<daily.time.length-1?"d-border":""}`}>
                    <div className="d-lbl">{lbl}</div>
                    <div className="d-ic"><DI s={24}/></div>
                    <div className="d-pr">{daily.precipitation_probability_max[i]>20?<span className="d-pct">{daily.precipitation_probability_max[i]}%</span>:""}</div>
                    <div className="d-mn">{fmt(daily.temperature_2m_min[i])}°</div>
                    <div className="d-bar"><div className="d-fill" style={{left:`${bl}%`,width:`${bw}%`}}/></div>
                    <div className="d-mx">{fmt(daily.temperature_2m_max[i])}°</div>
                  </div>
                );
              })}
            </div>

            {/* DRAGGABLE MODULE GRID */}
            <div className="drag-hint">⟡ Maintenez et glissez pour réorganiser</div>
            <DragGrid
              cards={cardOrder.map((id, i) => {
                const def = cardDefs[id];
                return {
                  id,
                  node: (
                    <Card key={id} title={def.title} icon={def.icon} onClick={()=>setModal(id)}>
                      <div className="mod-preview">{def.preview}</div>
                    </Card>
                  )
                };
              })}
              onReorder={reorder}
            />

            <footer className="footer">Open-Meteo · Données en temps réel · iOS 26 design</footer>
            <div className="safe-bottom"/>
          </>}
        </div>
      )}

      {/* MODALS */}
      {modal && (
        <Modal onClose={()=>setModal(null)}>
          {modal==="hourly" && (
            <div>
              <div className="modal-title">Prévisions heure par heure</div>
              <div className="modal-hourly">
                {hourSlice.map((h,i)=>{
                  const { Icon: HI, label: hl } = getWx(h.code,1);
                  return (
                    <div key={i} className="mh-row">
                      <div className="mh-t">{i===0?"Maintenant":h.time.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div>
                      <div className="mh-ic"><HI s={28}/></div>
                      <div className="mh-lbl">{hl}</div>
                      {h.precip>0&&<div className="mh-pr">{h.precip}%</div>}
                      <div className="mh-tp">{fmt(h.temp)}°</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {modal==="daily" && daily && (
            <div>
              <div className="modal-title">Prévisions 10 jours</div>
              {daily.time.map((t,i)=>{
                const d = new Date(t);
                const lbl = i===0?"Aujourd'hui":i===1?"Demain":DAYS[d.getDay()]+" "+d.getDate()+" "+MONTHS[d.getMonth()];
                const { Icon: DI, label: dl } = getWx(daily.weathercode[i]);
                return (
                  <div key={t} className="md-row">
                    <div className="md-day">{lbl}</div>
                    <div className="md-ic"><DI s={32}/></div>
                    <div className="md-info">
                      <div className="md-lbl">{dl}</div>
                      {daily.precipitation_probability_max[i]>0&&<div className="md-pr">{daily.precipitation_probability_max[i]}% précip.</div>}
                      <div className="md-tmp">↑{fmt(daily.temperature_2m_max[i])}° · ↓{fmt(daily.temperature_2m_min[i])}°</div>
                    </div>
                    <div className="md-wind">{fmt(daily.windspeed_10m_max[i])} km/h</div>
                  </div>
                );
              })}
            </div>
          )}
          {cardDefs[modal]?.detail && (
            <div>
              <div className="modal-title">{cardDefs[modal].title.charAt(0)+cardDefs[modal].title.slice(1).toLowerCase()}</div>
              {cardDefs[modal].detail}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
