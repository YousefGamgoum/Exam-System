// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-admin',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './admin.component.html',
//   styleUrls: ['./admin.component.css'],
// })
// export class AdminComponent implements OnInit {
//   exams: any[] = [];
//   newExam = {
//     title: '',
//     description: '',
//     duration: 0,
//     questions: [
//       { questionText: '', options: ['', '', '', ''], correctAnswer: '' },
//     ],
//   };
//   isEditing = false;
//   editExamId: string | null = null;

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.loadExams();
//   }

//   loadExams(): void {
//     this.http.get('http://localhost:3000/exams/availableExams').subscribe({
//       next: (response: any) => {
//         this.exams = response.data;
//       },
//       error: (err) => {
//         console.error('Error loading exams:', err);
//       },
//     });
//   }

//   addQuestion(): void {
//     this.newExam.questions.push({
//       questionText: '',
//       options: ['', '', '', ''],
//       correctAnswer: '',
//     });
//   }

//   removeQuestion(index: number): void {
//     this.newExam.questions.splice(index, 1);
//   }

//   createExam(): void {
//     this.http.post('http://localhost:3000/exams', this.newExam).subscribe({
//       next: () => {
//         this.loadExams();
//         this.resetForm();
//       },
//       error: (err) => {
//         console.error('Error creating exam:', err);
//       },
//     });
//   }

//   editExam(exam: any): void {
//     this.isEditing = true;
//     this.editExamId = exam._id;
//     this.newExam = { ...exam };
//   }

//   updateExam(): void {
//     if (this.editExamId) {
//       this.http
//         .put(`http://localhost:3000/exams/${this.editExamId}`, this.newExam)
//         .subscribe({
//           next: () => {
//             this.loadExams();
//             this.resetForm();
//           },
//           error: (err) => {
//             console.error('Error updating exam:', err);
//           },
//         });
//     }
//   }

//   deleteExam(examId: string): void {
//     if (confirm('Are you sure you want to delete this exam?')) {
//       this.http.delete(`http://localhost:3000/exams/${examId}`).subscribe({
//         next: () => {
//           this.loadExams();
//         },
//         error: (err) => {
//           console.error('Error deleting exam:', err);
//         },
//       });
//     }
//   }

//   resetForm(): void {
//     this.newExam = {
//       title: '',
//       description: '',
//       duration: 0,
//       questions: [
//         { questionText: '', options: ['', '', '', ''], correctAnswer: '' },
//       ],
//     };
//     this.isEditing = false;
//     this.editExamId = null;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../../services/exam.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  exams: any[] = [];
  results: {
    _id: string;
    examName: string;
    score: number;
    createdAt: string;
    userName: string;
  }[] = [];
  newExam = {
    name: '',
    description: '',
    totalMarks: 0,
    questions: [
      {
        text: '',
        marks: 0,
        choices: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ],
  };
  isEditing = false;
  editExamId: string | null = null;
  errorMessage: string = '';

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit(): void {
    this.loadExams();
    this.loadResults();
  }

  loadExams(): void {
    this.examService.getAvailableExams().subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.exams = response.data;
        }
      },
      error: (err) => {
        console.error('Error loading exams:', err);
      },
    });
  }

  loadResults(): void {
    this.examService.getAllStudentResults().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.results = response.data;
        }
      },
      error: (err) => {
        const message = err.error?.message || 'Failed to load results';
        this.errorMessage = message;
        if (message.includes('Please login')) {
          setTimeout(() => {
            this.router.navigate(['/account/login']);
          }, 2000);
        }
      },
    });
  }

  addQuestion(): void {
    this.newExam.questions.push({
      text: '',
      marks: 0,
      choices: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    });
  }

  removeQuestion(index: number): void {
    this.newExam.questions.splice(index, 1);
    this.calculateTotalMarks();
  }

  calculateTotalMarks(): void {
    this.newExam.totalMarks = this.newExam.questions.reduce(
      (sum, question) => sum + (question.marks || 0),
      0
    );
  }

  createExam(): void {
    this.calculateTotalMarks();
    this.examService.createExam(this.newExam).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.loadExams();
          this.resetForm();
        }
      },
      error: (err) => {
        console.error('Error creating exam:', err);
      },
    });
  }

  editExam(exam: any): void {
    this.isEditing = true;
    this.editExamId = exam._id;
    this.newExam = { ...exam };
  }

  updateExam(): void {
    if (this.editExamId) {
      this.calculateTotalMarks();
      this.examService.updateExam(this.editExamId, this.newExam).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.loadExams();
            this.resetForm();
          }
        },
        error: (err) => {
          console.error('Error updating exam:', err);
        },
      });
    }
  }

  deleteExam(examId: string): void {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.deleteExam(examId).subscribe({
        next: () => {
          this.loadExams();
        },
        error: (err) => {
          console.error('Error deleting exam:', err);
        },
      });
    }
  }

  resetForm(): void {
    this.newExam = {
      name: '',
      description: '',
      totalMarks: 0,
      questions: [
        {
          text: '',
          marks: 0,
          choices: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        },
      ],
    };
    this.isEditing = false;
    this.editExamId = null;
  }
}
