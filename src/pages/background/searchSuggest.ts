import Config, { SearchType } from "./config";
import { uid } from "./utils";

interface SugResultListItem {
  label: string;
  path: string;
  id: string;
}

let controller;
async function baiduSuggest(keyword?: string) {
  if (!keyword) return [];

  controller && controller.abort();
  controller = new AbortController();

  const { sugParams, sugUrl, sugParamsWdFeild, searchPath } =
    Config.searchTypes[SearchType.Baidu];
  const params = new URLSearchParams({
    ...sugParams,
    _: new Date().getTime() + "",
    [sugParamsWdFeild]: keyword,
  });

  const url = `${sugUrl}?${params}`;
  const data = await fetch(url, { signal: controller.signal })
    .then((res) => res.json())
    .catch(console.error);
  if (!data?.g?.length) return [];

  // 格式化
  const list = data?.g?.filter((d) => d.type === "sug");
  const formatList = list?.map?.((item) => {
    const label = item?.q;
    return {
      id: uid(),
      label: label,
      path: searchPath.replace("${keyword}", label),
    };
  });

  return formatList;
}

async function npmSuggest(keyword?: string) {
  if (!keyword) return [];

  controller && controller.abort();
  controller = new AbortController();

  const { sugParams, sugUrl, sugParamsWdFeild, searchPath } =
    Config.searchTypes[SearchType.Npm];
  const params = new URLSearchParams({
    ...sugParams,
    [sugParamsWdFeild]: keyword,
  });

  const url = `${sugUrl}?${params}`;
  const data = await fetch(url, { signal: controller.signal })
    .then((res) => res.json())
    .catch(console.error);

  // 格式化
  if (!data?.length) return [];

  const formatList = data?.map?.((item) => {
    const { name, links } = item;
    return {
      ...item,
      id: uid(),
      label: name,
      path: links?.npm,
    };
  });

  return formatList;
}

async function GoogleSuggest(keyword?: string) {
  if (!keyword) return [];

  controller && controller.abort();
  controller = new AbortController();

  const {
    sugParams = {},
    sugUrl = "",
    sugParamsWdFeild = "",
    searchPath = "",
  } = Config.searchTypes[SearchType.Google];
  const params = new URLSearchParams({
    ...sugParams,
    [sugParamsWdFeild]: keyword,
  });

  const url = `${sugUrl}?${params}`;
  const data = await fetch(url, { signal: controller.signal })
    .then((res) => res.text())
    .catch(console.error);

  // 格式化
  let list = [];
  try {
    const dataText = (data || "")?.slice?.(4);
    list = JSON.parse(dataText)?.[0];
  } catch (error) {
    console.error(error);
  }

  if (!list?.length) return [];

  const formatList = list?.map?.((item) => {
    const [name] = item;
    return {
      ...item,
      id: uid(),
      label: name,
      path: searchPath.replace("${keyword}", name),
    };
  });

  return formatList;
}

async function GithubSuggest(keyword?: string) {
  controller && controller.abort();

  return [];
}

export const sugFetchMap = {
  [SearchType.Baidu]: baiduSuggest,
  [SearchType.Npm]: npmSuggest,
  [SearchType.Google]: GoogleSuggest,
  [SearchType.Github]: GithubSuggest,
};
