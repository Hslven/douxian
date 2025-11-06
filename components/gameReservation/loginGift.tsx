import React, { useState, useRef, useEffect } from "react";
import "./loginGift.css";

const mockData = {
  sidebarItems: [
    { id: "1", bgClass: "sidebar-bg-1", currBgClass: "sidebar-bg-curr-1", name: "宗门争霸" },
    { id: "2", bgClass: "sidebar-bg-2", currBgClass: "sidebar-bg-curr-2", name: "御空飞行" },
    { id: "3", bgClass: "sidebar-bg-3", currBgClass: "sidebar-bg-curr-3", name: "PVP竞技场" },
    { id: "4", bgClass: "sidebar-bg-4", currBgClass: "sidebar-bg-curr-4", name: "坐骑养成" },
    { id: "5", bgClass: "sidebar-bg-5", currBgClass: "sidebar-bg-curr-5", name: "情缘系统" },
  ],
};

export default function SidebarGame() {
  const [activeSidebarIndex, setActiveSidebarIndex] = useState(0);
  const p1tit1Ref = useRef(null);
  const [isAnimated, setIsAnimated] = useState(false);

  // 监听滚动，触发/重置动画
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAnimated(true);
          } else {
            setIsAnimated(false);
          }
        });
      },
      { threshold: 0.3 } // 垂直30%视口时触发
    );

    if (p1tit1Ref.current) {
      observer.observe(p1tit1Ref.current);
    }

    return () => {
      if (p1tit1Ref.current) observer.unobserve(p1tit1Ref.current);
    };
  }, []);

  return (
    <div className="section_cn">
      <div
        ref={p1tit1Ref}
        className={`p1tit1 ${isAnimated ? "p1tit1-animate" : ""}`}
      ></div>
      <div className="sidebar-game-container">
        <div className="sidebar-adjacent-element">
          <div style={{ color: "#3e1f10", textAlign: "center", fontSize: "12.8px" }}></div>
        </div>
        <div className="sidebar">
          {mockData.sidebarItems.map((item, index) => (
            <div
              key={item.id}
              className={`sidebar-item ${
                activeSidebarIndex === index ? "sidebar-item-active" : ""
              }`}
              onClick={() => setActiveSidebarIndex(index)}
            >
              <div
                className={`sidebar-image ${
                  activeSidebarIndex === index ? item.currBgClass : item.bgClass
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}