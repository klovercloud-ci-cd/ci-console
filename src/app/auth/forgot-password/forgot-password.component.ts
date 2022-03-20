import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'kcci-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPass = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private fb: FormBuilder) {}
  forgotPassData() {
    console.log('Form Value:', this.forgotPass.value);
    // setTimeout(() => {
    //   this.router.navigate(['/auth/login']);
    // }, 1000);
  }
  ngOnInit(): void {}
}
