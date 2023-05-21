import { DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./SortItem";
import * as React from "react";

type ItemType = { id: any; [key: string]: any };

export function Dnd(props: {
  items: ItemType[];
  setItems: (items: any) => any;
  item: (item: ItemType) => React.FC;
}) {
  const { items, setItems } = props;
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items: any) => {
        const oldIndex = items.findIndex(
          (item: ItemType) => item.id == active.id
        );
        const newIndex = items.findIndex(
          (item: ItemType) => item.id == over.id
        );
        console.log(arrayMove(items, oldIndex, newIndex));
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={items}>
        {items.map((item) => (
          <SortableItem
            key={item.id}
            id={item.id}
            data={item}
            item={props.item}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
