import { useEffect, useMemo, useState } from "react";
import useSearchHistory from "../hooks/useSearchHistory";
import SugList from "./SugList";
import { useKeyPress } from "ahooks";
import { ClockCircleOutlined } from "@ant-design/icons";
import { SugResultListItem } from "../hooks/useSugList";
import BlockList from "./BlockList";
import Block from "./Block";

export default function Recent({
  show = false,
  curSearchType = "",
  onClick = (item: SugResultListItem) => {},
  onSel = (v: string) => {},
}) {
  const { getThinHistory, rmHistory } = useSearchHistory();

  const [historyList, setHistoryList] = useState<any[]>([]);

  const showRecent = useMemo(() => {
    return show && !!historyList?.length;
  }, [show, historyList]);

  // 上下键选中的值
  const [activeId, setActiveId] = useState<string>();

  // 刷新当前搜索类型下的历史列表
  const refreshHistoryList = async () => {
    if (!curSearchType) return [];
    const list = (await getThinHistory(curSearchType, true)) ?? [];

    setHistoryList(
      list.map((d) => ({
        id: d._,
        label: d.v,
      }))
    );
  };

  useKeyPress(["uparrow", "downarrow"], (e) => {
    const listLen = historyList?.length;
    if (!listLen || !showRecent) return;

    const historyItemIndex = historyList?.findIndex(
      (item) => item.id === activeId
    );
    const historyItem = historyList[historyItemIndex];

    if (e.key === "ArrowDown") {
      if (historyItem) {
        setActiveId(historyList[(historyItemIndex + 1) % listLen]?.id);
      } else {
        setActiveId(historyList[0]?.id);
      }
    } else if (e.key === "ArrowUp") {
      if (historyItem) {
        setActiveId(
          historyList[(historyItemIndex + listLen - 1) % listLen]?.id
        );
      } else {
        setActiveId(historyList[listLen - 1]?.id);
      }
    }
  });

  useEffect(() => {
    refreshHistoryList();
  }, [curSearchType]);

  useEffect(() => {
    !showRecent && setActiveId(undefined);
  }, [showRecent]);

  useEffect(() => {
    if (!showRecent) return;
    const item = historyList?.find((item) => item.id === activeId);
    if (item) {
      onSel(item?.label);
    }
  }, [activeId]);

  if (!showRecent) return <></>;

  return (
    <Block>
      <BlockList
        showDeleteBtn
        list={historyList}
        title={<RecentText />}
        activeId={activeId}
        onClick={onClick}
        onDelete={async (event, item) => {
          await rmHistory(curSearchType, item.id);
          refreshHistoryList();
        }}
      />
    </Block>
  );
}

function RecentText() {
  return (
    <div className="recentDesc">
      <ClockCircleOutlined style={{ fontSize: "12px", marginRight: "8px" }} />
      最近搜索历史
    </div>
  );
}
