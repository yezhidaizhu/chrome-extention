import { useEffect, useState } from "react";
import { useDebounceFn } from "ahooks";
import { EventType, SearchType } from "../type";

export interface SugResultListItem {
  id: string;
  label: string;
  path: string;

  desc?: string;
  end?: string;
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
    const { type, data, sugType } = msg || {};

    if (type === EventType.ReplySug) {
      if (sugType === SearchType.Npm) {
        // npm
        setSugList(
          data.map((item) => ({
            ...item,
            desc: item.description,
            end: item.version,
          }))
        );
      } else {
        setSugList(data);
      }
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
