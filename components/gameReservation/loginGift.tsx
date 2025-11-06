import React, { useState } from "react";
import "./loginGift.css";

// 侧边栏数据
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

    return (
        <div className="sidebar-game-container">
            {/* 新增的相邻元素 */}
            <div className="sidebar-adjacent-element">
                {/* 可根据需求添加内容 */}
                <div style={{ color: 'var(--text-color)', textAlign: 'center', fontSize: '0.8rem' }}>
                </div>
            </div>
            {/* 主侧边栏 */}
            <div className="sidebar">
                {mockData.sidebarItems.map((item, index) => (
                    <div
                        key={item.id}
                        className={`sidebar-item ${activeSidebarIndex === index ? 'sidebar-item-active' : ''}`}
                        onClick={() => setActiveSidebarIndex(index)}
                    >
                        <div className={`sidebar-image ${activeSidebarIndex === index ? item.currBgClass : item.bgClass}`}></div>
                    </div>
                ))}
            </div>


        </div>
    );
}