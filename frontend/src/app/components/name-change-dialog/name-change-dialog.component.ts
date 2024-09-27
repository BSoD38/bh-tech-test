import { Component, inject, Inject, Input, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-name-change-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatLabel,
  ],
  templateUrl: './name-change-dialog.component.html',
  styleUrl: './name-change-dialog.component.scss',
})
export class NameChangeDialogComponent implements OnInit {
  usernameControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(64),
  ]);
  readonly dialogRef = inject(MatDialogRef<NameChangeDialogComponent>);
  readonly data = inject<{ username: string }>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    if (this.data.username) {
      this.usernameControl.setValue(this.data.username);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
