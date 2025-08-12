import './game-entry.css'
export default function GameEntry({openRegisterModal}:any) {
  return (
    <div className="game-entry">
        <div className="game-entry-btn"><img src='./images/GameEntry_down.png' /></div>
        <div className="game-entry-btn" onClick={openRegisterModal}><img src='./images/GameEntry_register.png' /></div>
    </div>
  );
}
