import { ExamService } from '../../Services/exam.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

interface Exam {
  _id: string;
  name: string;
  totalMarks: number;
  questionCount: number;
  submissionCount: number;
  available: boolean;
}

interface ApiResponse {
  status: string;
  data: {
    examResults: Exam[];
  };
  message?: string;
}

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit() {
    this.fetchExams();
  }

  fetchExams() {
    this.http.get<ApiResponse>('http://localhost:3000/exams/all').subscribe({
      next: (response) => {
        this.exams = response.data.examResults;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch exams';
        this.loading = false;
        console.error('Error fetching exams:', err);
      },
    });
  }

  deleteExam(examId: string, event: Event) {
    event.stopPropagation(); // Prevent card click event
    event.preventDefault();
    if (confirm('Are you sure you want to Disable this exam?')) {
      this.http.delete(`http://localhost:3000/exams/${examId}`).subscribe({
        next: () => {
          this.fetchExams();
        },
        error: (err) => {
          alert('Failed to delete exam. Please try again.');
          console.error('Error deleting exam:', err);
        },
      });
    }
  }
  EnableExam(examId: string, event: Event) {
    event.stopPropagation(); // Prevent card click event
    event.preventDefault();
    if (confirm('Are you sure you want to enable this exam?')) {
      this.http
        .post(`http://localhost:3000/exams/${examId}/enable`, {})
        .subscribe({
          next: () => {
            this.fetchExams();
          },
          error: (err) => {
            alert('Failed to delete exam. Please try again.');
            console.error('Error deleting exam:', err);
          },
        });
    }
  }
  navigateToUpdate(examId: string, event: Event) {
    event.stopPropagation(); // Prevent card click event
    this.router.navigate(['/update-exam', examId]);
  }
}
