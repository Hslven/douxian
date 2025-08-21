"use client";

import { useRouter } from "next/navigation";
import "./header.css";
import { getImgUrl } from "@/utils/request";

export default function Header({ openRegisterModal, buttonImgs,openTips }: any) {
  const router = useRouter();
  return (
    <div className="game-header">
      <div className="game-header-logo" onClick={() => router.push("/")}>
        <img className="btn-bg" src={getImgUrl(buttonImgs.homeLogoImg)} />
      </div>
      <div className="game-header-btn-group">
        <div className="game-header-btn" onClick={openTips}>
          <img className="btn-bg"  src={getImgUrl(buttonImgs.topGameDownLoadImg)} />
        </div>
        <div
          className="game-header-btn"
          // onClick={openRegisterModal}
          onClick={openTips}
        >
          <img className="btn-bg"  src={getImgUrl(buttonImgs.topAccountRegisterImg)} />
        </div>
      </div>
    </div>
  );
}
