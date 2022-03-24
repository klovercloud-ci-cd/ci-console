import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'kcci-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
})
export class AddCompanyComponent implements OnInit {
  selectedValue: string = '';
  selectedCar: string = '';

  foods: Food[] = [
    { value: 'bitbucket', viewValue: 'Bitbucket' },
    { value: 'github', viewValue: 'Github' },
    { value: 'gitlab', viewValue: 'Gitlab' },
  ];
  isLoading = false;

  registrationForm = this.fb.group(
    {
      id: ['', [Validators.required]],
      type: ['', Validators.required],
      token: ['', [Validators.required]],
      auth_type: ['password'],
      applications: new FormGroup({}),
    },
    {
      // validator: this.confirmPasswordMatch('password', 'c_password'),
    }
  );

  constructor(private fb: FormBuilder) {}

  getToken() {
    alert('Token is Coming...');
  }

  registrationFormData() {
    this.isLoading = true;
    const formData = this.registrationForm.value;
    delete formData['c_password'];
    delete formData['checked'];
    formData['phone'] = formData.phone.toString();
    console.log('Form Values: ', this.registrationForm.value);

    // this.authService.signUp(formData).subscribe(
    //   (res) => {
    //     if (res.status === 'success') {
    //       this.isLoading = false;
    //       this.router.navigate(['/auth/login']);
    //       this.openSnackBar('Registration Successfull', '');
    //     }
    //     console.log(res.status);
    //     console.log(this.authService.getUserData(), 'USER');
    //   },
    //   (err) => {
    //     this.openSnackBarError('Authentication Error', '');
    //     console.log('err', err);
    //   }
    // );
  }
  ngOnInit(): void {}
}
