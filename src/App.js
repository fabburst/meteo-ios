import { useState, useEffect, useCallback } from "react";
import "./App.css";



function getWeatherInfo(code, isDay = true) {
  const sunny = (
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="12" fill="#FFD93D" />
      {[0,45,90,135,180,225,270,315].map((deg,i) => (
        <line key={i}
          x1={32 + 18*Math.cos(deg*Math.PI/180)} y1={32 + 18*Math.sin(deg*Math.PI/180)}
          x2={32 + 25*Math.cos(deg*Math.PI/180)} y2={32 + 25*Math.sin(deg*Math.PI/180)}
          stroke="#FFD93D" strokeWidth="3" strokeLinecap="round"/>
      ))}
    </svg>
  );
  const night = (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M32 12 C20 12 12 22 12 32 C12 44 22 52 34 52 C44 52 52 44 52 34 C44 40 34 40 28 34 C22 28 22 18 32 12Z" fill="#E2E8F0"/>
      <circle cx="44" cy="18" r="2" fill="#E2E8F0"/>
      <circle cx="50" cy="28" r="1.5" fill="#E2E8F0" opacity="0.7"/>
    </svg>
  );
  const partlyCloudy = (
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="26" cy="30" r="9" fill="#FFD93D" />
      {[270,315,0,45,90].map((deg,i) => (
        <line key={i}
          x1={26 + 13*Math.cos(deg*Math.PI/180)} y1={30 + 13*Math.sin(deg*Math.PI/180)}
          x2={26 + 18*Math.cos(deg*Math.PI/180)} y2={30 + 18*Math.sin(deg*Math.PI/180)}
          stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round"/>
      ))}
      <rect x="20" y="34" width="30" height="14" rx="7" fill="white" opacity="0.9"/>
      <rect x="26" y="29" width="20" height="12" rx="6" fill="white" opacity="0.9"/>
    </svg>
  );
  const cloudy = (
    <svg viewBox="0 0 64 64" fill="none">
      <rect x="10" y="30" width="44" height="20" rx="10" fill="white" opacity="0.85"/>
      <rect x="18" y="22" width="30" height="18" rx="9" fill="white" opacity="0.85"/>
      <rect x="24" y="18" width="22" height="14" rx="7" fill="white" opacity="0.75"/>
    </svg>
  );
  const rainy = (
    <svg viewBox="0 0 64 64" fill="none">
      <rect x="10" y="18" width="44" height="20" rx="10" fill="#A0AEC0"/>
      <rect x="18" y="12" width="30" height="16" rx="8" fill="#A0AEC0"/>
      {[20,29,38,47,24,33,42].map((x,i) => (
        <line key={i} x1={x} y1={42+i%2*4} x2={x-4} y2={52+i%2*4}
          stroke="#63B3ED" strokeWidth="2.5" strokeLinecap="round"/>
      ))}
    </svg>
  );
  const stormy = (
    <svg viewBox="0 0 64 64" fill="none">
      <rect x="8" y="14" width="48" height="20" rx="10" fill="#4A5568"/>
      <rect x="18" y="8" width="28" height="16" rx="8" fill="#4A5568"/>
      <polyline points="34,34 28,46 34,46 28,58" stroke="#F6E05E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const snowy = (
    <svg viewBox="0 0 64 64" fill="none">
      <rect x="10" y="16" width="44" height="20" rx="10" fill="#BEE3F8"/>
      <rect x="18" y="10" width="30" height="16" rx="8" fill="#BEE3F8"/>
      <text x="20" y="48" fontSize="10" fill="white">❄ ❄ ❄ ❄</text>
    </svg>
  );

  if (code === 0) return { icon: isDay ? sunny : night, label: isDay ? "Ensoleillé" : "Nuit dégagée" };
  if ([1,2].includes(code)) return { icon: partlyCloudy, label: "Nuages épars" };
  if (code === 3) return { icon: cloudy, label: "Nuageux" };
  if ([45,48].includes(code)) return { icon: cloudy, label: "Brouillard" };
  if ([51,53,55,61,63,65,80,81,82].includes(code)) return { icon: rainy, label: "Pluie" };
  if ([71,73,75,77,85,86].includes(code)) return { icon: snowy, label: "Neige" };
  if ([95,96,99].includes(code)) return { icon: stormy, label: "Orage" };
  return { icon: cloudy, label: "Variable" };
}

function getBg(code, isDay) {
  if (!isDay) return ["#0f0c29","#302b63","#24243e"];
  if (code === 0) return ["#1a78c2","#56b4e3","#a8d8ea"];
  if ([1,2,3].includes(code)) return ["#4b6cb7","#374785","#4b6cb7"];
  if ([51,53,55,61,63,65,80,81,82].includes(code)) return ["#2c3e50","#4286f4","#3a6073"];
  if ([71,73,75,77,85,86].includes(code)) return ["#8e9eab","#b8c6cd","#eef2f3"];
  if ([95,96,99].includes(code)) return ["#1a1a2e","#16213e","#0f3460"];
  return ["#4b6cb7","#182848","#4b6cb7"];
}

