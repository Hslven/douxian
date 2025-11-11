"use client";

import { useState } from "react";
import Image from "next/image";
import { getImgUrl } from "@/utils/request";
import "./home.css";
import "./hero-home.css";

interface DynamicBackgroundPageProps {
    /** 背景图片URL */
    url: string;
    /** 页面索引（从1开始） */
    index: number;
    /** 当前激活的页码 */
    currentPage: number;
    /** 滑翔图片（可选） */
    glideImg?: any;
    /** 页面名称（可选） */
    pageName?: string;
}

/**
 * 动态背景页面组件
 * 根据URL和索引自动渲染对应页面，并处理激活状态
 */
const DynamicBackgroundPage: React.FC<DynamicBackgroundPageProps> = ({
    url,
    index,
    currentPage,
    glideImg,
    pageName
}) => {
    const [bgLoaded, setBgLoaded] = useState(false);
    const [bgError, setBgError] = useState(false);
    const isActive = currentPage === index;

    return (
        <div
            className="page-section"
            style={{
                minHeight: "100vh",
                height: "100vh",
                transition: "opacity 0.6s ease, transform 0.6s ease",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(20px)",
                position: "relative",
                pointerEvents: isActive ? "auto" : "none",
                zIndex: isActive ? 1 : 0,
            }}
        >
            {url && !bgError && (
                <img
                    className="page-section-bg"
                    src={getImgUrl(url)}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
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
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#000",
                    }}
                />
            )}
            <div style={{ position: "relative", zIndex: 2, height: "100%" }}>

                {pageName && isActive && (
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#fff",
                        fontSize: "48px",
                        fontWeight: "bold",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                        zIndex: 10
                    }}>
                        {/* {pageName} */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DynamicBackgroundPage;