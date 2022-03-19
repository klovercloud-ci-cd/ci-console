import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  addUserForm = this.fb.group(
    {
      firstname: ['', [Validators.required, Validators.maxLength(15)]],
      lastname: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', Validators.required],
      checked: [false, Validators.requiredTrue],
      c_password: ['', Validators.required],
    },
    {
      validator: this.confirmPasswordMatch('password', 'c_password'),
    }
  );

  constructor(private fb: FormBuilder, private router: Router) {}
  addUserFormData() {
    console.log('Form Value:', this.addUserForm.value);
    // setTimeout(() => {
    //   this.router.navigate(['/auth/login']);
    // }, 1000);
  }

  ngOnInit(): void {}

  confirmPasswordMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmPasswordMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  get emailField(): any {
    return this.addUserForm.get('email');
  }
}
