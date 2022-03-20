import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {AuthService} from "../auth.service";
import {TokenService} from "../token.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  addUserForm = this.fb.group({
    name: [''],
    email: [''],
    phone: [''],
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private tokenService: TokenService,
              private router : Router
  ) {}
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
    if (this.authService.isLogin()){
      this.router.navigate([''])
    }
  }
}
