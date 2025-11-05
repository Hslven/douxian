import { useState } from "react";
import "./loginGift.css";

// 侧边栏数据（仅保留侧边栏相关配置）
const mockData = {
  sidebarItems: [
    { id: "1", bgClass: "sidebar-bg-1", currBgClass: "sidebar-bg-curr-1" },
    { id: "2", bgClass: "sidebar-bg-2", currBgClass: "sidebar-bg-curr-2" },
    { id: "3", bgClass: "sidebar-bg-3", currBgClass: "sidebar-bg-curr-3" },
    { id: "4", bgClass: "sidebar-bg-4", currBgClass: "sidebar-bg-curr-4" },
    { id: "5", bgClass: "sidebar-bg-5", currBgClass: "sidebar-bg-curr-5" },
  ],
};

export default function SidebarGame() {
  // 默认选中第一个侧边栏项
  const [activeSidebarIndex, setActiveSidebarIndex] = useState(0);

  return (
    <div className="sidebar-game-wrapper">
      {/* 侧边栏核心部分 */}
      <aside className="sidebar">
        {mockData.sidebarItems.map((item, index) => (
          <div
            key={item.id}
            className={`sidebar-item ${activeSidebarIndex === index ? "sidebar-item-active" : ""}`}
            onClick={() => setActiveSidebarIndex(index)}
          >
            {/* 图片根据选中状态切换：默认用btnnavX，选中用btnnavcurrX */}
            <div 
              className={`sidebar-image ${
                activeSidebarIndex === index ? item.currBgClass : item.bgClass
              }`} 
              alt={`侧边栏${index + 1}`}
            ></div>
          </div>
        ))}
      </aside>


    </div>
  );
}