

"use client";
import "./three.css";
import { useState } from "react";

interface Props {
  bgUrl: string;          // 背景图
  glideUrl?: string;      // 滑翔图（可选）
  title?: string;         // 大标题（可选）
  isActive: boolean;      // 父组件告诉子组件当前是否可见
}

export default function PageGeneric({ bgUrl, glideUrl, title, isActive }: Props) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);

  return (
    <div
      className="page-section"
      style={{
        minHeight: "100vh",
        height: "100vh",
        position: "relative",
        opacity: isActive ? 1 : 0,
        transform: isActive ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        pointerEvents: isActive ? "auto" : "none",
        zIndex: isActive ? 1 : 0,
      }}
    >
      {/* 背景图 */}
      {!bgError && (
        <img
          src={bgUrl}
          className="page-section-bg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: bgLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          onLoad={() => setBgLoaded(true)}
          onError={() => {
            setBgError(true);
            setBgLoaded(true);
          }}
        />
      )}
      {bgError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#000",
          }}
        />
      )}

      {/* 前景内容 */}
      <div style={{ position: "relative", zIndex: 2, height: "100%" }}>
        {glideUrl && (
          <img
            src={glideUrl}
            className="game-glide"
            alt=""
            style={{ pointerEvents: "none", maxWidth: "100%" }}
          />
        )}

        {title && isActive && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#fff",
              fontSize: "48px",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {title}
          </div>
        )}
      </div>
    </div>
  );
}