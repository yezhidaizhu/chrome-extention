import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "./SortItem";

type ItemType = { id: any; [key: string]: any };

export function Dnd(props: {
  items: ItemType[];
  setItems: (items: any) => any;
  item: (item: ItemType) => any;
}) {
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const { items, setItems } = props;
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(
        (item: ItemType) => item.id == active.id
      );
      const newIndex = items.findIndex((item: ItemType) => item.id == over.id);
      const newItems = arrayMove(items, oldIndex, newIndex) ?? [];
      setItems(newItems);
    }
  }

  return (
    <DndContext sensors={[sensor]} onDragEnd={handleDragEnd}>
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
