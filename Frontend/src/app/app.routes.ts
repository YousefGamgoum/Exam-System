import { Routes } from '@angular/router';
import { RegisterComponent } from './Pages/account/register/register.component';
import { LoginComponent } from './Pages/account/login/login.component';
import { ExamListComponent } from './Pages/exam-list/exam-list.component';
import { TakeExamComponent } from './Pages/take-exam/take-exam.component';
import { ResultsComponent } from './Pages/results/results.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './Pages/home/home.component';
import { AccountComponent } from './Pages/account/account.component';
import { CreateExamComponent } from './Pages/create-exam/create-exam.component';
import { ExamsComponent } from './Pages/exams/exams.component';
import { ExamComponent } from './Pages/exam/exam.component';
import { StudentResultsComponent } from './Pages/students-results/students-results.component';
import { UpdateExamComponent } from './Pages/update-exam/update-exam.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'exam-list', component: ExamListComponent, canActivate: [AuthGuard] },
  {
    path: 'take-exam/:id',
    component: TakeExamComponent,
    canActivate: [AuthGuard],
  },
  { path: 'results', component: ResultsComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: ExamsComponent, canActivate: [AuthGuard] },
  {
    path: 'account',
    component: AccountComponent,
    children: [
      { path: '', redirectTo: 'register', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
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
    component: StudentResultsComponent,
  },
];
