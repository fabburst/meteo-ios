/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";

// ─────────────────────────────────────────────────────────────────────────────
// SVG WEATHER ICONS (Apple-style SF Symbols inspired)
// ─────────────────────────────────────────────────────────────────────────────
function SunIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="11" fill="#FFD426" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const r1 = 16, r2 = 22, rad = deg * Math.PI / 180;
        return <line key={i}
          x1={28 + r1 * Math.cos(rad)} y1={28 + r1 * Math.sin(rad)}
          x2={28 + r2 * Math.cos(rad)} y2={28 + r2 * Math.sin(rad)}
          stroke="#FFD426" strokeWidth="2.5" strokeLinecap="round" />;
      })}
    </svg>
  );
}

function MoonIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path d="M30 10 C18 10 10 19 10 28 C10 39 19 46 30 46 C38 46 44 41 47 34 C42 37 34 37 28 31 C22 25 22 17 30 10Z" fill="#E8E8F0" />
    </svg>
  );
}

function PartlyCloudyIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <circle cx="22" cy="26" r="9" fill="#FFD426" />
      {[225,270,315,0,45].map((deg, i) => {
        const r1 = 13, r2 = 18, rad = deg * Math.PI / 180;
        return <line key={i}
          x1={22 + r1 * Math.cos(rad)} y1={26 + r1 * Math.sin(rad)}
          x2={22 + r2 * Math.cos(rad)} y2={26 + r2 * Math.sin(rad)}
          stroke="#FFD426" strokeWidth="2" strokeLinecap="round" />;
      })}
      <rect x="18" y="31" width="26" height="13" rx="6.5" fill="white" opacity="0.95" />
      <rect x="23" y="25" width="18" height="11" rx="5.5" fill="white" opacity="0.95" />
    </svg>
  );
}

function CloudIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <rect x="9" y="28" width="38" height="17" rx="8.5" fill="white" opacity="0.9" />
      <rect x="15" y="20" width="26" height="16" rx="8" fill="white" opacity="0.9" />
      <rect x="21" y="15" width="18" height="13" rx="6.5" fill="white" opacity="0.85" />
    </svg>
  );
}

function RainIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <rect x="9" y="14" width="38" height="17" rx="8.5" fill="#8EA5C8" />
      <rect x="15" y="8" width="26" height="14" rx="7" fill="#8EA5C8" />
      {[[18,35],[24,38],[30,35],[36,38],[21,42],[27,45],[33,42]].map(([x,y],i) => (
        <line key={i} x1={x} y1={y} x2={x-3} y2={y+7} stroke="#5B9BD5" strokeWidth="2.5" strokeLinecap="round" />
      ))}
    </svg>
  );
}

function StormIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <rect x="6" y="10" width="44" height="18" rx="9" fill="#4A5568" />
      <rect x="14" y="6" width="28" height="14" rx="7" fill="#4A5568" />
      <polyline points="30,30 24,42 30,42 24,54" stroke="#FFE14D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SnowIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <rect x="9" y="12" width="38" height="17" rx="8.5" fill="#BEE3F8" />
      <rect x="15" y="7" width="26" height="13" rx="6.5" fill="#BEE3F8" />
      {[[18,36],[25,40],[32,36],[39,40],[22,44],[29,47]].map(([x,y],i) => (
        <g key={i}>
          <line x1={x} y1={y-4} x2={x} y2={y+4} stroke="#7EC8E3" strokeWidth="2" strokeLinecap="round" />
          <line x1={x-3} y1={y-2} x2={x+3} y2={y+2} stroke="#7EC8E3" strokeWidth="2" strokeLinecap="round" />
          <line x1={x-3} y1={y+2} x2={x+3} y2={y-2} stroke="#7EC8E3" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

function FogIcon({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {[16,24,32,40,48].map((y, i) => (
        <rect key={i} x={10 + i * 2} y={y} width={36 - i * 4} height="3" rx="1.5" fill="white" opacity={0.9 - i * 0.12} />
      ))}
    </svg>
  );
}

function getWeatherAssets(code, isDay) {
  if (code === 0) return { Icon: isDay ? SunIcon : MoonIcon, label: isDay ? "Ensoleillé" : "Dégagé", key: isDay ? "sunny" : "night" };
  if ([1, 2].includes(code)) return { Icon: PartlyCloudyIcon, label: "Partiellement nuageux", key: "partly" };
  if (code === 3) return { Icon: CloudIcon, label: "Nuageux", key: "cloudy" };
  if ([45, 48].includes(code)) return { Icon: FogIcon, label: "Brouillard", key: "fog" };
  if ([51,53,55,61,63].includes(code)) return { Icon: RainIcon, label: "Pluie légère", key: "rain" };
  if ([65,80,81,82].includes(code)) return { Icon: RainIcon, label: "Pluie", key: "rain" };
  if ([71,73,75,77,85,86].includes(code)) return { Icon: SnowIcon, label: "Neige", key: "snow" };
  if ([95,96,99].includes(code)) return { Icon: StormIcon, label: "Orages", key: "storm" };
  return { Icon: CloudIcon, label: "Variable", key: "cloudy" };
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED BACKGROUND CANVAS
// ─────────────────────────────────────────────────────────────────────────────
const BG_THEMES = {
  sunny: { top: "#2980b9", mid: "#6dd5fa", particles: "rgba(255,220,50,0.15)", type: "sunny" },
  night: { top: "#0a0a1a", mid: "#1a1a3a", particles: "rgba(255,255,255,0.5)", type: "stars" },
  partly: { top: "#3a7bd5", mid: "#5a9fd5", particles: "rgba(255,255,255,0.08)", type: "clouds" },
  cloudy: { top: "#4a5f7a", mid: "#6a7f9a", particles: "rgba(255,255,255,0.05)", type: "clouds" },
  fog: { top: "#7a8a9a", mid: "#9aaaba", particles: "rgba(255,255,255,0.06)", type: "fog" },
  rain: { top: "#2c3e50", mid: "#3d5a6a", particles: "rgba(150,200,255,0.6)", type: "rain" },
  snow: { top: "#4a6a8a", mid: "#7a9aaa", particles: "rgba(255,255,255,0.8)", type: "snow" },
  storm: { top: "#1a1a2e", mid: "#16213e", particles: "rgba(255,220,0,0.3)", type: "storm" },
};

function AnimatedBg({ weatherKey, isDay }) {
  const canvasRef = useRef(null);
  const theme = BG_THEMES[weatherKey] || BG_THEMES.sunny;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let particles = [];
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const count = theme.type === "rain" ? 120 : theme.type === "snow" ? 60 : theme.type === "stars" ? 80 : 20;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * (theme.type === "rain" ? 1.5 : 3) + 0.5,
        vx: theme.type === "rain" ? -1 - Math.random() * 2 : (Math.random() - 0.5) * 0.3,
        vy: theme.type === "rain" ? 6 + Math.random() * 6 : theme.type === "snow" ? 0.5 + Math.random() * 0.8 : 0,
        opacity: Math.random() * 0.7 + 0.3,
        life: Math.random(),
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, theme.top);
      grad.addColorStop(1, theme.mid);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      particles.forEach(p => {
        ctx.save();
        if (theme.type === "rain") {
          ctx.globalAlpha = p.opacity * 0.7;
          ctx.strokeStyle = "rgba(150,200,255,0.7)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 3, p.y + p.vy * 3);
          ctx.stroke();
          p.x += p.vx; p.y += p.vy;
          if (p.y > H) { p.y = -10; p.x = Math.random() * W; }
        } else if (theme.type === "snow") {
          ctx.globalAlpha = p.opacity * 0.9;
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          p.x += p.vx + Math.sin(p.life * 3) * 0.3;
          p.y += p.vy; p.life += 0.01;
          if (p.y > H) { p.y = -10; p.x = Math.random() * W; }
        } else if (theme.type === "stars") {
          p.opacity = 0.5 + Math.sin(Date.now() / 1000 + p.x) * 0.3;
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = theme.particles.includes("0.") ? parseFloat(theme.particles.match(/[\d.]+\)/)[0]) : 0.1;
          ctx.fillStyle = theme.particles;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [weatherKey, theme]);

  return <canvas ref={canvasRef} className="bg-canvas" />;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const DAYS_FR = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MONTHS_FR = ["jan","fév","mar","avr","mai","jui","jul","aoû","sep","oct","nov","déc"];

function fmt(n, unit = "") { return `${Math.round(n)}${unit}`; }

function WindCompass({ deg, speed }) {
  const dirs = ["N","NE","E","SE","S","SO","O","NO"];
  const dir = dirs[Math.round(deg / 45) % 8];
  return (
    <div className="wind-compass">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
        {["N","E","S","O"].map((d, i) => {
          const a = i * 90 * Math.PI / 180;
          return <text key={d} x={40 + 28 * Math.sin(a)} y={40 - 28 * Math.cos(a) + 4}
            textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="600">{d}</text>;
        })}
        <line x1="40" y1="40"
          x2={40 + 28 * Math.sin(deg * Math.PI / 180)}
          y2={40 - 28 * Math.cos(deg * Math.PI / 180)}
          stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="40" cy="40" r="3" fill="white" />
      </svg>
      <div className="wind-info">
        <span className="wind-speed">{fmt(speed)}<span className="unit"> km/h</span></span>
        <span className="wind-dir">{dir}</span>
      </div>
    </div>
  );
}

function UVBar({ uv }) {
  const level = uv <= 2 ? "Faible" : uv <= 5 ? "Modéré" : uv <= 7 ? "Élevé" : uv <= 10 ? "Très élevé" : "Extrême";
  const pct = Math.min(uv / 12, 1) * 100;
  return (
    <div className="uv-bar-wrap">
      <div className="uv-bar-track">
        <div className="uv-bar-gradient" />
        <div className="uv-bar-thumb" style={{ left: `${pct}%` }} />
      </div>
      <div className="uv-labels">
        <span>Faible</span><span>Élevé</span><span>Extrême</span>
      </div>
      <div className="uv-level">{level}</div>
    </div>
  );
}

function SunriseSunset({ sunrise, sunset }) {
  const now = new Date();
  const rise = new Date(sunrise);
  const set = new Date(sunset);
  const total = set - rise;
  const elapsed = now - rise;
  const pct = Math.max(0, Math.min(1, elapsed / total)) * 100;
  const fmt12 = d => d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="sun-track">
      <div className="sun-arc">
        <svg viewBox="0 0 200 80" fill="none" width="100%">
          <path d="M10 70 Q100 0 190 70" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
          {pct > 0 && pct < 100 && (
            <circle cx={10 + pct * 1.8} cy={70 - Math.sin(pct * Math.PI / 100) * 65} r="6" fill="#FFD426" />
          )}
        </svg>
      </div>
      <div className="sun-times">
        <div><span>🌅</span><span>{fmt12(rise)}</span></div>
        <div><span>🌇</span><span>{fmt12(set)}</span></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityName, setCity] = useState("");
  const [country, setCountry] = useState("");

  const fetchWeather = useCallback(async (lat, lon) => {
    try {
      const url = [
        "https://api.open-meteo.com/v1/forecast",
        `?latitude=${lat}&longitude=${lon}`,
        "&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,windgusts_10m,is_day,relative_humidity_2m,precipitation,visibility,pressure_msl,uv_index",
        "&hourly=temperature_2m,weathercode,precipitation_probability,windspeed_10m,apparent_temperature",
        "&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant,uv_index_max,sunrise,sunset",
        "&wind_speed_unit=kmh&timezone=auto&forecast_days=10",
      ].join("");
      const res = await fetch(url);
      const data = await res.json();
      setWeather(data);
      try {
        const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=fr`);
        const gd = await geo.json();
        setCity(gd.address?.city || gd.address?.town || gd.address?.village || gd.address?.county || "Ma position");
        setCountry(gd.address?.country_code?.toUpperCase() || "");
      } catch { setCity("Ma position"); }
    } catch {
      setError("Impossible de récupérer la météo.");
    } finally {
      setLoading(false);
    }
  }, []);

  const locate = useCallback(() => {
    setLoading(true); setError(null);
    if (!navigator.geolocation) { fetchWeather(48.8566, 2.3522); setCity("Paris"); return; }
    navigator.geolocation.getCurrentPosition(
      p => fetchWeather(p.coords.latitude, p.coords.longitude),
      () => { fetchWeather(48.8566, 2.3522); setCity("Paris"); }
    );
  }, [fetchWeather]);

  useEffect(() => { locate(); }, [locate]);

  const cur = weather?.current;
  const daily = weather?.daily;
  const hourly = weather?.hourly;
  const code = cur?.weathercode ?? 0;
  const isDay = cur?.is_day ?? 1;
  const { Icon, label, key: weatherKey } = getWeatherAssets(code, isDay);

  // Hourly slice: next 24h
  const now = new Date();
  const hourlySlice = hourly ? hourly.time.map((t, i) => ({
    time: new Date(t),
    temp: hourly.temperature_2m[i],
    code: hourly.weathercode[i],
    precip: hourly.precipitation_probability[i],
    wind: hourly.windspeed_10m[i],
  })).filter(h => h.time >= now).slice(0, 24) : [];

  return (
    <div className="app">
      <AnimatedBg weatherKey={weatherKey} isDay={isDay} />
      <div className="overlay" />

      {loading && !cur ? (
        <div className="splash">
          <div className="splash-icon"><SunIcon size={72} /></div>
          <div className="splash-city">Météo</div>
          <div className="spinner" />
        </div>
      ) : (
        <div className="scroll-root">
          {/* ── STATUS BAR SPACER ── */}
          <div className="safe-top" />

          {/* ── HEADER ── */}
          <header className="header">
            <button className="loc-btn" onClick={locate}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3.5" fill="white"/>
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 6a6 6 0 1 1 0 12A6 6 0 0 1 12 6z" stroke="white" strokeWidth="1.5" fill="none"/>
              </svg>
            </button>
            <div className="header-center">
              <div className="header-city">Ma localisation</div>
              <div className="header-name">{cityName}{country ? `, ${country}` : ""}</div>
            </div>
            <div className="w18" />
          </header>

          {error && <div className="error-pill">{error}</div>}

          {cur && (
            <>
              {/* ── HERO ── */}
              <section className="hero">
                <div className="hero-city">{cityName}</div>
                <div className="hero-temp">{fmt(cur.temperature_2m)}°</div>
                <div className="hero-label">{label}</div>
                <div className="hero-range">
                  H:{fmt(daily?.temperature_2m_max?.[0])}°  L:{fmt(daily?.temperature_2m_min?.[0])}°
                </div>
              </section>

              {/* ── HOURLY SCROLL ── */}
              <section className="glass-card hourly-card">
                <div className="hourly-header">
                  {cur.precipitation > 0
                    ? `🌧 Précipitations · ${fmt(cur.precipitation)} mm`
                    : `☀️ Conditions agréables toute la journée`}
                </div>
                <div className="divider"/>
                <div className="hourly-scroll">
                  {hourlySlice.map((h, i) => {
                    const { Icon: HIcon } = getWeatherAssets(h.code, 1);
                    const isNow = i === 0;
                    return (
                      <div key={i} className={`hourly-item ${isNow ? "now" : ""}`}>
                        <div className="h-time">{isNow ? "Maint." : h.time.getHours() + "h"}</div>
                        <div className="h-precip">{h.precip > 0 ? `${h.precip}%` : ""}</div>
                        <div className="h-icon"><HIcon size={26} /></div>
                        <div className="h-temp">{fmt(h.temp)}°</div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ── 10-DAY FORECAST ── */}
              <section className="glass-card">
                <div className="card-title">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{marginRight:5}}>
                    <rect x="3" y="4" width="18" height="18" rx="3" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
                    <path d="M3 10h18M8 2v4M16 2v4" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  PRÉVISIONS 10 JOURS
                </div>
                {daily && daily.time.map((t, i) => {
                  const d = new Date(t);
                  const label = i === 0 ? "Aujourd'hui" : i === 1 ? "Demain" : DAYS_FR[d.getDay()] + " " + d.getDate() + " " + MONTHS_FR[d.getMonth()];
                  const { Icon: DIcon } = getWeatherAssets(daily.weathercode[i]);
                  const maxT = Math.max(...daily.temperature_2m_max);
                  const minT = Math.min(...daily.temperature_2m_min);
                  const range = maxT - minT;
                  const barLeft = ((daily.temperature_2m_min[i] - minT) / range) * 100;
                  const barWidth = ((daily.temperature_2m_max[i] - daily.temperature_2m_min[i]) / range) * 100;
                  return (
                    <div key={t} className={`daily-row ${i < daily.time.length - 1 ? "bordered" : ""}`}>
                      <div className="d-label">{label}</div>
                      <div className="d-icon"><DIcon size={26} /></div>
                      {daily.precipitation_probability_max[i] > 20 && (
                        <div className="d-precip">{daily.precipitation_probability_max[i]}%</div>
                      )}
                      {daily.precipitation_probability_max[i] <= 20 && <div className="d-precip" />}
                      <div className="d-min">{fmt(daily.temperature_2m_min[i])}°</div>
                      <div className="d-bar-track">
                        <div className="d-bar-fill" style={{ left: `${barLeft}%`, width: `${barWidth}%` }} />
                      </div>
                      <div className="d-max">{fmt(daily.temperature_2m_max[i])}°</div>
                    </div>
                  );
                })}
              </section>

              {/* ── MODULES ROW 1: Wind + UV ── */}
              <div className="modules-grid">
                <section className="glass-card module">
                  <div className="card-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{marginRight:5}}>
                      <path d="M5 8 Q10 4 15 8 Q18 10 20 8" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      <path d="M5 13 Q12 9 17 13 Q19 14 21 13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    </svg>
                    VENT
                  </div>
                  <WindCompass deg={cur.winddirection_10m} speed={cur.windspeed_10m} />
                  {cur.windgusts_10m && (
                    <div className="module-sub">Rafales {fmt(cur.windgusts_10m)} km/h</div>
                  )}
                </section>

                <section className="glass-card module">
                  <div className="card-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{marginRight:5}}>
                      <circle cx="12" cy="12" r="5" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
                      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    INDICE UV
                  </div>
                  <div className="uv-val">{fmt(cur.uv_index || 0)}</div>
                  <UVBar uv={cur.uv_index || 0} />
                </section>
              </div>

              {/* ── MODULES ROW 2: Sunrise + Humidity ── */}
              <div className="modules-grid">
                <section className="glass-card module">
                  <div className="card-title">
                    <span style={{marginRight:5,opacity:.7}}>🌅</span>LEVER/COUCHER
                  </div>
                  {daily?.sunrise?.[0] && <SunriseSunset sunrise={daily.sunrise[0]} sunset={daily.sunset[0]} />}
                </section>

                <section className="glass-card module">
                  <div className="card-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{marginRight:5}}>
                      <path d="M12 3 C12 3 6 11 6 16 a6 6 0 0 0 12 0 C18 11 12 3 12 3Z" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none"/>
                    </svg>
                    HUMIDITÉ
                  </div>
                  <div className="hum-val">{fmt(cur.relative_humidity_2m)}%</div>
                  <div className="hum-bar-track">
                    <div className="hum-bar-fill" style={{ width: `${cur.relative_humidity_2m}%` }} />
                  </div>
                  <div className="module-sub">{cur.relative_humidity_2m < 30 ? "Air sec" : cur.relative_humidity_2m < 60 ? "Confortable" : "Air humide"}</div>
                </section>
              </div>

              {/* ── MODULES ROW 3: Feels Like + Visibility ── */}
              <div className="modules-grid">
                <section className="glass-card module">
                  <div className="card-title">
                    <span style={{marginRight:5,opacity:.7}}>🌡️</span>RESSENTI
                  </div>
                  <div className="uv-val">{fmt(cur.apparent_temperature)}°</div>
                  <div className="module-sub">
                    {cur.apparent_temperature < cur.temperature_2m ? "Vent rend plus froid" : "Humidité rend plus chaud"}
                  </div>
                </section>

                <section className="glass-card module">
                  <div className="card-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{marginRight:5}}>
                      <circle cx="12" cy="12" r="3" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
                      <path d="M2 12h2M20 12h2M12 2v2M12 20v2" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    VISIBILITÉ
                  </div>
                  <div className="uv-val">{fmt(cur.visibility / 1000)} <span style={{fontSize:18}}>km</span></div>
                  <div className="module-sub">{cur.visibility >= 10000 ? "Excellente" : cur.visibility >= 5000 ? "Bonne" : "Réduite"}</div>
                </section>
              </div>

              {/* ── PRESSURE ── */}
              <section className="glass-card">
                <div className="card-title">
                  <span style={{marginRight:5,opacity:.7}}>🔵</span>PRESSION
                </div>
                <div className="pressure-row">
                  <span className="pressure-val">{fmt(cur.pressure_msl)}</span>
                  <span className="pressure-unit">hPa</span>
                </div>
                <div className="module-sub">{cur.pressure_msl > 1013 ? "Haute pression · Temps stable" : "Basse pression · Temps perturbé"}</div>
              </section>

              <footer className="footer">Open-Meteo · Données en temps réel</footer>
              <div className="safe-bottom" />
            </>
          )}
        </div>
      )}
    </div>
  );
}
