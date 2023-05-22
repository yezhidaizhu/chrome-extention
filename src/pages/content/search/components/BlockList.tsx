import { CloseOutlined } from "@ant-design/icons";

export interface BlockListItem {
  id?: string;
  label: string;
  desc?: any; // lable 下面的文字
  end?: any; // justify-content: space-between; 后面的部分
  [key: string]: any;
}

export default function BlockList(props: {
  list: BlockListItem[]; // 列表
  activeId?: string; // 激活部分
  title?: any;
  onClick?: (item: BlockListItem) => void;
  onDelete?: (e: any, item: BlockListItem) => void;
  showDeleteBtn?: boolean;
}) {
  const {
    list = [],
    activeId,
    onClick,
    title,
    showDeleteBtn,
    onDelete,
  } = props;

  if (!list?.length) return <></>;

  return (
    <div className="blockList">
      {title}
      {list?.map((item, index) => {
        const { label, desc = "", end = "", id = "" } = item;
        return (
          <div
            key={index}
            className={`item ${activeId === id ? "active" : ""}`}
            onClick={() => {
              onClick?.(item);
            }}
          >
            {/* label */}
            <div className="label">
              <div>{label}</div>
              <div className="desc">{desc}</div>
            </div>

            {/* 后面 */}
            <div className="after">{end}</div>

            {/* 后面有个删除按钮 */}
            {showDeleteBtn && (
              <div
                className="deleteBtn"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete?.(event, item);
                }}
              >
                <CloseOutlined />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
