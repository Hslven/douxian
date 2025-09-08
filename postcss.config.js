module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-px-to-viewport": {
      // 视口宽度，根据设计稿宽度设置，通常是 375 或 750
      viewportWidth: 1920,
      // 视口高度，可不设置
      viewportHeight: 1080,
      // 转换后的单位
      unitToConvert: "px",
      // 转换后的视口单位
      viewportUnit: "vw",
      // 字体使用的视口单位
      fontViewportUnit: "vw",
      // 转换的最小 px 值，小于等于该值的不转换
      minPixelValue: 2,
      // 允许在媒体查询中转换 px
      mediaQuery: false,
      // 忽略某些选择器，不进行转换
      selectorBlackList: [
        // 完全匹配类名：.ignore-px 下的所有 px 不转换
        // 'ignore-px',
        // 以某个前缀开头的类名：如 .prefix- 开头的类
        // '^prefix-',
      ],
      // 忽略的文件
      exclude: [],
      // 保留 decimal 后多少位
      unitPrecision: 5,
      // 是否添加根据 landscapeWidth 生成的媒体查询条件
      landscape: false,
      // 横屏时使用的单位
      landscapeUnit: "vw",
      // 横屏时的视口宽度
      landscapeWidth: 568,

      // 自定义转换规则，这里处理 1px 不转换的需求
      propList: ["*"],
      // 对于 1px 的特殊处理，使用函数形式过滤
      filter: (decl) => {
        // 如果属性值是 1px，则不转换
        if (decl.value === "1px") {
          return false;
        }
        return true;
      },
    },
  },
};
