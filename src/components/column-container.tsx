import { useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import TrashIcon from "../icons/trash-icon";
import PlusIcon from "../icons/plus-icon";

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./task-card";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  tasks: Task[];
  createTask: (columnId: Id) => void;
  deleteTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export default function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  tasks,
  createTask,
  deleteTask,
  updateTask,
}: Props) {
  const [editMode, setEditMode] = useState(false);

  const taskIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  // draggable
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  // custom style
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-800 opacity-60 border-2 border-rose-600 w-[350px] h-[550px] max-h-[700px] rounded-sm flex flex-col"
      ></div>
    );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[350px] h-[550px] bg-slate-700 max-h-[700px] rounded-sm flex flex-col"
    >
      {/* Title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-slate-950 text-md h-[60px] cursor-grab rounded-sm rounded-b-none p-3 font-bold border-slate-900 border-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-slate-950 px-2 py-1 text-sm rounded-full">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
            value={column.title}
            onChange={(e) => updateColumn(column.id, e.target.value)}
            autoFocus
            onBlur={() => {setEditMode(false)}}
            onKeyDown={(e) => {if (e.key !== "Enter") 
              return setEditMode(false)}}
            className="bg-black focus:border-rose-700 border rounded outline-none px-2"
            />
          )}
        </div>
        <button
          onClick={() => deleteColumn(column.id)}
          className="stroke-slate-500 hover:stroke-white hover:bg-slate-800 rounded px-1 py-2"
        >
          <TrashIcon />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Footer */}
      <button
        onClick={() => {
          createTask(column.id);
        }}
        className="flex gap-2 items-center border-slate-800 border-2 p-4 border-x-slate-800 hover:bg-slate-600 hover:text-rose-500 active:bg-black"
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
}
