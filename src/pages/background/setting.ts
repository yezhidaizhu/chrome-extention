import Config from "./config";

export async function initDefaultSearchSetting() {
  const originSearchTypes = Config.searchTypes;
  const searchTypes = Object.keys(originSearchTypes).map((key) => {
    const searchType = originSearchTypes[key];
    return {
      id: key,
      label: searchType.label,
      value: key,
    };
  });
  const defaultSetting = {
    theme: "light",
    mask: true,
    searchTypes: searchTypes,
  };

  // 基本设置
  await chrome.storage.local.set({ ["searchGeneralSetting"]: defaultSetting });
  // 默认搜索方式
  const defaultSearchType = searchTypes?.[0]?.value;
  await chrome.storage.local.set({ ["defaultSearchType"]: defaultSearchType });
}
