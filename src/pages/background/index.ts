import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { EventType } from "./type";
import Config from "./config";
import { sugFetchMap } from "./searchSuggest";

reloadOnUpdate("pages/background");

console.log("background loaded");

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  const tabId = sender?.tab?.id;

  const { type, sugType, keyword } = msg || {};
  if (type === EventType.Sug) {
    const getSugFn = sugFetchMap[sugType];
    if (getSugFn) {
      const data = await getSugFn(keyword);
      if (data) {
        const sendData = { type: EventType.ReplySug, data, keyword, sugType };
        console.log(sendData);
        chrome.tabs.sendMessage(tabId, sendData);
      }
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  const searchTypes = Object.keys(Config.searchTypes).map((key) => {
    return { ...Config.searchTypes[key], type: key };
  });

  chrome.storage.local.set({ searchTypes });
});
