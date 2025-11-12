"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "./login";
import SurveyModal from "./SurveyModal";
import "./topPage.css";

const Header = () => {
  const { userInfo, login, logout } = useAuth();
  const [showModal, setShowModal] = React.useState(false);
  /* 新增：控制问卷弹窗 */
  const [showSurvey, setShowSurvey] = React.useState(true);

  const nickname = userInfo?.username || userInfo?.phone || "游戏玩家";

  const handleLogout = () => {
    if (!window.confirm("确定要注销登录吗？")) return;
    logout();
    window.dispatchEvent(new CustomEvent("logout:success"));
  };

  const handleLoginSuccess = (token, userData) => {
    login(token, userData);
    setShowModal(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <a href="#" className="logo">游戏活动中心</a>
          </div>

          {/* 改为可控弹窗 */}
          <SurveyModal
            isOpen={showSurvey}
            onClose={() => setShowSurvey(false)}
            onSubmit={(d) => {
              console.log(d);
              setShowSurvey(false); // 提交后也可关闭
            }}
          />

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

      <LoginModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Header;