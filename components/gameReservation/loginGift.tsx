import React, { useState, useRef, useEffect } from "react";
import "./loginGift.css";



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
            { threshold: 0.3 } // 元素30%进入视口时触发动画
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
            {/* 标题元素 - 水平居中，垂直靠上20%，带从上到下动画 */}
            <div
                ref={p1tit1Ref}
                className={`p1tit1 ${isAnimated ? "p1tit1-animate" : ""}`}
            ></div>
            <div
                className={`right-image ${isAnimated ? "right-image-animate" : ""}`}
            ></div>
        </div>
    );
}