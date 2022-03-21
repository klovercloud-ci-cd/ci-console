import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  durationInSeconds = 5;

  registrationForm = this.fb.group(
    {
      first_name: ['', [Validators.required, Validators.maxLength(15)]],
      last_name: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      c_password: ['', Validators.required],
      checked: [false, Validators.requiredTrue],
      auth_type: ['password'],
    },
    {
      validator: this.confirmPasswordMatch('password', 'c_password'),
    }
  );
  isLoading = true;

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  registrationFormData() {
    this.isLoading = true;
    const formData = this.registrationForm.value;
    delete formData['c_password'];
    delete formData['checked'];
    formData['phone'] = formData.phone.toString();

    this.authService.signUp(formData).subscribe(
      (res) => {
        if (res.status === 'success') {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          this.openSnackBar('Successfull', '');
        }
        console.log(res.status);
        console.log(this.authService.getUserData(), 'USER');
      },
      (err) => {
        console.log('err', err);
      }
    );
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
    return this.registrationForm.get('email');
  }
}
