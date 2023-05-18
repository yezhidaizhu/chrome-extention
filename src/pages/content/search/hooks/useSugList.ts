import { useEffect, useState } from "react";
import { uid } from "../utils";
import { useDebounceFn } from "ahooks";
import { EventType } from "../type";

export interface SugResultListItem {
  id: string;
  label: string;
  path: string;
}

export default function useSugList({ curSugType = "" }) {
  const [suglist, setSugList] = useState<SugResultListItem[]>([]);

  const clearSugList = () => {
    setSugList([]);
  };

  const { run } = useDebounceFn(
    (keyword?: string) => {
      chrome.runtime.sendMessage({
        type: EventType.Sug,
        sugType: curSugType,
        keyword: keyword,
      });
    },
    { wait: 200 }
  );

  const onSearchValueChange = (searchValue: string) => {
    run(searchValue?.trim?.());
  };

  const handleMessage = (msg) => {
    const { type, data } = msg || {};
    if (type === EventType.ReplySug) {
      setSugList(data);
    }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return { suglist, onSearchValueChange, clearSugList };
}
