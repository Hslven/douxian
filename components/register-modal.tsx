import { useState } from "react";
import Modal from "./modal";
import "./register-modal.css";

const RegisterModal = (props) => {
  // 表单数据状态管理
  const [formData, setFormData] = useState({
    phone: "",
    idCard: "",
    name: "",
    password: "",
    agreeTerms: false, // 新增：是否同意协议
  });
  const [registerType, setRegisterType] = useState("phone");

  // 错误信息状态管理
  const [errors, setErrors] = useState<Record<string, any>>({});

  const onFinish = (formData: any) => {
    console.log("onFinish");
  };

  // 手机号格式验证
  const validatePhone = (phone: string) => {
    // 中国大陆手机号正则：以1开头，11位数字
    const reg = /^1[3-9]\d{9}$/;
    return reg.test(phone);
  };

  function validateEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  // 身份证号格式验证
  const validateIdCard = (idCard: string) => {
    // 18位身份证号正则，最后一位可以是数字或X/x
    const reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(idCard);
  };

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // 对于复选框，使用checked属性而非value
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // 输入变化时清除对应字段的错误提示
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 表单整体验证
  const validateForm = () => {
    const newErrors: Record<string, any> = {};

    // 姓名验证
    if (!formData.name.trim()) {
      newErrors.name = "请输入姓名";
    }

    if (registerType === "phone") {
      // 手机号验证
      if (!formData.phone) {
        newErrors.phone = "请输入手机号";
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "请输入正确的手机号格式";
      }
    } else {
      // 邮箱验证
      if (!formData.email) {
        newErrors.email = "请输入邮箱";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "请输入正确的邮箱格式";
      }
    }

    // 身份证号验证
    if (!formData.idCard) {
      newErrors.idCard = "请输入身份证号";
    } else if (!validateIdCard(formData.idCard)) {
      newErrors.idCard = "请输入正确的身份证号格式";
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = "请输入密码";
    } else if (formData.password.length < 6) {
      newErrors.password = "密码长度不能少于6位";
    }

    // 新增：协议同意验证
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "请同意相关协议才能提交";
    }

    // 更新错误信息
    setErrors(newErrors);
    // 如果没有错误，返回true表示验证通过
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    // 验证通过则调用onFinish方法
    if (validateForm()) {
      onFinish?.(formData);
    }
  };

  return (
    <Modal title="示例弹窗" {...props}>
      <div className="register-type-group">
        <div
          className={`register-type ${
            registerType === "phone" ? "register-type-active" : ""
          }`}
          onClick={() => setRegisterType("phone")}
        >
          手机注册
        </div>
        <div
          className={`register-type ${
            registerType === "email" ? "register-type-active" : ""
          }`}
          onClick={() => setRegisterType("email")}
        >
          邮箱注册
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-item">
          <label htmlFor="name">姓名:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "invalid" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {registerType === "phone" && (
          <div className="form-item">
            <label htmlFor="phone">手机号:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "invalid" : ""}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>
        )}
        {registerType === "email" && (
          <div className="form-item">
            <label htmlFor="email">邮箱:</label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "invalid" : ""}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>
        )}

        <div className="form-item">
          <label htmlFor="idCard">身份证号:</label>
          <input
            type="text"
            id="idCard"
            name="idCard"
            value={formData.idCard}
            onChange={handleChange}
            className={errors.idCard ? "invalid" : ""}
          />
          {errors.idCard && (
            <span className="error-message">{errors.idCard}</span>
          )}
        </div>

        <div className="form-item">
          <label htmlFor="password">密码:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "invalid" : ""}
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>
        <div className="form-item agreement-item">
          <label className="agreement-label">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className={errors.agreeTerms ? "invalid-checkbox" : ""}
            />
            我已阅读并同意
            <a href="#" className="agreement-link">
              《用户协议》
            </a>
            和
            <a href="#" className="agreement-link">
              《隐私政策》
            </a>
          </label>
          {errors.agreeTerms && (
            <span className="error-message">{errors.agreeTerms}</span>
          )}
        </div>

        <button type="submit" className="submit-btn">
          提交
        </button>
      </form>

      {/* <div className="flex justify-end space-x-3 mt-6">
          <button
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            onClick={() => setIsModalOpen(false)}
          >
            取消
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setIsModalOpen(false)}
          >
            确认
          </button>
        </div> */}
    </Modal>
  );
};

export default RegisterModal;
