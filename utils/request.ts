import axios, { AxiosResponse } from "axios";

// 定义后端通用响应格式
interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
  path: string;
}

// 创建axios实例
const request = axios.create({
  baseURL: "/api/proxy", // 基础URL，可通过环境变量配置
  timeout: 10000, // 请求超时时间（10秒）
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求前做些什么，例如添加token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    // 处理请求错误
    console.error("请求拦截器错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  <T = any>(response: AxiosResponse<ApiResponse<T>>) => {
    // 对响应数据做点什么
    const res = response.data;
    // 假设后端返回格式为 { code: 200, data:..., message:... }
    if (res.code !== 0) {
      // 非成功状态，抛出错误信息
      console.error("接口错误:", response.msg || "请求失败");
      return Promise.reject(new Error(response.msg || "请求失败"));
    }
    return res.data; // 只返回数据部分
  },
  (error) => {
    // 处理响应错误
    console.error("响应拦截器错误:", error);
    // 错误分类处理
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          console.error("身份验证失败，请重新登录");
          // 可在这里添加跳转到登录页的逻辑
          break;
        case 403:
          console.error("没有权限访问");
          break;
        case 404:
          console.error("请求的资源不存在");
          break;
        case 500:
          console.error("服务器内部错误");
          break;
        default:
          console.error(`请求错误: ${error.response.status}`);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error("没有收到响应，请检查网络");
    } else {
      // 其他错误
      console.error("请求失败:", error.message);
    }

    return Promise.reject(error);
  }
);

export default request;

export const getImgUrl = (url: string) => {
  if (!url) return undefined;
  const prefix = "http://douxian.zhuzhu.pro";
  return url.startsWith(prefix) ? url : `${prefix}${url}`;
};

