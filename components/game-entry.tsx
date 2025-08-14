import "./game-entry.css";
export default function GameEntry({ openRegisterModal }: any) {
  return (
    <div className="game-entry">
      <div className="game-entry-btn">游戏下载</div>
      <div className="game-entry-btn" onClick={openRegisterModal}>
        游戏注册
      </div>
    </div>
  );
}
