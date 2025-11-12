// components/Header/login.jsx
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "./login.css";

// Toast 工具函数（原生实现）
const Toast = {
    show: (message, duration = 3000) => {
        const existingToast = document.querySelector('.login-toast');
        if (existingToast) existingToast.remove();
        const toast = document.createElement('div');
        toast.className = 'login-toast show';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// 常量配置
const CONFIG = {
    COUNTDOWN_TIME: 60,
    TEST_PHONE: "",
    TEST_CODE: "",
};

// localStorage 管理工具
const Storage = {
    setToken: (token) => localStorage.setItem("token", token),
    getToken: () => localStorage.getItem("token"),
    setUserInfo: (userInfo) => {
        localStorage.setItem("user_info", JSON.stringify(userInfo));
        if (userInfo?.uid) localStorage.setItem("user_info_uid", userInfo.uid);
    },
    getUserInfo: () => {
        const str = localStorage.getItem("user_info");
        return str ? JSON.parse(str) : null;
    },
    removeUserInfo: () => {
        localStorage.removeItem("user_info");
        localStorage.removeItem("user_info_uid");
    },
};

/**
 * 登录弹窗组件 - 使用React Portal独立挂载到body
 */
const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [agree, setAgree] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const phoneRef = useRef(null);
    const codeRef = useRef(null);
    const codeTimerRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => phoneRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
        return () => { if (codeTimerRef.current) clearInterval(codeTimerRef.current); };
    }, []);

    const validatePhone = (p) => /^1[3-9]\d{9}$/.test(p);

    const handleGetCode = async () => {
        if (!phone) { setError("请输入手机号码"); phoneRef.current?.focus(); return; }
        if (!validatePhone(phone)) { setError("请输入正确的手机号码"); phoneRef.current?.focus(); return; }

        setIsLoading(true);
        setError("");

        try {
            console.log(`✉️ 向手机号 ${phone} 发送验证码`);
            const response = await fetch("/douxian/web/play_user/send_message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            const result = await response.json();
            console.log(result, "result")
            if (result.code === 0) {
                startCountdown(CONFIG.COUNTDOWN_TIME);
                setError("");
                if (process.env.NODE_ENV === "development") {
                    setTimeout(() => setCode(CONFIG.TEST_CODE), 300);
                }
            } else {
                setError(result.msg || "获取验证码失败");
            }
        } catch (err) {
            setError("网络错误，请检查连接");
            console.error("获取验证码错误:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!phone) { setError("请输入手机号码"); phoneRef.current?.focus(); return; }
        if (!validatePhone(phone)) { setError("请输入正确的手机号码"); phoneRef.current?.focus(); return; }
        if (!code) { setError("请输入验证码"); codeRef.current?.focus(); return; }
        if (!agree) { setError("请勾选用户协议"); return; }

        setIsLoading(true);
        setError("");

        try {
            console.log(`🚀 正在登录: ${phone}`);
            const response = await fetch("/douxian/web/play_user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, code }),
            });

            const result = await response.json();

            if (result.code === 0) {
                // 保存token
                if (result.data?.token) {
                    Storage.setToken(result.data.token);
                    console.log("🔑 Token已保存");
                } else {
                    console.warn("⚠️ 登录接口未返回token");
                }

                // 获取用户信息
                await fetchUserInfo();
                handleClose();
            } else {
                setError(result.msg || "登录失败，请检查验证码");
                setCode("");
                codeRef.current?.focus();
            }
        } catch (err) {
            setError("网络错误，请检查连接");
            console.error("登录错误:", err);
            setCode("");
            codeRef.current?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const token = Storage.getToken();

            if (!token) {
                console.error("❌ 未找到token，无法获取用户信息");
                onLoginSuccess(token, { phone, username: phone });
                return;
            }

            const response = await fetch("/douxian/web/play_user/info", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (result.code === 0 && result.data) {
                // 存储完整用户信息（包含单独存储 uid）
                const userData = result.data;
                Storage.setUserInfo(userData);
                // ✅ 修复：必须传token作为第一个参数
                onLoginSuccess(token, userData);

                // 显示登录成功 toast
                Toast.show(`登录成功！欢迎 ${userData.username || phone}`);
                console.log("👤 用户信息已保存:", userData);
            } else {
                console.error("获取用户信息失败:", result.msg);
                onLoginSuccess(token, { phone, username: phone });
                Toast.show("登录成功，但获取用户信息失败");
            }
        } catch (err) {
            console.error("获取用户信息错误:", err);
            onLoginSuccess(token, { phone, username: phone });
            Toast.show("登录成功，但用户信息获取异常");
        }
    };

    const handleClose = () => {
        onClose();
        setPhone(""); setCode(""); setAgree(false); setError(""); setIsLoading(false);
        if (codeTimerRef.current) { clearInterval(codeTimerRef.current); codeTimerRef.current = null; setCountdown(0); }
    };

    const startCountdown = (time) => {
        setCountdown(time);
        codeTimerRef.current = setInterval(() => {
            setCountdown((t) => {
                if (t <= 1) {
                    clearInterval(codeTimerRef.current);
                    codeTimerRef.current = null;
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    };

    const handleEnterKey = (e, nextRef) => {
        if (e.key === "Enter" && nextRef) {
            nextRef.current?.focus();
        }
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape" && isOpen && !isLoading) {
                handleClose();
            }
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, isLoading]);

    return ReactDOM.createPortal(
        <div className={`login-modal-overlay ${isOpen ? "show" : ""}`} onClick={(e) => e.target === e.currentTarget && !isLoading && handleClose()}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>账号登录</h3>
                    <button className="close-btn" onClick={handleClose} aria-label="关闭" disabled={isLoading}>×</button>
                </div>
                <div className="modal-body">
                    <div className={`error-message ${error ? "show" : ""}`}>
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                    <div className="form-group">
                        <input
                            ref={phoneRef}
                            type="tel"
                            placeholder="请输入手机号"
                            value={phone}
                            onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setPhone(v); setError(""); }}
                            onKeyPress={(e) => e.key === "Enter" && codeRef.current?.focus()}
                            maxLength={11}
                            className="input-field"
                            autoComplete="tel"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div className="form-group code-group">
                        <input
                            ref={codeRef}
                            type="text"
                            placeholder="请输入验证码"
                            value={code}
                            onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); setCode(v); setError(""); }}
                            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                            maxLength={6}
                            className="input-field"
                            autoComplete="one-time-code"
                            disabled={isLoading}
                            required
                        />
                        <button
                            className="code-btn"
                            onClick={handleGetCode}
                            disabled={!phone || countdown > 0 || isLoading}
                        >
                            {countdown > 0 ? `${countdown}秒后重试` : "获取验证码"}
                        </button>
                    </div>
                    <div className="agree-group">
                        <input
                            type="checkbox"
                            id="agree-protocol"
                            checked={agree}
                            onChange={(e) => { setAgree(e.target.checked); setError(""); }}
                            disabled={isLoading}
                        />
                        <label htmlFor="agree-protocol">
                            我已阅读并同意
                            <a href="#" onClick={(e) => e.preventDefault()}>《用户协议》</a>
                        </label>
                    </div>
                    <button
                        className="login-btn-submit"
                        onClick={handleLogin}
                        disabled={!phone || !code || !agree || isLoading}
                    >
                        {isLoading ? <><span className="loading"></span>登录中...</> : "登录"}
                    </button>
                    <p className="register-tip">未注册的手机号将自动注册</p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LoginModal;