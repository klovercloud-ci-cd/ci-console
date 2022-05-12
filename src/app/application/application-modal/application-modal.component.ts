import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'kcci-application-modal',
  templateUrl: './application-modal.component.html',
  styleUrls: ['./application-modal.component.scss'],
})
export class ApplicationModalComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ApplicationModalComponent>
  ) {}

  ngOnInit(): void {}
  addApplication = this.fb.group({
    name: ['', Validators.required],
    url: ['', Validators.required],
  });
  addApplicationFormData() {
    console.log('App Form', this.addApplication.value);
    this.dialogRef.close();
  }
}
