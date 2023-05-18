import { Segmented, ConfigProvider, theme } from "antd";
import useShow from "./hooks/useShow";
import useSearchType from "./hooks/useSearchType";
import { useEffect, useRef, useState } from "react";

import SugList from "./components/SugList";
import { useKeyPress } from "ahooks";
import useSugList, { SugResultListItem } from "./hooks/useSugList";
import useOpen from "./hooks/useOpen";

export default function App() {
  const searchInputRef = useRef<HTMLInputElement>();
  const { show, closeSearch } = useShow();

  const { curType, searchTypes, setCurType, getSearchPath, runNextType } =
    useSearchType();

  const { suglist, onSearchValueChange, clearSugList } = useSugList({
    curSugType: curType,
  });

  // 打开
  const { wopen } = useOpen();

  // 搜索
  const [searchValue, setsearchValue] = useState("");

  // 上下键选中的值
  const [activeId, setActiveId] = useState<string>();

  // 前往搜索
  const handleOpen = (path: string) => {
    closeSearch();
    wopen(path);
  };

  // 上下键
  useKeyPress(["uparrow", "downarrow"], (e) => {
    if (!show) return;

    const listLen = suglist?.length;
    if (!listLen) return;

    const searchItemIndex = suglist?.findIndex((item) => item.id === activeId);
    const searchItem = suglist[searchItemIndex];

    if (e.key === "ArrowDown") {
      if (searchItem) {
        setActiveId(suglist[(searchItemIndex + 1) % listLen]?.id);
      } else {
        setActiveId(suglist[0]?.id);
      }
    } else if (e.key === "ArrowUp") {
      if (searchItem) {
        setActiveId(suglist[(searchItemIndex + listLen - 1) % listLen]?.id);
      } else {
        setActiveId(suglist[listLen - 1]?.id);
      }
    }
  });

  // 回车确认
  useKeyPress(
    ["enter"],
    () => {
      if (!show) return;
      // 按上下箭头选中的item，
      // 因为里面带有 path，可能不是 search 路径，例如baidu与npm不同，npm 返回的 sugList 中的path，直接进入该项目
      const sugItem = suglist?.find((item) => item.id === activeId);
      if (sugItem && sugItem?.id === activeId) {
        handleOpen(sugItem?.path);
      } else {
        handleOpen(getSearchPath(searchValue));
      }
    },
    { exactMatch: true }
  );

  // tab 下一个
  useKeyPress(
    ["tab"],
    (event: { preventDefault: () => void }) => {
      if (!show) return;

      event.preventDefault();
      runNextType(true);
    },
    { exactMatch: true }
  );

  // shift + tab 上一个
  useKeyPress(
    ["shift.tab"],
    (event: { preventDefault: () => void }) => {
      if (!show) return;

      event.preventDefault();
      runNextType(false);
    },
    { exactMatch: true }
  );

  // 当上下键选择改变
  useEffect(() => {
    const searchItem = suglist?.find((item) => item.id === activeId);

    if (searchItem) {
      setsearchValue(searchItem?.label);
    }
  }, [activeId]);

  // 当搜索值改变
  useEffect(() => {
    if (!searchValue) {
      setActiveId(undefined);
    }
  }, [searchValue]);

  // 当搜索是否显示改变时
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        searchInputRef?.current?.focus?.();
      });
    }
  }, [show]);

  // 当搜索类型改变
  useEffect(() => {
    // 切换后直接触发该类型搜索
    onSearchValueChange(searchValue);
    clearSugList();
  }, [curType]);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div id={show ? "backdrop" : "hidden"}>
        <div className="searchBox">
          <div className="searchBoxContent">
            <Segmented
              size="small"
              value={curType}
              options={searchTypes}
              onChange={(v: any) => {
                setCurType(v);
              }}
            />

            <div>
              <input
                ref={searchInputRef}
                className={`searchInput ${
                  suglist?.length ? "searchHasRes" : ""
                }`}
                value={searchValue}
                placeholder={curType}
                onChange={(e: any) => {
                  const value = e?.target?.value;
                  setsearchValue(value);
                  onSearchValueChange(value);
                }}
              ></input>
            </div>

            <div className="searchResult">
              {/* <Recent /> */}

              <SugList
                list={suglist}
                activeId={activeId}
                onClick={(item) => {
                  handleOpen(item?.path);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
