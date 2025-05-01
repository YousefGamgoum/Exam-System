import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = 'http://localhost:3000/exams/create';

  constructor(private http: HttpClient) {}

  createExam(examData: any): Observable<any> {
    return this.http.post(this.apiUrl, examData);
  }
}
