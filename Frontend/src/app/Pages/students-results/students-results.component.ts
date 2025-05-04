import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../Services/exam.service';

@Component({
  selector: 'app-admin-student-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students-results.component.html',
  styleUrl: './students-results.component.css',
})
export class StudentResultsComponent implements OnInit {
  examResults: any[] = [];
  filteredResults: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  examFilter: string = '';
  uniqueExams: string[] = [];
  selectedResult: any = null;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.examService.getAllStudentResults().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.examResults = response.data;
          this.filteredResults = [...this.examResults];
          console.log(this.filteredResults);
          this.extractUniqueExams();
          console.log('Exam Results loaded successfully:', this.examResults);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load results';
        this.loading = false;
        console.error('Error loading results:', err);
      },
    });
  }

  extractUniqueExams(): void {
    // Extract unique exam names for the filter
    this.uniqueExams = Array.from(
      new Set(this.examResults.map((result) => result.exam.name))
    );
  }

  applyFilters(): void {
    this.filteredResults = this.examResults.filter((result) => {
      // Apply search filter
      const searchMatch =
        !this.searchTerm ||
        result.user.username
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        result.exam.name?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Apply exam filter
      const examMatch =
        !this.examFilter || result.exam.name === this.examFilter;

      return searchMatch && examMatch;
    });
  }

  calculatePercentage(score: number, totalMarks: number): number {
    if (!totalMarks) return 0;
    return Math.round((score / totalMarks) * 100);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // إضافة AM/PM لتوضيح التوقيت
    });
  }

  viewDetails(result: any): void {
    this.selectedResult = result;
    const modalRef = document.getElementById('resultDetailsModal');
    if (modalRef) {
      modalRef.classList.add('show');
      modalRef.style.display = 'block';
      document.body.classList.add('modal-open');

      // إضافة الـ backdrop
      let backdrop = document.querySelector('.modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    }
  }

  closeModal(): void {
    const modalRef = document.getElementById('resultDetailsModal');
    if (modalRef) {
      modalRef.classList.remove('show');
      modalRef.style.display = 'none';
      document.body.classList.remove('modal-open');

      // إزالة الـ backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  sortResults(column: string): void {
    // Sorting logic can be implemented based on the column
  }
}
