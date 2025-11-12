"use client";
import "./five.css";
import { useState, useEffect } from "react";
import { useLoginModal } from "@/contexts/LoginModalContext";

interface Props {
  bgUrl: string;          // 背景图
  glideUrl?: string;      // 滑翔图（可选）
  title?: string;         // 大标题（可选）
  isActive: boolean;      // 父组件告诉子组件当前是否可见
}

export default function PageGeneric({ bgUrl, glideUrl, title, isActive }: Props) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copyBtnImg] = useState("/images/copy.png");
  const [inviteBtnImg] = useState("/images/invite.png");
  const [overBtnImg] = useState("/images/over.png");

  /* 登录弹窗控制 */
  const { openLogin } = useLoginModal();

  /* 读取 uid（同步本地存储） */
  const getUid = (): string => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("user_info_uid") || "";
  };

  /* 生成邀请链接 */
  const generateInviteLink = () => {
    const uid = getUid();
    return `${window.location.origin}?uid=${uid}`;
  };

  /* 复制链接 */
  const handleCopy = async () => {
    const link = generateInviteLink();
    try {
      await navigator.clipboard.writeText(link);
      alert("复制成功！");
      setShowModal(false);
    } catch (err) {
      console.error("复制失败:", err);
      alert("复制失败，请手动复制");
    }
  };

  /* 邀请按钮点击：无 uid 先登录 */
  const handleInviteClick = () => {
    if (!getUid()) {
      openLogin();          // 弹出登录框
      return;
    }
    setShowModal(true);     // 已有 uid，直接显示弹窗
  };

  /* 结束按钮点击 */
  const handleOverClick = () => {
    console.log("点击了结束按钮");
  };

  /* 点击遮罩关闭弹窗 */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setShowModal(false);
  };

  return (
    <div className={`page-section ${isActive ? "active" : ""}`}>
      {/* 背景图 */}
      {!bgError && (
        <img
          src={bgUrl}
          className={`page-section-bg ${bgLoaded ? "loaded" : ""}`}
          onLoad={() => setBgLoaded(true)}
          onError={() => {
            setBgError(true);
            setBgLoaded(true);
          }}
          alt="背景图"
        />
      )}
      {bgError && <div className="page-section-bg-error" />}

      {/* 前景内容 */}
      <div className="page-content">
        {glideUrl && <img src={glideUrl} className="game-glide" alt="" />}

        {/* 按钮容器 */}
        <div className="button-container">
          <img
            src={inviteBtnImg}
            className="btn invite-btn"
            onClick={handleInviteClick}
            alt="邀请"
          />
        </div>
      </div>

      {/* 复制弹窗 */}
      {showModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <p className="invite-link-text">{generateInviteLink()}</p>
            <img
              src={copyBtnImg}
              className="btn copy-btn"
              onClick={handleCopy}
              alt="复制"
            />
          </div>
        </div>
      )}
    </div>
  );
}