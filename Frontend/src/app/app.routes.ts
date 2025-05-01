import { Routes } from '@angular/router';
import { CreateExamComponent } from './Pages/create-exam/create-exam.component';
import { ExamsComponent } from './Pages/exams/exams.component';
import { ExamComponent } from './Pages/exam/exam.component';
import { StudentsResultsComponent } from './Pages/students-results/students-results.component';
import { UpdateExamComponent } from './Pages/update-exam/update-exam.component';

export const routes: Routes = [
  {
    path: 'create-exam',
    component: CreateExamComponent,
  },
  {
    path: 'exams',
    component: ExamsComponent,
  },
  {
    path: 'exam/:examId',
    component: ExamComponent,
  },
  {
    path: 'update-exam/:id',
    component: UpdateExamComponent,
  },
  {
    path: 'students-results',
    component: StudentsResultsComponent,
  },
  {
    path: '',
    redirectTo: '/exams',
    pathMatch: 'full',
  },
];
