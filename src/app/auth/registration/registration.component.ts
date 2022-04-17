import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedSnackbarService } from 'src/app/shared/snackbar/shared-snackbar.service';

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
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      c_password: ['', Validators.required],
      checked: [false, Validators.requiredTrue],
      auth_type: ['password'],
    },
    {
      validator: this.confirmPasswordMatch('password', 'c_password'),
    }
  );
  isLoading = false;

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private snack: SharedSnackbarService,
  ) {}

  ngOnInit(): void {
    this.snack.openSnackBar('Authentication Error!','Please check the Credentials again.', 2000,'sb-error');    
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
          this.snack.openSnackBar('Registration Successfull', 'You can login now', 10000,'sb-success');
        }
        console.log(res.status);
        console.log(this.authService.getUserData(), 'USER');
      },
      (err) => {
        this.isLoading = false;
        this.snack.openSnackBar('Registration Failed!', 'Please submit valid credentials.', 10000,'sb-error');
        console.log('err', err);
      }
    );
  }

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

  phoneNumberCheck(phoneNumber: number) {
    //  var regEx = ^\+{0,2}([\-\. ])?(\(?\d{0,3}\))?([\-\. ])?\(?\d{0,3}\)?([\-\. ])?\d{3}([\-\. ])?\d{4};
    //  if(phoneNumber.value.match(regEx))
    //    {
    //     return true;
    //    }
    //  else
    //    {
    //    alert("Please enter a valid phone number.");
    //    return false;
    //    }
  }

  get emailField(): any {
    return this.registrationForm.get('email');
  }
}
