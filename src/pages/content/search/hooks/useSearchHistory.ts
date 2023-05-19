import { useState } from "react";

const getSearchHistory_key = (searchType) => `${searchType}_SearchHistory`;
const RecentHistoryMaxCount = 6; // 展示最近历史最多几条

/**
 * 保存的数据结构为
 * [`${searchType}_SearchHistory`]: {v: string , _:string}[]  // v：为按下回车进行搜索的值，_：为时间戳，使用时间戳作为id
 *
 * 比如百度的历史为  { baidu_SearchHistory: [{v:"测试", _: 1684478237460}] }
 */

// 搜索历史
export default function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState({});

  // 获取指定类型的历史，并写入 searchHistory 变量中，用于展示最近的
  // latest: 是否只获取最新的
  const getThinHistory = async (searchType: string, latest?: boolean) => {
    if (searchHistory?.[searchType]?.length && !latest) {
      // 如果在 searchHistory 存在，则直接返回
      return searchHistory?.[searchType];
    } else {
      // 在全部历史中获取最新的几个
      const oldHistory: any[] = await getSearchHistoryByType(searchType);
      const thinHistory = oldHistory.slice(-RecentHistoryMaxCount);
      setSearchHistory((h) => ({ ...h, [searchType]: thinHistory }));
      return thinHistory;
    }
  };

  // 获取指定类型的所有历史
  const getSearchHistoryByType = async (searchType: string) => {
    if (!searchType) return [];
    const key = getSearchHistory_key(searchType);
    const data = await chrome.storage.local.get(key);

    return data[key] ? data[key] : [];
  };

  // 增加历史
  const pushHistory = async (searchType: string, value: string) => {
    if (!(value + "")?.trim() || !searchType) return;

    const newDataItem = { v: value, _: new Date().getTime() };
    const oldData = (await getSearchHistoryByType(searchType)) ?? [];
    const newData = [...oldData, newDataItem];
    const key = getSearchHistory_key(searchType);

    await chrome.storage.local.set({ [key]: newData });
  };

  // 删除历史
  const rmHistory = async (searchType: string, t: string) => {
    if (!searchType) return;
    const oldData: any[] = await getSearchHistoryByType(searchType);
    const newData = oldData?.filter?.((d) => d._ !== t) ?? [];
    const key = getSearchHistory_key(searchType);

    await chrome.storage.local.set({ [key]: newData });
  };

  return { getThinHistory, pushHistory, rmHistory };
}
