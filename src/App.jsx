import { useEffect, useRef, useState } from 'react';
import './App.css';

export default function App() {
  const [dogUrl, setDogUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPos, setNoPos] = useState({ left: '50%', top: '78%', angle: 0 });
  const containerRef = useRef(null);
  const noBtnRef = useRef(null);
  const [showSchedule, setShowSchedule] = useState(false);
  
  const getDefaultDateTimeLocal = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(19, 0, 0, 0);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };
  const [scheduledAt, setScheduledAt] = useState(getDefaultDateTimeLocal());

  useEffect(() => {
    fetchDog();
  }, []);

  async function fetchDog() {
    setLoading(true);
    try {
      const res = await fetch('https://dog.ceo/api/breed/labrador/images/random');
      const data = await res.json();
      setDogUrl(data.message);
    } catch (err) {
      console.error(err);
      setDogUrl('');
    } finally {
      setLoading(false);
    }
  }

function handleNoHover() {
  setDodgeCount((prev) => {
    const next = prev + 1;
    const cont = containerRef.current;
    const btn = noBtnRef.current;
    if (cont) {
      const width = cont.clientWidth;
      const height = cont.clientHeight;

      const btnRect = btn ? btn.getBoundingClientRect() : { width: 80, height: 36 };
      const halfW = btnRect.width / 2;
      const halfH = btnRect.height / 2;

      const BOX = Math.min(500, width, height);
      const boxLeft = (width - BOX) / 2;
      const boxTop = (height - BOX) / 2;

      const pad = Math.min(20 + next * 8, BOX / 4);
      const availW = Math.max(0, BOX - pad * 2);
      const availH = Math.max(0, BOX - pad * 2);

      let leftPx = boxLeft + pad + Math.random() * availW;
      let topPx = boxTop + pad + Math.random() * availH;

      const minLeft = boxLeft + pad + halfW;
      const maxLeft = boxLeft + BOX - pad - halfW;
      const minTop = boxTop + pad + halfH;
      const maxTop = boxTop + BOX - pad - halfH;

      leftPx = Math.min(Math.max(leftPx, minLeft), maxLeft);
      topPx = Math.min(Math.max(topPx, minTop), maxTop);

      const leftPct = (leftPx / width) * 100;
      const topPct = (topPx / height) * 100;

      const angle = (Math.random() - 0.5) * Math.min(30, next * 4);
      setNoPos({ left: `${leftPct}%`, top: `${topPct}%`, angle });
    } else {
      setNoPos((s) => ({
        ...s,
        left: `${10 + Math.random() * 80}%`,
        top: `${30 + Math.random() * 50}%`,
        angle: (Math.random() - 0.5) * 15,
      }));
    }
    return next;
  });
}

  function handleYesClick() {
    setShowSchedule(true);
  }

  function formatGoogleDate(dt) {
    return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  function buildGoogleCalendarUrl() {
    const start = new Date(scheduledAt);
    const end = new Date(start.getTime() + 1000 * 60 * 60 * 2);
    const dates = `${formatGoogleDate(start)}/${formatGoogleDate(end)}`;
    const text = encodeURIComponent('Lan lil mil');
    const details = encodeURIComponent('Vi skal have en fantastisk lan sammen! Glæder mig til at se dig der.');
    const location = encodeURIComponent('Du bestemmer Århus/Hillerød');
    const add = encodeURIComponent('steenbergdaniel11@gmail.com');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}&add=${add}`;
  }

  const yesScale = Math.min(1 + dodgeCount * 0.18, 2.2);
  const noScale = Math.max(0.45, 1 - dodgeCount * 0.08);


  const noButtonStyle =
    dodgeCount === 0
      ? { transform: `scale(${noScale})`, marginLeft: '14px', position: 'static' }
      : {
          position: 'absolute',
          left: noPos.left,
          top: noPos.top,
          transform: `translate(-50%,-50%) rotate(${noPos.angle}deg) scale(${noScale})`,
          zIndex: 20,
        };

  return (
    <div className="app">
      <h1 className="title">Skal vi holde lan? 😶‍🌫️</h1>
       <h2 className="subtitle">  Ellers kan du få et random hunde billede</h2>

      <div className="stage" ref={containerRef}>
        <div className="image-wrapper">
          {loading ? <div className="loading">Henter hund...</div> : <img className="dog" src={dogUrl} alt="labrador" />}
        </div>

        <div className="buttons-area">
          <button className="yes-btn" onClick={handleYesClick} style={{ transform: `scale(${yesScale})` }}>
            Ja fandme!!!
          </button>

          <button
            ref={noBtnRef}
            className="no-btn"
            onMouseEnter={handleNoHover}
            onClick={(e) => {
              e.preventDefault();
              handleNoHover();
            }}
            style={noButtonStyle}
            aria-label="No button (dodges)"
          >
            Nej?
          </button>
        </div>

        <div className="controls">
          <button className="small" onClick={fetchDog}>
            Hent nyt hundebillede
          </button>
        </div>
      </div>

        {showSchedule && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal">
              <h3>Vælg dato</h3>
              <label>
                Hvornår:
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </label>
              <div className="modal-actions">
                <button onClick={() => setShowSchedule(false)}>Cancel</button>
                <a
                  className="primary-link"
                  href={buildGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowSchedule(false)}
                >
                  Book ind i min kalender
                </a>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}