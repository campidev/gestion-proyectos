export interface Task {
  taskId?: number;
  title: string;
  projectName?: string;
  sprintName?: string;
  description: string;
  status: string;     // pendiente, en progreso, completada
  priority: string;   // baja, media, alta
  dueDate: string;    // ISO string (yyyy-MM-dd)
  projectId: number;
  sprintId: number;
}
