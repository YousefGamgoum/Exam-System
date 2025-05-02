// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common'; // Add this
// import { ExamService } from '../../services/exam.service';
// import { Exam } from '../../models/exam';

// @Component({
//   selector: 'app-results',
//   standalone: true,
//   imports: [CommonModule], // Add this
//   templateUrl: './results.component.html',
//   styleUrl: './results.component.css',
// })
// export class ResultsComponent implements OnInit {
//   results: { _id: string; exam: Exam; score: number; createdAt: string }[] = [];
//   errorMessage: string = '';

//   constructor(private examService: ExamService) {}

//   ngOnInit(): void {
//     this.loadResults();
//   }

//   loadResults(): void {
//     this.examService.getMyResults().subscribe({
//       next: (response) => {
//         if (response.status === 'success') {
//           this.results = response.data;
//         }
//       },
//       error: (err) => {
//         this.errorMessage = err.error.message || 'Failed to load results';
//       },
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../Services/exam.service';
import { Exam } from '../../models/exam';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  results: {
    _id: string;
    exam: Exam;
    score: number;
    createdAt: string;
    userName: string;
  }[] = [];
  errorMessage: string = '';

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.examService.getMyResults().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.results = response.data;
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Failed to load results';
      },
    });
  }
}
