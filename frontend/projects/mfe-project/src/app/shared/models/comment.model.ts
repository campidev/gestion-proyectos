export interface Comment {
  commentId?: number;
  content: string;
  taskId: number;
  userId?: number;
  createdAt?: string;
  taskName?: string;
  userName?: string;
}
