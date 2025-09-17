export interface Sprint {
  sprintId: number;
  name: string;
  startDate: string;   // ISO date string
  endDate: string;     // ISO date string
  projectId: number;
  projectName?:string;
}
