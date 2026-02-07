import { useEffect, useRef, useState } from 'react';
import DagensTilMil from './DagensTilMil.jsx';
import dagens from './dagenData.js';

export default function App() {
  const [dogUrl, setDogUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPos, setNoPos] = useState({ left: '50%', top: '78%', angle: 0 });
  const containerRef = useRef(null);
  const noBtnRef = useRef(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const getDefaultDate = () => {
    const now = new Date();
    const year =
      now.getMonth() > 1 || (now.getMonth() === 1 && now.getDate() > 14)
        ? now.getFullYear() + 1
        : now.getFullYear();

    return `${year}-02-14`;
  };

  const [scheduledAt, setScheduledAt] = useState(getDefaultDate());

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

        const BOX = Math.min(500, width, height);
        const boxLeft = (width - BOX) / 2;
        const boxTop = (height - BOX) / 2;

        const pad = Math.min(20 + next * 8, BOX / 4);
        const halfW = btnRect.width / 2;
        const halfH = btnRect.height / 2;

        let leftPx = boxLeft + pad + Math.random() * (BOX - pad * 2);
        let topPx = boxTop + pad + Math.random() * (BOX - pad * 2);

        leftPx = Math.min(Math.max(leftPx, boxLeft + pad + halfW), boxLeft + BOX - pad - halfW);
        topPx = Math.min(Math.max(topPx, boxTop + pad + halfH), boxTop + BOX - pad - halfH);

        setNoPos({
          left: `${(leftPx / width) * 100}%`,
          top: `${(topPx / height) * 100}%`,
          angle: (Math.random() - 0.5) * Math.min(30, next * 4),
        });
      }

      return next;
    });
  }

  function handleYesClick() {
    setShowSchedule(true);
  }

  function formatGoogleAllDayDate(dateStr) {
    return dateStr.replace(/-/g, '');
  }

  function buildGoogleCalendarUrl() {
    const start = formatGoogleAllDayDate(scheduledAt);

    const [y, m, d] = scheduledAt.split('-').map(Number);
    const endDate = new Date(y, m - 1, d + 1);
    const end = formatGoogleAllDayDate(
      `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(
        endDate.getDate()
      ).padStart(2, '0')}`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      'Lil mil'
    )}&dates=${start}/${end}&details=${encodeURIComponent(
      'Du er velkommen til at abuse min kalender'
    )}&location=${encodeURIComponent(
      'Du bestemmer Århus/Hillerød'
    )}&add=${encodeURIComponent('steenbergdaniel11@gmail.com')}`;
  }

  const yesScale = Math.min(1 + dodgeCount * 0.18, 2.2);
  const noScale = Math.max(0.45, 1 - dodgeCount * 0.08);


  dagens.forEach((d) => console.log(d))
  return (
    <div className="app">
      <h1 className="title">Skal vi holde lan? 😶‍🌫️</h1>
      <h2 className="subtitle">Ellers kan du få et random hunde billede</h2>

      <DagensTilMil />

      <div className="stage" ref={containerRef}>
        <div className="image-wrapper">
          {loading ? (
            <div className="loading">Henter hund...</div>
          ) : (
            <img className="dog" src={dogUrl} alt="labrador" />
          )}
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
            style={
              dodgeCount === 0
                ? { transform: `scale(${noScale})`, marginLeft: '14px' }
                : {
                    position: 'absolute',
                    left: noPos.left,
                    top: noPos.top,
                    transform: `translate(-50%,-50%) rotate(${noPos.angle}deg) scale(${noScale})`,
                    zIndex: 20,
                  }
            }
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
                type="date"
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
