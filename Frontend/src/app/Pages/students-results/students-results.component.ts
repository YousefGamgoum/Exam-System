import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../Services/exam.service';

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students-results.component.html',
  styleUrl: './students-results.component.css',
})
export class StudentResultsComponent implements OnInit {
  examResults: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  noResults: boolean = false;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.examService.getAllStudentResults().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          console.log(response.data);
          this.examResults = response.data;
          this.noResults = this.examResults.length === 0;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load results';
        this.loading = false;
      },
    });
  }
}
