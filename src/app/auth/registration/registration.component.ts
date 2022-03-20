import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  registrationForm = this.fb.group(
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  registrationFormData() {
    console.log('Form Value:', this.registrationForm.value);

    this.authService
      .signUp({
        first_name: this.registrationForm.value.firstname,
        last_name: this.registrationForm.value.lastname,
        email: this.registrationForm.value.email,
        phone: this.registrationForm.value.phone,
        password: this.registrationForm.value.password,
        auth_type: 'password',
      })
      .subscribe((res) => {
        console.log(this.authService.getUserData(), 'USER');
      });

    // var formData: any = new FormData();
    // formData.append('first_name', this.registrationForm.value.firstname);
    // formData.append('last_name', this.registrationForm.value.lastname);
    // formData.append('email', this.registrationForm.value.email);
    // formData.append('phone', this.registrationForm.value.phone);
    // formData.append('password', this.registrationForm.value.password);
    // formData.append('auth_type', 'password');
    // console.log('FOrmData: ', formData);

    // this.http
    //   .post('http://192.168.68.162:4200/api/v1/users', formData)
    //   .subscribe({
    //     next: (response) => console.log('This is response: ', response),
    //     error: (error) => console.log(error),
    //   });

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
    return this.registrationForm.get('email');
  }
}
