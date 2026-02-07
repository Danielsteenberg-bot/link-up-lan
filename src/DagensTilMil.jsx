import { useState } from "react";
import dagens from "./dagenData";

function DagensTilMil() {
  const [text, setText] = useState("");
  console.log(dagens)

  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * dagens.length);
    setText(dagens[randomIndex]);
  };

  return (
    <div>
      <button onClick={handleClick}>Giv mig en dagens</button>
      {text && <p>{text}</p>}
    </div>
  );
}

export default DagensTilMil;
