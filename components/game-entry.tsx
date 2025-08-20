import { getImgUrl } from "@/utils/request";
import "./game-entry.css";
export default function GameEntry({ openRegisterModal, buttonImgs }: any) {
  return (
    <div className="game-entry">
      <div className="game-entry-btn">
        
        <img className="btn-bg" src={getImgUrl(buttonImgs?.bottomGameDownLoadImg)} />
      </div>
      <div className="game-entry-btn" onClick={openRegisterModal}>
        <img className="btn-bg" src={getImgUrl(buttonImgs?.bottomAccountRegisterImg)} />
      </div>
    </div>
  );
}
