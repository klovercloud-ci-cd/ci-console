import  { HttpClient } from '@angular/common/http';
import  { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import  { FormBuilder} from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import  { Router } from '@angular/router';
import  { SharedSnackbarService } from 'src/app/shared/snackbar/shared-snackbar.service';
import { ConfirmPasswordMatch } from 'src/app/shared/validators/confirmPassword.validator';
import  { AuthService } from '../auth.service';

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
      validator: ConfirmPasswordMatch('password', 'c_password'),
    }
  );

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private snack: SharedSnackbarService,
  ) {}

  ngOnInit(): void {}

  registrationFormData() {
    this.isLoading = true;
    const formData = this.registrationForm.value;
    delete formData.c_password;
    delete formData.checked;
    formData.phone = formData.phone.toString();

    this.authService.signUp(formData).subscribe(
      (res) => {
        if (res.status === 'success') {
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
          this.snack.openSnackBar('Registration Successfull', 'You can login now','sb-success');
        }
      },
      (err) => {
        this.isLoading = false;
        this.snack.openSnackBar('Registration Failed!', 'Please submit valid credentials.','sb-warn');
      }
    );
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
