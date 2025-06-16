import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

interface User {
  _id: string;
  email: string;
  username: string;
}

interface ExamResult {
  _id: string;
  score: number;
  user: User[];
  createdAt: string;
}

interface Exam {
  _id: string;
  name: string;
  description: string;
  totalMarks: number;
  questionCount: number;
  available: boolean;
}

interface ApiResponse {
  status: string;
  data: {
    exam: Exam;
    results: ExamResult[];
  };
}

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent implements OnInit {
  exam: Exam | null = null;
  results: ExamResult[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const examId = params['examId'];
      this.fetchExamDetails(examId);
    });
  }

  fetchExamDetails(examId: string) {
    this.http
      .get<ApiResponse>(`http://localhost:3000/exams/${examId}/exam-result`)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.exam = response.data.exam;
          this.results = response.data.results;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to fetch exam details';
          this.loading = false;
          console.error('Error fetching exam details:', err);
        },
      });
  }

  navigateToUpdate(examId: string) {
    this.router.navigate(['/update-exam', examId]);
  }

  deleteExam(examId: string, event: Event) {
    event.stopPropagation(); // Prevent card click event
    event.preventDefault();
    if (confirm('Are you sure you want to Disable this exam?')) {
      this.http.delete(`http://localhost:3000/exams/${examId}`).subscribe({
        next: () => {
          this.fetchExamDetails(examId);
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
            this.fetchExamDetails(examId);
          },
          error: (err) => {
            alert('Failed to delete exam. Please try again.');
            console.error('Error deleting exam:', err);
          },
        });
    }
  }
}
