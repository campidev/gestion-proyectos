export interface Assignment {
  assignmentId?: number;
  taskId: number;
  userId: string;
  role: string;       // Ej: "desarrollador", "tester", "líder"
  assignedAt?: string;
  taskName?: string; // fecha de asignación
  userName?: string; // fecha de asignación
}
