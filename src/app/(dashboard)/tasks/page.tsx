'use client';

import { useState } from 'react';
import {
  Plus, Search, Filter, CheckCircle2, Circle, ArrowRight, Clock,
  AlertCircle, Tag, Calendar, ChevronDown
} from 'lucide-react';
import {
  DndContext, DragOverlay, useDraggable, useDroppable,
  type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import { Topbar } from '@/components/layout/Topbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { tasks as initialTasks } from '@/lib/mock-data';
import type { Task, TaskStatus, TaskPriority } from '@/types';
import { cn } from '@/lib/utils';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'open', label: 'Open', color: 'text-muted-foreground' },
  { id: 'assigned', label: 'Assigned', color: 'text-blue-500' },
  { id: 'in_progress', label: 'In Progress', color: 'text-indigo-500' },
  { id: 'review', label: 'Review', color: 'text-amber-500' },
  { id: 'completed', label: 'Done', color: 'text-emerald-500' },
];

const priorityConfig: Record<TaskPriority, { color: string; bg: string; dot: string }> = {
  critical: { color: 'text-red-600', bg: 'bg-red-500/10', dot: 'bg-red-500' },
  high: { color: 'text-orange-600', bg: 'bg-orange-500/10', dot: 'bg-orange-500' },
  medium: { color: 'text-amber-600', bg: 'bg-amber-500/10', dot: 'bg-amber-500' },
  low: { color: 'text-blue-600', bg: 'bg-blue-500/10', dot: 'bg-blue-500' },
};

function TaskCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  const pc = priorityConfig[task.priority];
  const progress = task.estimatedHours > 0 ? (task.loggedHours / task.estimatedHours) * 100 : 0;

  return (
    <div className={cn(
      'bg-card border border-border rounded-xl p-3 cursor-grab select-none transition-all',
      isDragging ? 'shadow-2xl rotate-1 opacity-90 scale-105' : 'hover:border-indigo-500/30 hover:shadow-md'
    )}>
      {/* Priority + tags */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className={cn('w-1.5 h-1.5 rounded-full', pc.dot)} />
        <Badge className={cn('text-[9px] px-1.5 py-0 capitalize border-0', pc.bg, pc.color)}>
          {task.priority}
        </Badge>
        {task.tags.slice(0, 1).map(t => (
          <Badge key={t} variant="secondary" className="text-[9px] px-1.5 py-0">{t}</Badge>
        ))}
      </div>

      {/* Title */}
      <div className="text-sm font-medium mb-2 line-clamp-2 leading-snug">{task.title}</div>

      {/* Project */}
      <div className="text-xs text-muted-foreground mb-2">{task.projectName}</div>

      {/* Skills required */}
      {task.requiredSkills.length > 0 && (
        <div className="flex items-center gap-1 mb-2 flex-wrap">
          {task.requiredSkills.slice(0, 2).map(s => (
            <span key={s.skillId} className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {s.skillName}
            </span>
          ))}
        </div>
      )}

      {/* Progress */}
      {task.loggedHours > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>{task.loggedHours}h logged</span>
            <span>{task.estimatedHours}h est.</span>
          </div>
          <div className="h-1 rounded-full bg-muted">
            <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 mt-1">
        {task.assignedToName && (
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[9px] font-bold text-indigo-600">
              {task.assignedToName.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-[10px] text-muted-foreground">{task.assignedToName.split(' ')[0]}</span>
          </div>
        )}
        <div className="flex items-center gap-1 ml-auto text-[10px] text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}

function DraggableCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });
  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
}

function KanbanColumn({ column, tasks }: { column: typeof COLUMNS[0]; tasks: Task[] }) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id });
  return (
    <div ref={setNodeRef}
      className={cn(
        'flex flex-col min-h-96 rounded-2xl border transition-all',
        isOver ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-border bg-muted/20'
      )}
      style={{ minWidth: 240 }}>
      {/* Column header */}
      <div className="px-3 py-3 flex items-center gap-2 border-b border-border">
        <span className={cn('text-sm font-semibold', column.color)}>{column.label}</span>
        <span className="ml-auto text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{tasks.length}</span>
      </div>
      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {tasks.map(t => <DraggableCard key={t.id} task={t} />)}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-muted-foreground/50">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [allTasks, setAllTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const filtered = allTasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.projectName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(allTasks.find(t => t.id === event.active.id) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    if (COLUMNS.find(c => c.id === newStatus)) {
      setAllTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
  };

  return (
    <div>
      <Topbar title="Tasks" />
      <div className="p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Search tasks..." />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-border overflow-hidden">
            {['kanban', 'list'].map(v => (
              <button key={v} onClick={() => setView(v as typeof view)}
                className={cn('px-3 py-1.5 text-xs font-medium transition-all capitalize', view === v ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
                {v}
              </button>
            ))}
          </div>
          <Button size="sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} className="text-white gap-1.5">
            <Plus className="w-4 h-4" /> New Task
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          {COLUMNS.map(col => {
            const count = filtered.filter(t => t.status === col.id).length;
            return (
              <div key={col.id} className="flex items-center gap-1.5 text-sm">
                <span className={cn('font-semibold', col.color)}>{count}</span>
                <span className="text-muted-foreground">{col.label}</span>
              </div>
            );
          })}
        </div>

        {/* Kanban */}
        {view === 'kanban' && (
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {COLUMNS.map(col => (
                <div key={col.id} className="flex-shrink-0 w-60">
                  <KanbanColumn column={col} tasks={filtered.filter(t => t.status === col.id)} />
                </div>
              ))}
            </div>
            <DragOverlay>
              {activeTask && <TaskCard task={activeTask} isDragging />}
            </DragOverlay>
          </DndContext>
        )}

        {/* List view */}
        {view === 'list' && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Task', 'Project', 'Priority', 'Status', 'Assigned', 'Deadline', 'Progress'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => {
                  const pc = priorityConfig[task.priority];
                  const progress = task.estimatedHours > 0 ? Math.round((task.loggedHours / task.estimatedHours) * 100) : 0;
                  return (
                    <tr key={task.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-4 py-3 font-medium max-w-48 truncate">{task.title}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{task.projectName}</td>
                      <td className="px-4 py-3">
                        <Badge className={cn('text-xs border-0 capitalize', pc.bg, pc.color)}>{task.priority}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-xs text-muted-foreground">{task.status.replace('_', ' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{task.assignedToName || '—'}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted">
                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
