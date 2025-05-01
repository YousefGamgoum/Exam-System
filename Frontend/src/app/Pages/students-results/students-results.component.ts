import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface ExamResult {
  _id: string;
  score: number;
  exam: {
    _id: string;
    name: string;
    totalMarks: number;
    questionCount: number;
  };
  user: {
    _id: string;
    email: string;
    name: string;
  };
}

interface ApiResponse {
  status: string;
  data: ExamResult[];
}

@Component({
  selector: 'app-students-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students-results.component.html',
  styleUrl: './students-results.component.css',
})
export class StudentsResultsComponent implements OnInit {
  examResults: ExamResult[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchExamResults();
  }

  fetchExamResults() {
    this.http
      .get<ApiResponse>('http://localhost:3000/exams/students-results')
      .subscribe({
        next: (response) => {
          this.examResults = response.data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to fetch exam results';
          this.loading = false;
          console.error('Error fetching exam results:', err);
        },
      });
  }
}
