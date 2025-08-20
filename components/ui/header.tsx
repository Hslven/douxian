"use client";

import { useRouter } from "next/navigation";
import "./header.css";
import { getImgUrl } from "@/utils/request";

export default function Header({ openRegisterModal, buttonImgs }: any) {
  const router = useRouter();
  return (
    <div className="game-header">
      <div className="game-header-logo" onClick={() => router.push("/")}>
        <img className="btn-bg" src={getImgUrl(buttonImgs.homeLogoImg)} />
        {/* <Image fill objectFit="cover" src={logo} alt="" /> */}
      </div>
      <div className="game-header-btn-group">
        <div className="game-header-btn" onClick={() => alert("敬请期待")}>
          <img className="btn-bg"  src={getImgUrl(buttonImgs.topGameDownLoadImg)} />
          {/* <Image fill objectFit="cover" src={home_btn_bg} alt="" /> */}
          {/* <span className="game-header-btn-name">游戏下载</span> */}
        </div>
        <div
          className="game-header-btn"
          // onClick={openRegisterModal}
          onClick={() => alert("敬请期待")}
        >
          <img className="btn-bg"  src={getImgUrl(buttonImgs.topAccountRegisterImg)} />
          {/* <Image fill objectFit="cover" src={home_btn_bg} alt="" /> */}
          {/* <span className="game-header-btn-name">游戏注册</span> */}
        </div>
      </div>
    </div>
  );
}
