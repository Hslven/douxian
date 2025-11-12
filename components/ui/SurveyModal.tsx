// components/Survey/SurveyModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./SurveyModal.css";

const Storage = {
  getToken: () => localStorage.getItem("token"),
};
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const SurveyModal = ({
  isOpen,
  onClose,
  onSubmit,
  backgroundImage,
  onCustomCheck,
}) => {
  const [surveyData, setSurveyData] = useState(null);
  const [answers, setAnswers] = useState({});
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
      const res = await fetch("/douxian/web/question", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const json = await res.json();
      if (json.code === 0 && json.data) {
        const data = json.data;
        if (!Array.isArray(data.questionList))
          throw new Error("questionList 缺失或非数组");
        data.questionList.forEach((q, i) => {
          if (!q.questionLabel)
            throw new Error(`第${i + 1}题缺少 questionLabel`);
          if (!Array.isArray(q.questionOption))
            throw new Error(`第${i + 1}题缺少 questionOption`);
        });
        setSurveyData(data);
      } else {
        throw new Error(json.msg || "获取问卷失败");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex, optionText, correctOption) => {
    const isMultiple = correctOption?.includes("|") || correctOption?.includes(",");
    if (isMultiple) {
      setAnswers((prev) => {
        const curr = prev[qIndex] || [];
        return {
          ...prev,
          [qIndex]: curr.includes(optionText)
            ? curr.filter((v) => v !== optionText)
            : [...curr, optionText],
        };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [qIndex]: optionText }));
    }
    if (onCustomCheck) onCustomCheck(qIndex, optionText, correctOption);
    setError("");
  };

  const calculateTotalScore = () => {
    if (!surveyData?.questionList?.length) return 0;
    const perScore = 100 / surveyData.questionList.length;
    let total = 0;
    surveyData.questionList.forEach((q, idx) => {
      const userAns = answers[idx];
      if (!userAns || (Array.isArray(userAns) && !userAns.length)) return;
      const correct = q.correctOption
        ?.split(/[|,]/)
        .map((s) => s.trim())
        .filter(Boolean) ?? [];
      if (Array.isArray(userAns)) {
        if (
          userAns.length === correct.length &&
          userAns.every((a) => correct.includes(a))
        )
          total += perScore;
      } else {
        if (correct.includes(userAns)) total += perScore;
      }
    });
    return Math.round(total);
  };

  const handleSubmit = async () => {
    if (!surveyData?.questionList?.length)
      return setError("问卷数据异常");
    const unanswered = surveyData.questionList.filter(
      (_, idx) => !answers[idx] || (Array.isArray(answers[idx]) && !answers[idx].length)
    );
    if (unanswered.length)
      return setError(`还有 ${unanswered.length} 道题未作答`);
    setIsSubmitting(true);
    setError("");
    try {
      const token = Storage.getToken();
      const totalScore = calculateTotalScore();
      const questionId = surveyData.questionId;
      const res = await fetch("/douxian/web/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ questionId, totalScore, answers }),
      });
      const json = await res.json();
      if (json.code !== 0) throw new Error(json.msg || "提交失败");
      onSubmit({ questionId, totalScore, answers });
    } catch (e) {
      setError(e.message || "提交失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    resetState();
  };

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && isOpen && !isLoading && !isSubmitting && handleClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [isOpen, isLoading, isSubmitting]);

  if (!isOpen) return null;

  /* ---------- 加载中 ---------- */
  if (isLoading)
    return createPortal(
      <div className="survey-modal-overlay show" onClick={handleClose}>
        <div className="survey-modal" onClick={(e) => e.stopPropagation()}>
          <button className="survey-close-btn" onClick={handleClose}>×</button>
          <div className="survey-loading">
            <div className="loading-spinner" />
            <p>正在加载问卷...</p>
          </div>
        </div>
      </div>,
      document.body
    );

  /* ---------- 错误 ---------- */
  if (error || !surveyData || !surveyData.questionList)
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

  /* ---------- 正常问卷 ---------- */
  return createPortal(
    <div
      className="survey-modal-overlay show"
      onClick={handleClose}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/*  关键：scrollable-modal 保留无题目时的尺寸、圆角、毛玻璃、阴影 */}
      <div className="survey-modal scrollable-modal" onClick={(e) => e.stopPropagation()}>
        <button className="survey-hidden-btn" onClick={handleClose} />

        <div className="survey-content">
          {/*  与无题目时完全一致的头部  */}
          <div className="survey-header">
            <h2>{surveyData.paperName || "问卷调研"}</h2>
          </div>

          {/*  题目列表：仅内部滚动，外观与无题目时 100% 相同  */}
          <div className="all-questions-container">
            {surveyData.questionList.map((q, idx) => (
              <div key={idx} className="question-item">
                <h3 className="question-title">
                  <span >{idx + 1}.</span>
                  {q.questionLabel}
                </h3>

                <div className="options-list">
                  {q.questionOption.map((opt,idx) => {
                    const selected = Array.isArray(answers[idx])
                      ? answers[idx].includes(opt)
                      : answers[idx] === opt;
                    return (
                      <label
                        key={opt}
                        className={`option-item ${selected ? "selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => handleSelectAnswer(idx, opt, q.correctOption)}
                          disabled={isSubmitting}
                        />
                        <span className="option-text">{ALPHABET[idx]}. {opt}</span>
                        <span className="custom-checkbox" />
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
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner" />
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

export default SurveyModal;