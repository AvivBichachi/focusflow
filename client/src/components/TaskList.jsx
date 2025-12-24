import TaskItem from "./TaskItem.jsx";

const statusRank = { IN_PROGRESS: 0, TODO: 1, COMPLETED: 2 };
const priorityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 };

function sortTasks(a, b) {
  const aStatus = statusRank[a.status] ?? 99;
  const bStatus = statusRank[b.status] ?? 99;
  if (aStatus !== bStatus) return aStatus - bStatus;

  const aPr = priorityRank[a.priority] ?? 99;
  const bPr = priorityRank[b.priority] ?? 99;
  if (aPr !== bPr) return aPr - bPr;

  const aTime = Date.parse(a.updatedAt || a.createdAt || 0) || 0;
  const bTime = Date.parse(b.updatedAt || b.createdAt || 0) || 0;
  return bTime - aTime;
}

export default function TaskList({ tasks, focusTaskId, onStartFocus, onDelete, onComplete, onUpdateStatus, onOpenDetails  }) {

  const sortedTasks = [...tasks].sort(sortTasks);

  return (
    <div style={{ maxHeight: 520, overflowY: "auto", marginTop: 12, paddingRight: 6 }}>
      <ul style={{ marginTop: 0, paddingLeft: 18 }}>
        {sortedTasks.length === 0 ? <li>No tasks yet</li> : null}

        {sortedTasks.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            focusTaskId={focusTaskId}
            onStartFocus={onStartFocus}
            onDelete={onDelete}
            onComplete={onComplete}
            onUpdateStatus={onUpdateStatus}
            onOpenDetails ={onOpenDetails}
          />

        ))}
      </ul>
    </div>
  );
}
