// contexts/LoginModalContext.tsx
"use client"; // ✅ 必须加在文件最顶部

import React, { createContext, useContext, useState, type ReactNode } from 'react';

import LoginModal from '../components/ui/login';


interface LoginModalContextType {
  openLogin: () => void;
  closeLogin: () => void;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export const LoginModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLogin = () => setIsOpen(true);
  const closeLogin = () => setIsOpen(false);

  return (
    <LoginModalContext.Provider value={{ openLogin, closeLogin }}>
      {children}
      <LoginModal isOpen={isOpen} onClose={closeLogin} onLoginSuccess={(user) => {
        console.log('登录成功', user);
        closeLogin();
      }} />
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => {
  const ctx = useContext(LoginModalContext);
  if (!ctx) throw new Error('useLoginModal must be used within LoginModalProvider');
  return ctx;
};