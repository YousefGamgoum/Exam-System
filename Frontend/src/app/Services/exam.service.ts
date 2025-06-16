import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam } from '../models/exam';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Get all available exams
  getAvailableExams(): Observable<{
    status: string;
    data: Exam[];
    message?: string;
  }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ status: string; data: Exam[]; message?: string }>(
      `${this.apiUrl}/exams`,
      { headers }
    );
  }

  getAllExams(): Observable<{
    status: string;
    data: Exam[];
    message?: string;
  }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ status: string; data: Exam[]; message?: string }>(
      `${this.apiUrl}/exams/all`,
      { headers }
    );
  }

  // Get exam by ID
  getExamById(
    id: string
  ): Observable<{ status: string; data: Exam; message?: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ status: string; data: Exam; message?: string }>(
      `${this.apiUrl}/exams/${id}`,
      { headers }
    );
  }

  // Get exam result by ID
  getExamResultById(
    id: string
  ): Observable<{ status: string; data: any; message?: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ status: string; data: any; message?: string }>(
      `${this.apiUrl}/exams/${id}/exam-result`,
      { headers }
    );
  }

  // Create new exam
  createExam(
    exam: any
  ): Observable<{ status: string; data: Exam; message?: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<{ status: string; data: Exam; message?: string }>(
      `${this.apiUrl}/exams/create`,
      exam,
      { headers }
    );
  }

  // Update existing exam
  updateExam(
    id: string,
    exam: any
  ): Observable<{ status: string; data: Exam; message?: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<{ status: string; data: Exam; message?: string }>(
      `${this.apiUrl}/exams/${id}`,
      exam,
      { headers }
    );
  }

  // Delete exam
  deleteExam(id: string): Observable<{ status: string; message?: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<{ status: string; message?: string }>(
      `${this.apiUrl}/exams/${id}`,
      { headers }
    );
  }

  // Submit exam answers
  submitExam(
    examId: string,
    answers: { questionIndex: number; selectedChoiceIndex: number }[]
  ): Observable<{
    status: string;
    data: { score: number; result: any };
    message?: string;
  }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const body = { examId, answers };
    return this.http.post<{
      status: string;
      data: { score: number; result: any };
      message?: string;
    }>(`${this.apiUrl}/exams/submit`, body, { headers });
  }

  // Get student's own results
  getMyResults(): Observable<{
    status: string;
    data: {
      _id: string;
      exam: Exam;
      score: number;
      createdAt: string;
      userName: string;
    }[];
    message?: string;
  }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{
      status: string;
      data: {
        _id: string;
        exam: Exam;
        score: number;
        createdAt: string;
        userName: string;
      }[];
      message?: string;
    }>(`${this.apiUrl}/results/my-results`, { headers });
  }

  // Get all students' results (admin only)
  getAllStudentResults(): Observable<{
    status: string;
    data: any[];
    message?: string;
  }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{
      status: string;
      data: any[];
      message?: string;
    }>(`${this.apiUrl}/exams/students-results`, { headers });
  }

  // Get exams with submission counts
  getExamsWithCounts(): Observable<{
    status: string;
    data: { examResults: any[] };
    message?: string;
  }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{
      status: string;
      data: { examResults: any[] };
      message?: string;
    }>(`${this.apiUrl}/exams/with-counts`, { headers });
  }
}
