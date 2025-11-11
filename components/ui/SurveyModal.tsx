// components/Survey/SurveyModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // ✅ React 18 正确导入
import "./SurveyModal.css";

const Storage = {
    getToken: () => localStorage.getItem("auth_token"),
};

const SurveyModal = ({ isOpen, onClose, onSubmit, backgroundImage, onCustomCheck }) => {
    const [surveyData, setSurveyData] = useState(null);
    const [answers, setAnswers] = useState({}); // 格式: {0: "选项A", 1: ["选项B","选项C"]}
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) fetchSurveyData();
        else resetState();
    }, [isOpen]);

    const resetState = () => {
        setAnswers({});
        setError("");
        setIsSubmitting(false);
    };

    const fetchSurveyData = async () => {
        setIsLoading(true);
        setError("");
        try {
            const token = Storage.getToken();
            const response = await fetch("/douxian/web/question", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
            });

            const result = await response.json();
            console.log("🚀 接口返回:", result);

            if (result.code === 0 && result.data) {
                const data = result.data;
                if (!data.questionList || !Array.isArray(data.questionList)) {
                    throw new Error("questionList 字段缺失或不是数组");
                }
                // ✅ 验证每题必需字段
                data.questionList.forEach((q, i) => {
                    if (!q.questionLabel) throw new Error(`第${i + 1}题缺少 questionLabel`);
                    if (!Array.isArray(q.questionOption)) throw new Error(`第${i + 1}题缺少 questionOption`);
                });
                setSurveyData(data);
            } else {
                throw new Error(result.msg || "获取问卷失败");
            }
        } catch (err) {
            setError(err.message);
            console.error("❌ 获取失败:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ 答案选择（按题目索引存储）
    const handleSelectAnswer = (qIndex, optionText, correctOption) => {
        const isMultiple = correctOption && (correctOption.includes('|') || correctOption.includes(','));

        if (isMultiple) {
            setAnswers(prev => {
                const current = prev[qIndex] || [];
                if (current.includes(optionText)) {
                    return { ...prev, [qIndex]: current.filter(v => v !== optionText) };
                }
                return { ...prev, [qIndex]: [...current, optionText] };
            });
        } else {
            setAnswers(prev => ({ ...prev, [qIndex]: optionText }));
        }

        if (onCustomCheck) onCustomCheck(qIndex, optionText, correctOption);
        setError("");
    };

    // ✅ 计算总分（每题均分）
    const calculateTotalScore = () => {
        if (!surveyData?.questionList?.length) return 0;
        const perScore = 100 / surveyData.questionList.length;
        let total = 0;

        surveyData.questionList.forEach((question, index) => {
            const userAnswer = answers[index];
            if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) return;

            const correctAnswers = question.correctOption
                ? question.correctOption.split(/[|,]/).map(s => s.trim()).filter(Boolean)
                : [];

            if (Array.isArray(userAnswer)) {
                if (userAnswer.length === correctAnswers.length &&
                    userAnswer.every(ans => correctAnswers.includes(ans))) {
                    total += perScore;
                }
            } else {
                if (correctAnswers.includes(userAnswer)) {
                    total += perScore;
                }
            }
        });
        return Math.round(total);
    };

    // ✅ 提交到真实接口
    const handleSubmit = async () => {
        if (!surveyData?.questionList?.length) return setError("问卷数据异常");

        const unanswered = surveyData.questionList.filter((_, idx) => {
            const ans = answers[idx];
            return !ans || (Array.isArray(ans) && ans.length === 0);
        });

        if (unanswered.length > 0) return setError(`还有 ${unanswered.length} 道题未作答`);

        setIsSubmitting(true);
        setError("");

        try {
            const token = Storage.getToken();
            const totalScore = calculateTotalScore();
            const questionId = surveyData.questionId; // ✅ 从试卷数据获取

            // ✅ 真实提交
            const response = await fetch("/douxian/web/question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    questionId,        // 问卷ID
                    totalScore,        // 计算后的总分
                    answers            // 答案对象
                }),
            });

            const result = await response.json();
            if (result.code !== 0) throw new Error(result.msg || "提交失败");

            console.log("✅ 提交成功:", { questionId, totalScore });
            onSubmit({ questionId, totalScore, answers });

        } catch (err) {
            setError(err.message || "提交失败");
            console.error("❌ 提交错误:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onClose();
        resetState();
    };

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

    // 加载中
    if (isLoading) {
        return createPortal(
            <div className="survey-modal-overlay show" onClick={handleClose}>
                <div className="survey-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="survey-close-btn" onClick={handleClose}>×</button>
                    <div className="survey-loading">
                        <div className="loading-spinner"></div>
                        <p>正在加载问卷...</p>
                    </div>
                </div>
            </div>,
            document.body
        );
    }

    // 错误页
    if (error || !surveyData || !surveyData.questionList) {
        return createPortal(
            <div className="survey-modal-overlay show" onClick={handleClose}>
                <div className="survey-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="survey-close-btn" onClick={handleClose}>×</button>
                    <div className="survey-error">
                        <p>{error || "问卷数据异常"}</p>
                        <button className="retry-btn" onClick={fetchSurveyData}>重新加载</button>
                    </div>
                </div>
            </div>,
            document.body
        );
    }

    // 正式渲染问卷
    return createPortal(
        <div
            className="survey-modal-overlay show"
            onClick={handleClose}
            style={{
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflowY: 'auto'
            }}
        >
            <div className="survey-modal scrollable-modal" onClick={(e) => e.stopPropagation()}>
                <button className="survey-close-btn" onClick={handleClose}>×</button>

                <div className="survey-content">
                    <div className="survey-header">
                        <h2>{surveyData.paperName || "问卷调研"}</h2>
                    </div>

                    <div className="all-questions-container">
                        {surveyData.questionList.map((question, qIndex) => (
                            <div key={qIndex} className="question-item">
                                <h3 className="question-title">
                                    <span className="question-number">{qIndex + 1}.</span>
                                    {question.questionLabel}
                                </h3>

                                <div className="options-list">
                                    {question.questionOption.map((optionText) => {
                                        const isSelected = Array.isArray(answers[qIndex])
                                            ? answers[qIndex].includes(optionText)
                                            : answers[qIndex] === optionText;

                                        return (
                                            <label
                                                key={optionText}
                                                className={`option-item ${isSelected ? "selected" : ""}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectAnswer(qIndex, optionText, question.correctOption)}
                                                    disabled={isSubmitting}
                                                />
                                                <span className="option-text">{optionText}</span>
                                                <span className="custom-checkbox"></span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="error-message show">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="survey-actions single-action">
                        <button className="submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    提交中...
                                </>
                            ) : (
                                "提交问卷"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// ✅ 确保完整导出
export default SurveyModal;