import React from 'react';

interface SidebarItem {
    id: string;
    bgClass: string;
    currBgClass: string;
    name: string;
}

interface SidebarGameContainerProps {
    items: SidebarItem[];
    activeIndex: number;
    onChange: (index: number) => void;
}

const SidebarGameContainer: React.FC<SidebarGameContainerProps> = ({
    items,
    activeIndex,
    onChange,
}) => {
    return (
        <div className="sidebar-game-container">
            <div className="sidebar-adjacent-element">
                <div style={{ color: "#3e1f10", textAlign: "center", fontSize: "12.8px" }}></div>
            </div>
            <div className="sidebar">
                {items?.map((item, index) => (
                    <div
                        key={item.id}
                        className={`sidebar-item ${activeIndex === index ? "sidebar-item-active" : ""}`}
                        onClick={() => {
                            // 点击时立即触发回调，避免延迟
                            onChange(index);
                        }}
                        style={{
                            cursor: 'pointer',
                            // 添加点击反馈，避免用户误以为未触发
                            transition: "background-color 0.2s ease"
                        }}
                    >
                        <div
                            className={`sidebar-image ${activeIndex === index ? item.currBgClass : item.bgClass}`}
                            style={{
                                // 激活状态过渡，确保视觉同步
                                transition: "all 0.3s ease"
                            }}
                        >
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SidebarGameContainer;