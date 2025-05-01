import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; // Add this
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../models/exam';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [RouterLink], // Add this
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.css',
})
export class ExamListComponent implements OnInit {
  exams: Exam[] = [];
  errorMessage: string = '';

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.examService.getAvailableExams().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.exams = response.data;
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Failed to load exams';
      },
    });
  }
}
