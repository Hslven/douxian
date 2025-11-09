// components/Header/topPage.jsx
import React, { useState, useEffect } from "react";
import LoginModal from './login';
import './topPage.css';
import SurveyModal from './SurveyModal';

// localStorage 管理工具（与 login.jsx 保持一致）
const Storage = {
    getToken: () => localStorage.getItem("auth_token"),
    getUserInfo: () => {
        const userInfo = localStorage.getItem("user_info");
        return userInfo ? JSON.parse(userInfo) : null;
    },
};

// Header组件 - 顶部固定导航栏
const Header = () => {
    // 登录状态管理 - 存储完整的用户信息
    const [isLogin, setIsLogin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [nickname, setNickname] = useState("游戏玩家");

    // 组件挂载时检查登录状态（检查 auth_token 是否存在）
    useEffect(() => {
        const token = Storage.getToken();
        const savedUserInfo = Storage.getUserInfo();

        if (token && savedUserInfo) {
            setIsLogin(true);
            setUserInfo(savedUserInfo);
            setNickname(savedUserInfo.username || savedUserInfo.phone || "游戏玩家");
            console.log("✅ 已恢复登录状态:", savedUserInfo);
        }
    }, []);

    // 打开登录弹窗
    const handleLoginClick = () => {
        setShowModal(true);
    };

    // 登录成功回调 - 接收完整的用户信息
    const handleLoginSuccess = (userData) => {
        setIsLogin(true);
        setUserInfo(userData);
        setNickname(userData.username || userData.phone || "游戏玩家");
        console.log("✅ 登录成功，用户信息:", userData);
    };
    const [showSurvey, setShowSurvey] = useState(false);

    const handleSurveySubmit = (answers) => {
        console.log('问卷答案:', answers);
        alert('感谢您的参与！问卷已提交成功。');
    };
    // 注销登录
    const handleLogout = () => {
        if (window.confirm("确定要注销登录吗？")) {
            setIsLogin(false);
            setUserInfo(null);
            setNickname("游戏玩家");

            // 清除所有认证信息（包括token和用户信息）
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_info");

            console.log("🚪 用户已注销");
        }
    };

    return (
        <>
            {/* 头部导航 - 固定定位 */}
            <header className="header">
                <div className="header-content">
                    {/* 左侧logo区域 */}
                    <div className="header-left">
                        <a href="#" className="logo">
                            游戏活动中心
                        </a>
                    </div>
                    <SurveyModal
                        isOpen={showSurvey}
                        onClose={() => setShowSurvey(false)}
                        onSubmit={handleSurveySubmit}
                    />
                    {/* 右侧操作区 */}
                    <div className="header-right">
                        {/* 前往官网链接 */}
                        <a
                            href="#"
                            className="official-link"
                            onClick={(e) => {
                                e.preventDefault();
                                window.open("https://example.com", "_blank");
                            }}
                        >
                            前往官网
                        </a>

                        {/* 登录/用户信息区 */}
                        <div className="auth-area">
                            {!isLogin ? (
                                <button
                                    className="login-btn-main"
                                    onClick={handleLoginClick}
                                    disabled={showModal}
                                >
                                    请登录
                                </button>
                            ) : (
                                <div className="user-info">
                                    <span className="nickname" title={nickname}>
                                        {nickname}
                                    </span>
                                    <button className="logout-btn" onClick={handleLogout}>
                                        注销
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* 登录弹窗 - 完全独立组件 */}
            <LoginModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
};

// 导出Header组件
export default Header;