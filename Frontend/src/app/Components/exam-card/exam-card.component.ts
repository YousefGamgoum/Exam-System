import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-card.component.html',
  styleUrl: './exam-card.component.css',
})
export class ExamCardComponent {
  @Input() title: string = '';
  @Input() totalMarks: number = 0;
  @Input() questionCount: number = 0;
  @Input() studentCount: number = 0;
}
