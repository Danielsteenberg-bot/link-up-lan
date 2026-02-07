import { useState } from "react";
import dagens from "./dagenData";

function DagensTilMil() {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);


  const handleOpen = () => {
    const randomIndex = Math.floor(Math.random() * dagens.length);
    setText(dagens[randomIndex]);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="dagens">
      <button className="dagens-btn" onClick={handleOpen}>
        Vil du have en dagens?
      </button>

      {isOpen && (
        <div className="dagens-modal-backdrop" role="dialog" aria-modal="tru e">
          <div className="dagens-modal">
            <p className="dagens-modal-kicker">Dagens til Mil</p>
            <p className="dagens-modal-text">{text}</p>
            <div className="dagens-modal-actions">
              <button className="dagens-modal-close" onClick={handleClose}>
                Luk
              </button>
              <button className="dagens-modal-again" onClick={handleOpen}>
                En mere
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DagensTilMil;
