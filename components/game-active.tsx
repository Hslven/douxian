import { useEffect, useState } from "react";
import GameToolbar from "./game-toolbar";
import "./game-active.css";
import { getImgUrl } from "@/utils/request";

export default function GameActive({openRegisterModal,homeDetails, buttonImgs}: any) {
  const [activeList, setActiveList] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if(homeDetails.gameShots?.length) {
      setActiveList(homeDetails.gameShots.map(url => getImgUrl(url)))
    }
  }, [homeDetails.gameShots]);
  return (
    <div className="game-active">
      <GameToolbar className="game-active-toolbar" openRegisterModal={openRegisterModal} buttonImgs={buttonImgs} />
      <div className="game-active-box">
        <div className="game-active-img-warp"               onClick={() => window.open(`/detail/${activeIndex+4}`)}
        >
          <img className="game-active-img" src={activeList[activeIndex]} alt='' />
        </div>
        <div className="game-active-tabs">
          {Array.from({length:3}).map((_, index) => (
            <div
              onMouseEnter={() => setActiveIndex(index)}
              className={`game-active-tab ${
                activeIndex === index ? "game-active-tab-active" : ""
              }`}
              key={index}
              onClick={() => window.open(`/detail/${index+4}`)}
            >
              活动页面{index+ 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
