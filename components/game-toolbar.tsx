import Image from "next/image";
import Illustration from "@/public/images/page-illustration.svg";
import BlurredShapeGray from "@/public/images/blurred-shape-gray.svg";
import BlurredShape from "@/public/images/blurred-shape.svg";
import './game-toolbar.css'

export default function GameToolbar() {
  return (
      <div className="game-toolbar normal">
        <div className="game-toolbar-down">
          <img src='/images/down_new.png' />
        </div>
        <div className="game-toolbar-box">
            <div className="game-toolbar-btn">账号注册</div>
            <div className="game-toolbar-btn">特权礼包</div>
            <div className="game-toolbar-btn">新手入门</div>
            <div className="game-toolbar-btn">客服服务</div>
        </div>
      </div>
  );
}
