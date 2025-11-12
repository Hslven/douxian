// ==================== 修改后的 React 组件 ====================
"use client";
import "./four.css";
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
      className={`page-section ${isActive ? "active" : ""}`}
    >
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
          alt=""
        />
      )}
      {bgError && (
        <div className="page-section-bg-error" />
      )}

      {/* 前景内容 */}
      <div className="page-section-content">
        {glideUrl && (
          <img
            src={glideUrl}
            className="game-glide"
            alt=""
          />
        )}


      </div>
    </div>
  );
}