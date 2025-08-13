import Image from "next/image";
import entry_btn_bg from "../public/images/entry_btn_bg.png";
import "./game-entry.css";
export default function GameEntry({ openRegisterModal }: any) {
  return (
    <div className="game-entry">
      <div className="game-entry-btn">
        游戏下载
        <Image src={entry_btn_bg} alt="" />
      </div>
      <div className="game-entry-btn" onClick={openRegisterModal}>
        游戏注册
        <Image src={entry_btn_bg} alt="" />
      </div>
    </div>
  );
}
