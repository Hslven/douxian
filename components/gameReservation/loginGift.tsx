import { useState, useEffect } from "react";
import "./loginGift.css";
import { getImgUrl } from "@/utils/request"; // 假设项目中已有此工具函数（若无，可直接用链接）

// 内部模拟数据（用占位链接填充）
const mockData = {
    sidebarItems: [
        { id: "1", title: "活动中心" },
        { id: "2", title: "新手福利" },
        { id: "3", title: "限时礼包" },
        { id: "4", title: "玩家社区" },
    ],
    backgroundUrl: "https://picsum.photos/id/1015/1920/1080", // 整体背景占位图
    mainAreaBgUrl: "https://picsum.photos/id/1019/1200/800", // 主内容区背景占位图
    mainImages: [
        {
            imageUrl: "https://picsum.photos/id/1025/400/300",
            title: "春日礼包",
            link: "/activity/spring"
        },
        {
            imageUrl: "https://picsum.photos/id/1026/400/300",
            title: "新手引导",
            link: "/guide/newbie"
        },
        {
            imageUrl: "https://picsum.photos/id/1027/400/300",
            title: "充值返利",
            link: "/recharge"
        },
    ],
};

export default function SidebarGame() {
    const [activeSidebarIndex, setActiveSidebarIndex] = useState(0);
    const [displayImages, setDisplayImages] = useState(mockData.mainImages);

    // 侧边栏切换时可自定义逻辑（示例：保持原图片，实际可根据索引筛选）
    useEffect(() => {
        // 这里可根据 activeSidebarIndex 动态筛选图片，示例中直接用全部
        setDisplayImages(mockData.mainImages);
    }, [activeSidebarIndex]);

    return (
        <div
            className="sidebar-game-wrapper"
            style={mockData.backgroundUrl ? {
                backgroundImage: `url(${getImgUrl(mockData.backgroundUrl)})`, // 若 getImgUrl 不存在，直接用 mockData.backgroundUrl
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            } : {}}
        >
            {/* 侧边栏 */}
            <aside className="sidebar">
                {mockData.sidebarItems.map((item, index) => (
                    <div
                        key={item.id}
                        className={`sidebar-item ${activeSidebarIndex === index ? "sidebar-item-active" : ""}`}
                        onClick={() => setActiveSidebarIndex(index)}
                    >
                        {item.title}
                    </div>
                ))}
            </aside>

            {/* 主内容区（带背景图 + 图片展示） */}
            <main
                className="main-content"
                style={mockData.mainAreaBgUrl ? {
                    backgroundImage: `url(${getImgUrl(mockData.mainAreaBgUrl)})`, // 同上，可直接用链接
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat"
                } : {}}
            >
                <div className="images-grid">
                    {displayImages.map((img, idx) => (
                        <img
                            key={idx}
                            src={getImgUrl(img.imageUrl)} // 占位图片链接
                            alt={img.title}
                            className="content-image"
                            onClick={() => img.link && window.open(img.link)} // 点击跳转
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}