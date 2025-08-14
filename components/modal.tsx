import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./modal.css"; // 样式文件
import Image from "next/image";
import modal_title_left from "../public/images/modal_title_left.png";
import modal_title_right from "../public/images/modal_title_right.png";

const Modal = ({
  visible,
  title,
  children,
  onClose,
  maskClosable = true,
  // showCloseButton = true,
  // width = "520px",
  className = "",
  style = {},
}: // footer,
any) => {
  const portalRootRef = useRef(null);
  const modalRef = useRef(null);

  // 创建 Portal 容器
  useEffect(() => {
    // 创建 Portal 根元素
    portalRootRef.current = document.createElement("div");
    portalRootRef.current.id = "modal-portal-root";
    document.body.appendChild(portalRootRef.current);

    return () => {
      // 组件卸载时移除 Portal 根元素
      if (portalRootRef.current) {
        document.body.removeChild(portalRootRef.current);
      }
    };
  }, []);
  // 处理 ESC 按键关闭
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (visible) {
      document.addEventListener("keydown", handleEsc);
      // 禁止背景滚动
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      // 恢复背景滚动
      document.body.style.overflow = "";
    };
  }, [visible, onClose]);

  // 点击遮罩层关闭
  const handleMaskClick = (e) => {
    if (e.target === e.currentTarget && maskClosable) {
      onClose();
    }
  };

  if (!visible || !portalRootRef.current) return null;

  const modalContent = (
    <div className="modal-container">
      {/* 遮罩层 */}
      <div
        className="modal-mask"
        onClick={handleMaskClick}
        data-testid="modal-mask"
      />

      {/* 弹窗主体 */}
      <div
        className={`modal-content ${className}`}
        style={{
          // width,
          ...style,
        }}
      >
        {/* 标题区域 */}
        {!!title && (
          <div className="modal-header">
            <Image className="" src={modal_title_left} alt="" />
            {title}
            <Image className="" src={modal_title_right} alt="" />
          </div>
        )}
        <button
          onClick={onClose}
          className="modal-close-button"
          aria-label="Close"
        >
          {/* &times; */}
        </button>

        {/* 内容区域 */}
        <div className="modal-body">{children}</div>

        {/* 底部区域 */}
        {/* {footer && <div className="modal-footer">{footer}</div>} */}
      </div>
    </div>
  );

  // 使用 Portal 渲染到 body 下
  return ReactDOM.createPortal(modalContent, portalRootRef.current);
};

export default Modal;
