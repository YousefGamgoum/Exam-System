import { Routes } from '@angular/router';
// import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ExamListComponent } from './pages/exam-list/exam-list.component';
import { TakeExamComponent } from './pages/take-exam/take-exam.component';
import { ResultsComponent } from './pages/results/results.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'exam-list', component: ExamListComponent, canActivate: [AuthGuard] },
  {
    path: 'take-exam/:id',
    component: TakeExamComponent,
    canActivate: [AuthGuard],
  },
  { path: 'results', component: ResultsComponent, canActivate: [AuthGuard] },
];
