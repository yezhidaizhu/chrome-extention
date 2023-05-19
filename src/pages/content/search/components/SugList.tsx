import { CloseOutlined } from "@ant-design/icons";
import BlockList from "./BlockList";
import { SugResultListItem } from "../hooks/useSugList";
import Block from "./Block";

export default function SugList(props: {
  list: SugResultListItem[];
  activeId?: string;
  title?: any;
  onClick?: (item: SugResultListItem) => void;
  onDelete?: (e: any, item: SugResultListItem) => void;
  showDeleteBtn?: boolean;
}) {
  if (!props.list?.length) return <></>;

  return (
    <Block>
      <BlockList {...props} />
    </Block>
  );
}
