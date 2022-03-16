import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  addUserForm = this.fb.group({
    firstname: [''],
    lastname: [''],
    email: [''],
    phone: [''],
    password: [''],
  });

  constructor(private fb: FormBuilder) {}
  addUserFormData() {
    console.log('Form Value:', this.addUserForm.value);
  }
  // addUserFormData(){
  //   // this.addUser.saveUser(this.addUserForm.value).subscribe((response)=>{
  //   //   this.router.navigate(['/user-list'])
  //     console.log("Form Value:",this.addUserForm.value)
  //   })
  // }

  ngOnInit(): void {}
  get emailField(): any {
    return this.addUserForm.get('email');
  }
}
