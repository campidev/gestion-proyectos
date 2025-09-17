import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comment } from '../../models/comment.model';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-comment-dialog',
    standalone:true,
    imports: [
      FormsModule,
      MatDialogModule,
      MatInputModule,
      MatFormField,
      MatLabel,      
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      MatDialogModule,
      ReactiveFormsModule
  ],
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css']
})
export class CommentDialogComponent {
  commentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Comment | null
  ) {
    this.commentForm = this.fb.group({
      content: [data?.content || '', Validators.required],         
    });
  }

  save(): void {
    if (this.commentForm.valid) {
      this.dialogRef.close(this.commentForm.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
