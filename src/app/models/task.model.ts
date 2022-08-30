export interface Task {
  id: string;
  title: string;
  description: string;
  userId: string;
  order: number;
  boardId?: string;
  columnId?: string;
  files?: [];
}
