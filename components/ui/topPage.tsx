"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "./login";
import SurveyModal from "./SurveyModal";
import "./topPage.css";

const Header = () => {
  /* ① 顶层解构：始终拿到最新函数引用 */
  const { userInfo, login, logout } = useAuth();
  const [showModal, setShowModal] = React.useState(false);

  const nickname = userInfo?.username || userInfo?.phone || "游戏玩家";

  /* ② 注销广播 */
  const handleLogout = () => {
    if (!window.confirm("确定要注销登录吗？")) return;
    logout(); // 清缓存 + 置空 Context
    window.dispatchEvent(new CustomEvent("logout:success"));
  };

  /* ③ 登录成功回调：必须顶层写法，直接把 login 传进去 */
  const handleLoginSuccess = (token, userData) => {
    login(token, userData); // 立即更新 Context
    setShowModal(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <a href="#" className="logo">游戏活动中心</a>
          </div>

          <SurveyModal isOpen={false} onClose={() => {}} onSubmit={(d) => console.log(d)} />

          <div className="header-right">
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

            <div className="auth-area">
              {!userInfo ? (
                <button className="login-btn-main" onClick={() => setShowModal(true)}>
                  请登录
                </button>
              ) : (
                <div className="user-info">
                  <span className="nickname" title={nickname}>{nickname}</span>
                  <button className="logout-btn" onClick={handleLogout}>
                    注销
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ④ 把顶层写好的回调传进去 */}
      <LoginModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Header;