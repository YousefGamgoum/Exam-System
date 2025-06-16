import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { QuestionComponent } from './Components/question/question.component';
import { CreateExamComponent } from './Pages/create-exam/create-exam.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule,
    AppComponent,
    QuestionComponent,
    CreateExamComponent,
  ],
  providers: [],
})
export class AppModule {}
