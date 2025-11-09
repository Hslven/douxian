// components/Survey/SurveyModal.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./SurveyModal.css";
import { mockSurveyData, mockSubmitResponse } from "./mockSurveyData";

// localStorage 管理工具
const Storage = {
    getToken: () => localStorage.getItem("auth_token"),
};

/**
 * 问卷调查弹窗组件
 * @param {boolean} isOpen - 是否打开弹窗
 * @param {function} onClose - 关闭弹窗回调
 * @param {function} onSubmit - 提交问卷回调(answers)
 */
const SurveyModal = ({ isOpen, onClose, onSubmit }) => {
    // 问卷状态管理
    const [surveyData, setSurveyData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 组件挂载时获取问卷数据
    useEffect(() => {
        if (isOpen) {
            // 开发环境使用 mock 数据
            if (process.env.NODE_ENV === "development") {
                setTimeout(() => {
                    setSurveyData(mockSurveyData.data);
                    console.log("📋 问卷数据已加载 (mock):", mockSurveyData.data);
                }, 500);
            } else {
                fetchSurveyData();
            }
        } else {
            // 关闭时重置状态
            setCurrentQuestion(0);
            setAnswers({});
            setError("");
        }
    }, [isOpen]);

    // 自动聚焦当前题目
    useEffect(() => {
        if (isOpen && surveyData?.questions?.length > 0) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, surveyData]);

    // 获取问卷数据
    const fetchSurveyData = async () => {
        setIsLoading(true);
        setError("");

        try {
            const token = Storage.getToken();
            const response = await fetch("/douxian/web/survey/questions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
            });

            const result = await response.json();

            if (result.code === 0 && result.data) {
                setSurveyData(result.data);
                console.log("📋 问卷数据已加载:", result.data);
            } else {
                setError(result.msg || "获取问卷失败");
            }
        } catch (err) {
            setError("网络错误，请检查连接");
            console.error("获取问卷错误:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 选择答案
    const handleSelectAnswer = (questionId, optionValue) => {
        const question = surveyData.questions[currentQuestion];

        if (question.type === "multiple") {
            // 多选题
            setAnswers(prev => {
                const currentAnswers = prev[questionId] || [];
                if (currentAnswers.includes(optionValue)) {
                    return {
                        ...prev,
                        [questionId]: currentAnswers.filter(v => v !== optionValue)
                    };
                } else {
                    return {
                        ...prev,
                        [questionId]: [...currentAnswers, optionValue]
                    };
                }
            });
        } else {
            // 单选题
            setAnswers(prev => ({
                ...prev,
                [questionId]: optionValue
            }));
        }
        setError("");
    };

    // 下一题
    const handleNext = () => {
        const question = surveyData.questions[currentQuestion];
        const answer = answers[question.id];

        // 验证是否已答题
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
            setError("请先选择一个选项");
            return;
        }

        if (currentQuestion < surveyData.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    // 上一题
    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    // 提交问卷
    const handleSubmit = async () => {
        const question = surveyData.questions[currentQuestion];
        const answer = answers[question.id];

        // 验证是否已答题
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
            setError("请先选择一个选项");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            // 开发环境使用 mock 提交
            if (process.env.NODE_ENV === "development") {
                setTimeout(() => {
                    console.log("✅ 问卷提交成功 (mock):", answers);
                    onSubmit(answers);
                    handleClose();
                    alert(mockSubmitResponse.msg);
                    setIsSubmitting(false);
                }, 800);
                return;
            }

            const token = Storage.getToken();
            const response = await fetch("/douxian/web/survey/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    surveyId: surveyData.id,
                    answers: answers
                }),
            });

            const result = await response.json();

            if (result.code === 0) {
                console.log("✅ 问卷提交成功:", answers);
                onSubmit(answers);
                handleClose();
            } else {
                setError(result.msg || "提交失败");
            }
        } catch (err) {
            setError("网络错误，请检查连接");
            console.error("提交问卷错误:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 关闭弹窗
    const handleClose = () => {
        onClose();
        setCurrentQuestion(0);
        setAnswers({});
        setError("");
    };

    // ESC键关闭
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape" && isOpen && !isLoading && !isSubmitting) {
                handleClose();
            }
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, isLoading, isSubmitting]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="survey-modal-overlay show" onClick={handleClose}>
            <div className="survey-modal" onClick={(e) => e.stopPropagation()}>
                {/* 关闭按钮 */}
                <button className="survey-close-btn" onClick={handleClose} aria-label="关闭">
                    ×
                </button>

                {/* 问卷内容 */}
                <div className="survey-content">
                    {isLoading ? (
                        <div className="survey-loading">
                            <div className="loading-spinner"></div>
                            <p>正在加载问卷...</p>
                        </div>
                    ) : surveyData ? (
                        <>
                            {/* 问卷标题 */}
                            <div className="survey-header">
                                <h2>{surveyData.title || "用户满意度调查"}</h2>
                                <div className="survey-progress">
                                    <span className="current">{currentQuestion + 1}</span>
                                    <span className="separator">/</span>
                                    <span className="total">{surveyData.questions.length}</span>
                                </div>
                            </div>

                            {/* 进度条 */}
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${((currentQuestion + 1) / surveyData.questions.length) * 100}%`
                                    }}
                                ></div>
                            </div>

                            {/* 当前题目 */}
                            <div className="question-container">
                                <div className="question-card">
                                    <h3 className="question-title">
                                        <span className="question-number">Q{currentQuestion + 1}</span>
                                        {surveyData.questions[currentQuestion].question}
                                    </h3>

                                    <div className="options-list">
                                        {surveyData.questions[currentQuestion].options.map((option) => {
                                            const questionId = surveyData.questions[currentQuestion].id;
                                            const isSelected = Array.isArray(answers[questionId])
                                                ? answers[questionId].includes(option.value)
                                                : answers[questionId] === option.value;

                                            return (
                                                <label
                                                    key={option.value}
                                                    className={`option-item ${isSelected ? "selected" : ""}`}
                                                >
                                                    <input
                                                        type={surveyData.questions[currentQuestion].type === "multiple" ? "checkbox" : "radio"}
                                                        name={`question-${questionId}`}
                                                        value={option.value}
                                                        checked={isSelected}
                                                        onChange={() => handleSelectAnswer(questionId, option.value)}
                                                        disabled={isSubmitting}
                                                    />
                                                    <span className="option-text">{option.text}</span>
                                                    <span className="checkmark"></span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* 错误提示 */}
                            {error && (
                                <div className="error-message show">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* 操作按钮 */}
                            <div className="survey-actions">
                                <button
                                    className="prev-btn"
                                    onClick={handlePrev}
                                    disabled={currentQuestion === 0 || isSubmitting}
                                >
                                    上一题
                                </button>

                                {currentQuestion === surveyData.questions.length - 1 ? (
                                    <button
                                        className="submit-btn"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="loading-spinner"></span>
                                                提交中...
                                            </>
                                        ) : (
                                            "提交问卷"
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        className="next-btn"
                                        onClick={handleNext}
                                        disabled={isSubmitting}
                                    >
                                        下一题
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="survey-error">
                            <p>{error || "加载问卷失败"}</p>
                            <button className="retry-btn" onClick={fetchSurveyData}>
                                重新加载
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SurveyModal;