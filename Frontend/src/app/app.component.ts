import { Component } from '@angular/core';
import { CreateExamComponent } from './Pages/create-exam/create-exam.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CreateExamComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Exam-System';
}
