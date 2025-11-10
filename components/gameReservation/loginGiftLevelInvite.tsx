import React, { useState, useRef, useEffect } from "react";
import "./loginGiftLevelInvite.css";
import { useLoginModal } from '@/contexts/LoginModalContext';

export default function SidebarGame() {
    const [activeSidebarIndex, setActiveSidebarIndex] = useState(0);
    const p1tit1Ref = useRef(null);
    const gameCarouselContainerRef = useRef(null);
    const [isAnimated, setIsAnimated] = useState(false);
    const [itemAnimateIndex, setItemAnimateIndex] = useState(0);
  const { openLogin } = useLoginModal();

    const carouselItems = [
        { image: "https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/p2img1.png" },
        { image: "https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/p2img2.png" },
    ];
    const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

    const handlePrev = () => {
        const newIndex = currentCarouselIndex === 0 ? carouselItems.length - 1 : currentCarouselIndex - 1;
        setCurrentCarouselIndex(newIndex);
        triggerItemAnimate(newIndex);
    };

    const handleNext = () => {
        const newIndex = currentCarouselIndex === carouselItems.length - 1 ? 0 : currentCarouselIndex + 1;
        setCurrentCarouselIndex(newIndex);
        triggerItemAnimate(newIndex);
    };

    const triggerItemAnimate = (index) => {
        setItemAnimateIndex(-1);
        setTimeout(() => setItemAnimateIndex(index), 50);
    };

    // 立即邀请点击处理
    const handleInviteClick = async () => {
        // openLogin()
        try {
            const currentUrl = window.location.href;
            const uid = localStorage.getItem('user_info_uid');

            if (!uid) {
              openLogin()
                return;
            }

            const separator = currentUrl.includes('?') ? '&' : '?';
            const inviteUrl = `${currentUrl}${separator}uid=${uid}`;

            await navigator.clipboard.writeText(inviteUrl);
            // alert('邀请链接已复制到剪贴板！');
        } catch (error) {
            console.error('复制失败:', error);
            // alert('复制失败，请手动复制');
        }
    };

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
            { threshold: 0.3 }
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
            <div
                ref={p1tit1Ref}
                className={`p1tit1-three ${isAnimated ? "p1tit1-animate-three" : ""}`}
            ></div>
            <p className="p3txt1 downxia">
                登录游戏并邀请指定数量好友登录游戏，被邀请好友角色需要达到30级，即可领取对应奖励。
                <span>Q币有限，先到先得</span>
            </p>
            <div className="qb-container">
                <div className="qb-card">
                    <div className="qb-card-title">
                        <div className="qb-title">邀请1人</div>
                        <div className="qb-number">(0/1)</div>
                    </div>
                    <img src="https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/p3img1.png" alt="2Q币" className="qb-icon" />
                </div>

                <div className="qb-card" style={{ margin: "0 80px" }}>
                    <div className="qb-card-title">
                        <div className="qb-title">邀请3人</div>
                        <div className="qb-number">(0/3)</div>
                    </div>
                    <img src="https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/p3img2.png" alt="3Q币" className="qb-icon" />
                </div>

                <div className="qb-card">
                    <div className="qb-card-title">
                        <div className="qb-title">邀请5人</div>
                        <div className="qb-number">(0/5)</div>
                    </div>
                    <img src="https://wegame.gtimg.com/tgp_act/release/wegame/dx20250815/images/p3img3.png" alt="5Q币" className="qb-icon" />
                </div>
            </div>
            <div
                className="invite-btn"
                onClick={handleInviteClick}
                style={{ cursor: 'pointer' }}
            ></div>
        </div>
    );
}