import { useEffect, useState } from "react";
import GameToolbar from "./game-toolbar";
import "./game-active.css";
import game_active from '../public/images/game_active.png'
import Image from "next/image";

export default function GameActive({openRegisterModal}: any) {
  const [activeList, setActiveList] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeUrl, setActiveUrl] = useState<any>("");

  useEffect(() => {
    setActiveList([
      {
        name: "活动页面1",
        url: game_active
      },
      {
        name: "活动页面2",
        url: game_active
      },
      {
        name: "活动页面3",
        url: game_active
      },
    ]);
  }, []);
  return (
    <div className="game-active">
      <GameToolbar openRegisterModal={openRegisterModal} />
      <div className="game-active-box">
        <div className="game-active-img-warp">
          <Image className="game-active-img" src={activeList[activeIndex]?.url || game_active} alt='' />
        </div>
        <div className="game-active-tabs">
          {activeList.map((item, index) => (
            <div
              onMouseEnter={() => setActiveIndex(index)}
              className={`game-active-tab ${
                activeIndex === index ? "game-active-tab-active" : ""
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