const DAYS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];

function WindArrow({ deg }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{transform:`rotate(${deg}deg)`,display:"inline-block",verticalAlign:"middle",marginRight:3}}>
      <path d="M12 2 L16 12 L12 9 L8 12 Z" fill="rgba(255,255,255,0.9)"/>
    </svg>
  );
}

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityName, setCityName] = useState("");
  const [animKey, setAnimKey] = useState(0);

  const fetchWeather = useCallback(async (lat, lon) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max,winddirection_10m_dominant&wind_speed_unit=kmh&timezone=auto&forecast_days=7`;
      const res = await fetch(url);
      const data = await res.json();
      setWeather(data);
      setAnimKey(k => k+1);
      try {
        const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const gd = await geo.json();
        setCityName(gd.address?.city || gd.address?.town || gd.address?.village || gd.address?.county || "Ma position");
      } catch {}
    } catch {
      setError("Impossible de récupérer la météo.");
    } finally {
      setLoading(false);
    }
  }, []);

  const locate = useCallback(() => {
    setLoading(true); setError(null);
    if (!navigator.geolocation) {
      setError("Géolocalisation non supportée.");
      setLoading(false); return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => { fetchWeather(pos.coords.latitude, pos.coords.longitude); },
      () => { setCityName("Paris"); fetchWeather(48.8566, 2.3522); }
    );
  }, [fetchWeather]);

  useEffect(() => { locate(); }, [locate]);

  const cur = weather?.current;
  const daily = weather?.daily;
  const code = cur?.weathercode ?? 0;
  const isDay = cur?.is_day ?? 1;
  const bgColors = getBg(code, isDay);
  const bg = `linear-gradient(160deg, ${bgColors[0]} 0%, ${bgColors[1]} 60%, ${bgColors[2]} 100%)`;
  const { icon, label } = getWeatherInfo(code, isDay);

  return (
    <div className="app" style={{background: bg}} key={animKey}>
      <div className="noise"/>
      
      <header className="header">
        <div className="city-row">
          <button className="loc-btn" onClick={locate} disabled={loading}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="white"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 5a7 7 0 1 1 0 14A7 7 0 0 1 12 5z" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>
          </button>
          <div>
            <h1 className="city">{loading && !cur ? "Localisation…" : cityName || "—"}</h1>
            {cur && <p className="city-sub">{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</p>}
          </div>
        </div>
      </header>

      {error && <div className="error-pill">{error}</div>}

      {cur && (
        <div className="content fade-in">
          <section className="hero">
            <div className="hero-icon">{icon}</div>
            <div className="hero-temp">{Math.round(cur.temperature_2m)}°</div>
            <div className="hero-label">{label}</div>
            <div className="hero-sub">
              Ressenti {Math.round(cur.apparent_temperature)}°
            </div>
          </section>

          <section className="glass-card details-row">
            <div className="detail">
              <WindArrow deg={cur.winddirection_10m}/>
              <span className="detail-val">{Math.round(cur.windspeed_10m)}</span>
              <span className="detail-unit"> km/h</span>
            </div>
            <div className="sep"/>
            <div className="detail">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{verticalAlign:"middle",marginRight:4}}>
                <path d="M12 2 C12 2 5 11 5 16 a7 7 0 0 0 14 0 C19 11 12 2 12 2Z" fill="rgba(255,255,255,0.85)"/>
              </svg>
              <span className="detail-val">{Math.round(cur.apparent_temperature)}°</span>
              <span className="detail-unit"> ressenti</span>
            </div>
          </section>

          {daily && (
            <section className="glass-card forecast">
              <h2 className="section-title">PRÉVISIONS 7 JOURS</h2>
              {daily.time.map((t, i) => {
                const d = new Date(t);
                const dayLabel = i === 0 ? "Aujourd'hui" : i === 1 ? "Demain" : DAYS[d.getDay()];
                const { icon: dIcon } = getWeatherInfo(daily.weathercode[i]);
                return (
                  <div key={t} className="forecast-row" style={{animationDelay:`${i*50}ms`}}>
                    <span className="fc-day">{dayLabel}</span>
                    <span className="fc-icon">{dIcon}</span>
                    <span className="fc-wind">
                      <WindArrow deg={daily.winddirection_10m_dominant[i]}/>
                      {Math.round(daily.windspeed_10m_max[i])}
                    </span>
                    <span className="fc-temps">
                      <span className="fc-max">{Math.round(daily.temperature_2m_max[i])}°</span>
                      <span className="fc-sep">／</span>
                      <span className="fc-min">{Math.round(daily.temperature_2m_min[i])}°</span>
                    </span>
                  </div>
                );
              })}
            </section>
          )}

          <footer className="footer">Open-Meteo · Données temps réel</footer>
        </div>
      )}

      {loading && !cur && (
        <div className="loading">
          <div className="spinner"/>
          <p>Récupération de la météo…</p>
        </div>
      )}
    </div>
  );
}
