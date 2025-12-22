import TaskItem from "./TaskItem.jsx";

export default function TaskList({ tasks, focusTaskId, onStartFocus }) {
  return (
    <ul style={{ marginTop: 12, paddingLeft: 18 }}>
      {tasks.length === 0 ? <li>No tasks yet</li> : null}

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          focusTaskId={focusTaskId}
          onStartFocus={onStartFocus}
        />
      ))}
    </ul>
  );
}
