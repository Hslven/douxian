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

  /* 1. 检查并更新预约状态 */
  const checkReservationStatus = () => {
    const userStr = localStorage.getItem("user_info");
    if (userStr) {
      try {
        const { isReserved } = JSON.parse(userStr);
        if (isReserved) {
          setBtnImg("/images/yyy.png");
        } else {
          setBtnImg("/images/lj.png");
        }
      } catch {
        setBtnImg("/images/lj.png");
      }
    } else {
      setBtnImg("/images/lj.png");
    }
  };

  /* 2. 初始化：检查预约状态 + 拉取后端配置图 */
  useEffect(() => {
    checkReservationStatus();

    request.get("/douxian/web/button")
      .then((res: any) => {
        if (res?.img) setBtnImg(getImgUrl(res.img));
      })
      .catch(() => { });
  }, []);

  /* 3. 监听登录成功事件：登录后立即检查状态 */
  useEffect(() => {
    const onLoginSuccess = () => {
      checkReservationStatus();
    };

    window.addEventListener("login:success", onLoginSuccess);
    return () => window.removeEventListener("login:success", onLoginSuccess);
  }, []);

  /* 4. 监听注销广播 */
  useEffect(() => {
    const onLogout = () => {
      const info = JSON.parse(localStorage.getItem("user_info") || "{}");
      delete info.isReserved;
      localStorage.setItem("user_info", JSON.stringify(info));
      setBtnImg("/images/lj.png");
    };
    window.addEventListener("logout:success", onLogout);
    return () => window.removeEventListener("logout:success", onLogout);
  }, []);

/* 5. 预约逻辑 */
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

  // ✅ 从 URL 中取 uid（如果存在）
  const params = new URLSearchParams(window.location.search);
  const urlUid = params.get("uid");

  try {
    await request.post("/douxian/web/subscribe", {
      subscribePhone: phone,
      inviteUserUid: uid,
      ...(urlUid ? { fromUid: urlUid } : {}), // ✅ 如果 URL 里有 uid，加上去
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