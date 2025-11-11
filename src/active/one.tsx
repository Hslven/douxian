"use client";
import "./one.css";
import { useState, useEffect } from "react";
import request, { getImgUrl } from "@/utils/request";
import { useLoginModal } from "@/contexts/LoginModalContext";

interface Props {
  bgUrl: string;
  glideUrl?: string;
  title?: string;
  isActive: boolean;
}

export default function PageGeneric({ bgUrl, glideUrl, title, isActive }: Props) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [btnImg, setBtnImg] = useState("/images/lj.png");
  const { openLogin } = useLoginModal();

  /* 1. 初始化：优先读本地 isReserved，再拉后端配置图 */
  useEffect(() => {
    const userStr = localStorage.getItem("user_info");
    if (userStr) {
      try {
        const { isReserved } = JSON.parse(userStr);
        if (isReserved) setBtnImg("/images/yyy.png");
      } catch {}
    }

    request.get("/douxian/web/button")
      .then((res: any) => {
        if (res?.img) setBtnImg(getImgUrl(res.img));
      })
      .catch(() => {});
  }, []);

  /* 2. 监听 Header 注销广播，复位预约状态 */
  useEffect(() => {
    const onLogout = () => {
      const info = JSON.parse(localStorage.getItem("user_info") || "{}");
      delete info.isReserved;               // 清预约标记
      localStorage.setItem("user_info", JSON.stringify(info));
      setBtnImg("/images/lj.png");          // 换回未预约图
    };
    window.addEventListener("logout:success", onLogout);
    return () => window.removeEventListener("logout:success", onLogout);
  }, []);

  /* 3. 预约逻辑 */
  const handleSubscribe = async () => {
    const uid = localStorage.getItem("user_info_uid");
    if (!uid) {
      openLogin();
      return;
    }

    let phone = "";
    try {
      const info = JSON.parse(localStorage.getItem("user_info") || "{}");
      phone = info.phone;
    } catch {}

    if (!phone) {
      alert("请先绑定手机号");
      return;
    }

    try {
      await request.post("/douxian/web/subscribe", {
        subscribePhone: phone,
        inviteUserUid: uid,
      });
      /* 成功：换图 + 写本地 */
      setBtnImg("/images/yyy.png");
      const info = JSON.parse(localStorage.getItem("user_info") || "{}");
      info.isReserved = true;
      localStorage.setItem("user_info", JSON.stringify(info));
    } catch (e: any) {
      alert(e?.message || "预约失败，请重试");
    }
  };

  const isReserved = btnImg === "/images/yyy.png";

  return (
    <div className={`page-section ${isActive ? "active" : ""}`}>
      {!bgError && (
        <img
          src={bgUrl}
          className={`page-section-bg ${bgLoaded ? "loaded" : ""}`}
          onLoad={() => setBgLoaded(true)}
          onError={() => {
            setBgError(true);
            setBgLoaded(true);
          }}
        />
      )}
      {bgError && <div className="page-section__fallback" />}

      <div className="page-section__content">
        {glideUrl && <img src={glideUrl} className="game-glide" alt="" />}

        {/* 右下角按钮：已预约时禁止点击 + 灰度样式 */}
        <div
          className={`page-section__btn ${isReserved ? "reserved" : ""}`}
          onClick={isReserved ? undefined : handleSubscribe}
        >
          <img src={btnImg} alt="btn" />
        </div>
      </div>
    </div>
  );
}