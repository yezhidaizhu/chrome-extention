import { useThrottleFn } from "ahooks";
import { useEffect, useMemo, useState } from "react";

const DefaultType_Key = "defaultSearchType";

export default function useSearchType() {
  // 搜索类型
  const [orginSearchTypes, setOrginSearchTypes] = useState<SearchType[]>([]);
  const searchTypes = useMemo<
    {
      label: string;
      value: string;
    }[]
  >(() => {
    return orginSearchTypes?.map((obj) => ({
      label: obj.label,
      value: obj.type,
    }));
  }, [orginSearchTypes]);

  const getSearchTypes = async () => {
    const data: any = await chrome.storage.local.get("searchTypes");
    if (data?.searchTypes) {
      const types = data?.searchTypes ?? [];
      setOrginSearchTypes(types);
    }
  };

  const getSearchPath = (keyword?: string) => {
    const curOrginSearchType = orginSearchTypes?.find((t) => t.type == curType);
    return curOrginSearchType?.searchPath?.replace("${keyword}", keyword);
  };

  // 默认搜索
  const [defaultType, setDefaultType] = useState("");

  // 初始化默认类型
  const initDefaultType = async (searchTypes = []) => {
    const data = await chrome.storage.local.get(DefaultType_Key);
    if (data[DefaultType_Key]) {
      setDefaultType(data[DefaultType_Key]);
    } else {
      setDefaultType(searchTypes?.[0]?.value ?? "");
    }
  };

  const [curType, setCurType] = useState(defaultType); // 当前搜索类型

  // 下一个搜索类型
  const nextSearchType = (rightArrow = true) => {
    const index = searchTypes?.findIndex((tab) => tab.value == curType);
    if (rightArrow) {
      // 正向
      setCurType(
        searchTypes[(index + 1) % searchTypes.length]?.value ?? defaultType
      );
    } else {
      // 反向
      setCurType(
        searchTypes[(index + searchTypes.length - 1) % searchTypes.length]
          ?.value ?? defaultType
      );
    }
  };

  // tab 切换
  const { run } = useThrottleFn(
    (rightArrow: boolean | undefined) => {
      nextSearchType(rightArrow);
    },
    { wait: 150 }
  );

  // 获取搜索类型
  useEffect(() => {
    getSearchTypes();
  }, []);

  // 设置默认类型
  useEffect(() => {
    initDefaultType();
  }, [searchTypes]);

  // 设置当前类型
  useEffect(() => {
    setCurType(defaultType);
  }, [defaultType]);

  // 切换搜索类型后，保存下来
  useEffect(() => {
    if (curType) {
      chrome.storage.local.set({ [DefaultType_Key]: curType });
    }
  }, [curType]);

  return { curType, setCurType, searchTypes, getSearchPath, runNextType: run };
}

interface SearchType {
  type?: string;
  label?: string;
  searchPath?: string;
  sugParams?: { [key: string]: string };
  sugParamsWdFeild?: string;
  sugUrl?: string;
}
