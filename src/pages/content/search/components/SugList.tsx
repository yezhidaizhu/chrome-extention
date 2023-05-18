import { SugResultListItem } from "../hooks/useSugList";

export default function SugList(props: {
  list: SugResultListItem[];
  activeId?: string;
  onClick?: (item:SugResultListItem) => void;
}) {
  const { list = [], activeId, onClick } = props;

  if (!list?.length) return <></>;

  return (
    <div className="sugList">
      {list?.map((item, index) => {
        const { label, path, id = "" } = item;
        return (
          <div
            key={index}
            className={`item ${activeId === id ? "active" : ""}`}
            onClick={() => {
              onClick?.(item);
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}
