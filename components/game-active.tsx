import { useEffect, useState } from "react";
import GameToolbar from "./game-toolbar";
import "./game-active.css";

export default function GameActive({openRegisterModal}: any) {
  const [activeList, setActiveList] = useState<any[]>([]);
  const [activeUrl, setActiveUrl] = useState("534543");

  useEffect(() => {
    setActiveList([
      {
        name: "活动页面1",
      },
      {
        name: "活动页面2",
      },
      {
        name: "活动页面3",
      },
    ]);

    setActiveUrl("活动页面1");
  }, []);
  return (
    <div className="game-active">
      <GameToolbar openRegisterModal={openRegisterModal} />
      <div className="game-active-box">
        <div className="game-active-img">{activeUrl}</div>
        <div className="game-active-tabs">
          {activeList.map((item) => (
            <div
              onMouseEnter={() => setActiveUrl(item.name)}
              className={`game-active-tab ${
                item.name === activeUrl ? "game-active-tab-active" : ""
              }`}
              key={item.name}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
