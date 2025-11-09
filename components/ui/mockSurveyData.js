// components/Survey/mockSurveyData.js
// 问卷模拟数据，开发环境下使用

export const mockSurveyData = {
    code: 0,
    msg: "success",
    data: {
        id: "user_satisfaction_2024",
        title: "用户满意度调查",
        description: "您的意见对我们非常重要，感谢您抽出时间完成这份问卷",
        questions: [
            {
                id: "q1",
                question: "您对我们的产品整体满意度如何？",
                type: "single", // single: 单选题, multiple: 多选题
                required: true,
                options: [
                    { value: "5", text: "非常满意" },
                    { value: "4", text: "满意" },
                    { value: "3", text: "一般" },
                    { value: "2", text: "不满意" },
                    { value: "1", text: "非常不满意" }
                ]
            },
            {
                id: "q2",
                question: "您最喜欢我们产品的哪些功能？（可多选）",
                type: "multiple",
                required: true,
                options: [
                    { value: "ui", text: "界面设计美观" },
                    { value: "speed", text: "响应速度快" },
                    { value: "features", text: "功能丰富" },
                    { value: "stability", text: "运行稳定" },
                    { value: "service", text: "客服服务好" },
                    { value: "other", text: "其他" }
                ]
            },
            {
                id: "q3",
                question: "您会向朋友推荐我们的产品吗？",
                type: "single",
                required: true,
                options: [
                    { value: "definitely", text: "一定会" },
                    { value: "probably", text: "可能会" },
                    { value: "neutral", text: "不确定" },
                    { value: "unlikely", text: "不太可能" },
                    { value: "never", text: "绝对不会" }
                ]
            },
            {
                id: "q4",
                question: "您希望我们改进哪些方面？（可多选）",
                type: "multiple",
                required: true,
                options: [
                    { value: "performance", text: "性能优化" },
                    { value: "ui", text: "界面优化" },
                    { value: "new_features", text: "新增功能" },
                    { value: "bug_fix", text: "修复Bug" },
                    { value: "tutorial", text: "使用教程" },
                    { value: "price", text: "价格调整" }
                ]
            },
            {
                id: "q5",
                question: "您使用我们产品的频率是？",
                type: "single",
                required: true,
                options: [
                    { value: "daily", text: "每天使用" },
                    { value: "weekly", text: "每周几次" },
                    { value: "monthly", text: "每月几次" },
                    { value: "rarely", text: "很少使用" },
                    { value: "first_time", text: "第一次使用" }
                ]
            },
            {
                id: "q6",
                question: "请为我们的产品和服务打分",
                type: "single",
                required: true,
                options: [
                    { value: "10", text: "10分（完美）" },
                    { value: "9", text: "9分" },
                    { value: "8", text: "8分" },
                    { value: "7", text: "7分" },
                    { value: "6", text: "6分" },
                    { value: "5", text: "5分（一般）" },
                    { value: "4", text: "4分" },
                    { value: "3", text: "3分" },
                    { value: "2", text: "2分" },
                    { value: "1", text: "1分（很差）" }
                ]
            }
        ]
    }
};

// 模拟提交成功返回
export const mockSubmitResponse = {
    code: 0,
    msg: "提交成功，感谢您的参与！",
    data: {
        success: true,
        points: 50, // 奖励积分（如果有）
        message: "您已获得50积分奖励！"
    }
};