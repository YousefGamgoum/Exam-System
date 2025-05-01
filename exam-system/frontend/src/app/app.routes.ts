import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/account/register/register.component';
import { LoginComponent } from './pages/account/login/login.component';
import { ExamListComponent } from './pages/exam-list/exam-list.component';
import { TakeExamComponent } from './pages/take-exam/take-exam.component';
import { ResultsComponent } from './pages/results/results.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { AccountComponent } from './pages/account/account.component';
import { AdminComponent } from './pages/admin/admin.component';

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
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },

  {
    path: 'account',
    component: AccountComponent,
    children: [
      { path: '', redirectTo: 'register', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
];
