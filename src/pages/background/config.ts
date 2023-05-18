export const SearchType = {
  Baidu: "baidu",
  Npm: "npm",
  Google: "google",
  Github: "github",
};

const Config = {
  // 目前支持
  searchTypes: {
    [SearchType.Baidu]: {
      label: "baidu", // 显示的名字
      // host: "https://www.baidu.com", // 域名
      sugUrl: "https://www.baidu.com/sugrec",
      // 预推荐请求参数
      sugParams: {
        pre: "1",
        p: "3",
        ie: "utf-8",
        json: "1",
        prod: "pc",
        from: "pc_web",
        wd: "${keyword}", // 推荐传过去的值
        req: "2",
        sugmode: "2",
        _: new Date().getTime() + "",
      },
      sugParamsWdFeild: "wd", //  推荐传过去字段名
      searchPath: "https://www.baidu.com/s?wd=${keyword}", // 替换 ${keyword} 就为搜索的地址
    },
    [SearchType.Npm]: {
      label: "npm", // 显示的名字
      // host: "https://www.baidu.com", // 域名
      sugUrl: "https://www.npmjs.com/search/suggestions",
      // 预推荐请求参数
      sugParams: {
        q: "${keyword}", // 推荐传过去的值
      },
      sugParamsWdFeild: "q", //  推荐传过去字段名
      searchPath: "https://www.npmjs.com/search?q=${keyword}", // 替换 ${keyword} 就为搜索的地址
    },
    [SearchType.Google]: {
      label: "Google", // 显示的名字
      // host: "https://www.baidu.com", // 域名
      sugUrl: "https://www.google.com/complete/search",
      // 预推荐请求参数
      sugParams: {
        xssi: "t",
        client: "gws-wiz",
        q: "${keyword}", // 推荐传过去的值
      },
      sugParamsWdFeild: "q", //  推荐传过去字段名
      searchPath: "https://www.google.com/search?q=${keyword}", // 替换 ${keyword} 就为搜索的地址
    },
    [SearchType.Github]: {
      label: "github", // 显示的名字
      sugUrl: "",
      // 预推荐请求参数
      sugParams: {
        q: "${keyword}", // 推荐传过去的值
      },
      sugParamsWdFeild: "q", //  推荐传过去字段名
      searchPath: "https://github.com/search?q=${keyword}", // 替换 ${keyword} 就为搜索的地址
    },
  },
};

export default Config;
