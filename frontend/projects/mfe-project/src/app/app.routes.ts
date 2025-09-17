import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { SprintsComponent } from './shared/components/sprints/sprints.component';
import { CommentsComponent } from './shared/components/comments/comments.component';
import { TasksComponent } from './shared/components/tasks/tasks.component';
import { AssignmentsComponent } from './shared/components/assignments/assignments.component';
import { ProjectsComponent } from './shared/components/projects/projects.component';
import { NgModule } from '@angular/core';
import { AuthGuardMFE } from './core/guards/auth.guard';


export const PROJECT_ROUTES: Routes = [
  { path: '', component: AppComponent },
  { path: 'proyectos', component: ProjectsComponent , canActivate: [AuthGuardMFE], data: { roles: ['ADMIN', 'PROJECT_MANAGER'] },},
  { path: 'sprints', component: SprintsComponent, canActivate: [AuthGuardMFE], data: { roles: ['ADMIN', 'PROJECT_MANAGER'] }, },
  { path: 'comentarios', component: CommentsComponent },
  { path: 'tareas', component: TasksComponent },
  { path: 'asignaciones', component: AssignmentsComponent, canActivate: [AuthGuardMFE], data: { roles: ['ADMIN', 'PROJECT_MANAGER'] }, },
];

@NgModule({
  imports: [RouterModule.forRoot(PROJECT_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {}