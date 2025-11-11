"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

/* 工具函数，与 Header 保持一致 */
const Storage = {
  getToken: () => localStorage.getItem("token"),
  getUserInfo: () => {
    try {
      return JSON.parse(localStorage.getItem("user_info") || "null");
    } catch {
      return null;
    }
  },
  setToken: (t) => (t ? localStorage.setItem("token", t) : localStorage.removeItem("token")),
  setUserInfo: (u) => (u ? localStorage.setItem("user_info", JSON.stringify(u)) : localStorage.removeItem("user_info")),
  clear: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("user_info_uid");
  },
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // 首次挂载：同步 localStorage -> Context
  useEffect(() => {
    setToken(Storage.getToken());
    setUserInfo(Storage.getUserInfo());
  }, []);

  // 登录成功：写缓存 + 写 Context
  const login = (tk, info) => {
    Storage.setToken(tk);
    Storage.setUserInfo(info);
    setToken(tk);
    setUserInfo(info);
  };

  // 注销
  const logout = () => {
    /* 1. 清掉所有登录相关缓存 */
    Storage.clear();          // token / user_info / user_info_uid 已删
    /* 2. 把预约标记也清掉（如果你单独存了） */
    localStorage.removeItem("reserved");   // 若你之前单独存过
    setToken(null);
    setUserInfo(null);
    /* 3. 触发全局重置按钮图（见下面 Hooks） */
    window.dispatchEvent(new Event("auth:logout")); // 广播事件，供按钮图复位
  };

  return (
    <AuthContext.Provider value={{ token, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* 钩子：其它组件直接 const { userInfo, login, logout } = useAuth(); */
export const useAuth = () => useContext(AuthContext);