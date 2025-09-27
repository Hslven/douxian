import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./tips-modal.css"; // 样式文件

const TipsModal = ({ tips, visible, onClose, style = {} }: any) => {
  const portalRootRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef(null);

  // 创建 Portal 容器
  useEffect(() => {
    // 创建 Portal 根元素
    portalRootRef.current = document.createElement("div");
    portalRootRef.current.id = "tips-modal-portal-root";
    document.body.appendChild(portalRootRef.current);

    return () => {
      // 组件卸载时移除 Portal 根元素
      if (portalRootRef.current) {
        document.body.removeChild(portalRootRef.current);
      }
    };
  }, []);
  // 处理 ESC 按键关闭
  //   useEffect(() => {
  //     const handleEsc = (e) => {
  //       if (e.key === "Escape") onClose();
  //     };

  //     if (visible) {
  //       document.addEventListener("keydown", handleEsc);
  //       // 禁止背景滚动
  //       document.body.style.overflow = "hidden";
  //     }

  //     return () => {
  //       document.removeEventListener("keydown", handleEsc);
  //       // 恢复背景滚动
  //       document.body.style.overflow = "";
  //     };
  //   }, [visible, onClose]);

  // 点击遮罩层关闭
  //   const handleMaskClick = (e) => {
  //     if (e.target === e.currentTarget && maskClosable) {
  //       onClose();
  //     }
  //   };

  if (!visible || !portalRootRef.current) return null;

  const modalContent = (
    <div className="modal-container">
      <div
        className="modal-mask"
        // onClick={handleMaskClick}
        data-testid="modal-mask"
      />
      <div
        className="tips-modal-content"
        style={{
          // width,
          ...style,
        }}
      >
        <button
          onClick={onClose}
          className="tips-modal-close-button"
          aria-label="Close"
        ></button>
        <div className="tips-modal-msg">{tips}</div>
        <div className="tips-modal-btn" onClick={onClose}></div>
      </div>
    </div>
  );

  // 使用 Portal 渲染到 body 下
  return ReactDOM.createPortal(modalContent, portalRootRef.current);
};

export default TipsModal;
