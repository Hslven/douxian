"use client";
import "./six.css";
import { useState } from "react";

interface Props {
  bgUrl: string;
  glideUrl?: string;
  title?: string;
  isActive: boolean;
}

export default function PageGeneric({
  bgUrl,
  glideUrl,
  title = "默认大标题",
  isActive,
}: Props) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <>
      {/* 1. 固定定位锚点（与之前完全一致） */}
  
      {/* 2. 页面主体 */}
      <div className={`page-section ${isActive ? "active" : ""}`}>
        {/* 背景图 */}
        {!bgError && (
          <img
            src={bgUrl}
            className={`page-section-bg-six ${bgLoaded ? "loaded" : ""}`}
            onLoad={() => setBgLoaded(true)}
            onError={() => {
              setBgError(true);
              setBgLoaded(true);
            }}
            alt=""
          />
        )}
        {bgError && <div className="page-section-error" />}

        {/* 前景内容 */}
        <div className="page-content">
          {/* 滑翔装饰图 */}
          {glideUrl && (
            <img src={glideUrl} className="game-glide" alt="" />
          )}


          {/* ===== 其他内容示例 ===== */}

          <div className="fixed-anchor">
  <img src="/images/rz.png" className="fixed-btn" alt="rz" />
 
</div>
 <div className="fixed-score">{score}</div>
        </div>
      </div>
    </>
  );
}