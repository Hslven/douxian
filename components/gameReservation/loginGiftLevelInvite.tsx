import React, { useState, useRef, useEffect } from "react";
import "./loginGiftLevelInvite.css";

export default function SidebarGame() {
    const [activeSidebarIndex, setActiveSidebarIndex] = useState(0);
    const p1tit1Ref = useRef(null);
    const gameCarouselContainerRef = useRef(null);
    const [isAnimated, setIsAnimated] = useState(false);
    // 新增：控制轮播项切换动画
    const [itemAnimateIndex, setItemAnimateIndex] = useState(0);

    // 轮播数据
    const carouselItems = [
        { image: "https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/p2img1.png" },
        { image: "https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/p2img2.png" },
    ];
    const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

    // 轮播控制逻辑：切换时重新触发当前项动画
    const handlePrev = () => {
        const newIndex = currentCarouselIndex === 0 ? carouselItems.length - 1 : currentCarouselIndex - 1;
        setCurrentCarouselIndex(newIndex);
        triggerItemAnimate(newIndex); // 触发新项动画
    };

    const handleNext = () => {
        const newIndex = currentCarouselIndex === carouselItems.length - 1 ? 0 : currentCarouselIndex + 1;
        setCurrentCarouselIndex(newIndex);
        triggerItemAnimate(newIndex); // 触发新项动画
    };

    // 触发轮播项入场动画
    const triggerItemAnimate = (index) => {
        setItemAnimateIndex(-1); // 先重置动画状态
        setTimeout(() => setItemAnimateIndex(index), 50); // 延迟触发，确保动画重新执行
    };

    // 监听视口：触发标题和轮播容器入场动画
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
        <div className="section_cn-three">
            {/* 标题元素 */}
            <div
                ref={p1tit1Ref}
                className={`p1tit1-three ${isAnimated ? "p1tit1-animate-three" : ""}`}
            ></div>
            {/* 说明文字 */}
            <p className="p3txt1 downxia">登录游戏并邀请指定数量好友登录游戏，被邀请好友角色需要达到30级，即可领取对应奖励。<span>Q币有限，先到先得</span></p>
            {/* Q币奖励卡片容器 */}
            <div className="qb-container">
                <div className="qb-card">
                    <div className="qb-card-title">
                        <div className="qb-title">
                            邀请1人
                        </div>
                        <div className="qb-number">
                            (0/1)
                        </div>
                    </div>
                    <img src="https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/p3img1.png" alt="2Q币" className="qb-icon" />
                </div>

                <div className="qb-card" style={{ margin: "0 80px" }}>
                    <div className="qb-card-title">
                        <div className="qb-title">
                            邀请3人
                        </div>
                        <div className="qb-number">
                            (0/3)
                        </div>
                    </div>
                    <img src="https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/p3img2.png" alt="3Q币" className="qb-icon" />
                </div>
                <div className="qb-card">
                    <div className="qb-card-title">
                        <div className="qb-title">
                            邀请5人
                        </div>
                        <div className="qb-number">
                            (0/5)
                        </div>
                    </div>
                    <img src="https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/p3img3.png" alt="5Q币" className="qb-icon" />
                </div>
            </div>
            {/* 立即邀请按钮 */}
            <div className="invite-btn"></div>
        </div>
    );
}