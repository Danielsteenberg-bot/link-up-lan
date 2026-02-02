import { useEffect, useState } from 'react';

import chokolade from './assets/falling/chokolade.png';
import classicdaase from './assets/falling/classicdaase.webp';
import coffee from './assets/falling/coffee.png';
import pepsimax from './assets/falling/pepsimax.webp';
import snus from './assets/falling/snus.webp';
import snus2 from './assets/falling/snus2.webp';
import tuborgclassic from './assets/falling/tuborgclassic.png';

// Default image list — your images are used now
const DEFAULT_THINGS = [
  chokolade,
  classicdaase,
  coffee,
  pepsimax,
  snus,
  snus2,
  tuborgclassic,
];

export default function FallingThings({ spawnRate = 350, max = 28, things = DEFAULT_THINGS }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let id = 0;
    const timeouts = new Set();
    const interval = setInterval(() => {
      const dur = 4 + Math.random() * 6;
      const delay = Math.random() * 1.2;
      const itThing = things[Math.floor(Math.random() * things.length)];
      const it = {
        id: id++,
        ch: itThing,
        left: Math.random() * 100,
        size: 12 + Math.random() * 36,
        dur,
        delay,
        sway: (Math.random() * 24 - 12).toFixed(1),
        rot: Math.floor(Math.random() * 720 - 360),
      };
      setItems((s) => {
        const next = [...s, it].slice(-max);
        return next;
      });

      const tidy = setTimeout(() => {
        setItems((s) => s.filter((x) => x.id !== it.id));
        timeouts.delete(tidy);
      }, (dur + delay) * 1000 + 800);
      timeouts.add(tidy);
    }, spawnRate);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [spawnRate, max, things]);
 

  return (
    <div className="fall-container" aria-hidden="true">
      {items.map((it) => {
        const isImg = typeof it.ch === 'string' && (it.ch.endsWith('.png') || it.ch.endsWith('.jpg') || it.ch.endsWith('.jpeg') || it.ch.endsWith('.webp'));
        return (
          <span
            key={it.id}
            className="fall-item"
            style={{
              left: `${it.left}vw`,
              '--dur': `${it.dur}s`,
              '--delay': `${it.delay}s`,
            }}
          >
            <span
              className="fall-inner"
              style={{
                fontSize: `${it.size}px`,
                '--sway': `${it.sway}px`,
                '--rot': `${it.rot}deg`,
              }}
            >
              {isImg ? <img src={it.ch} alt="" style={{ width: it.size * 1.6, height: 'auto', display: 'block' }} /> : it.ch}
            </span>
          </span>
        );
      })}
    </div>
  );
}