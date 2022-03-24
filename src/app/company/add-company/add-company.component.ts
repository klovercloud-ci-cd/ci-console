import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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
  showAddApp = false;
  showAddRepo = false;
  formDataFormat: any;
  repoData: any = [];

  get hobbyControls() {
    return (<FormArray>this.attachCompanyForm.get('hobbies')).controls;
  }

  attachCompanyForm = this.fb.group(
    {
      companyId: ['', Validators.required],
      name: [''],
      // hobbies: new FormArray([]),
      repositories: this.fb.array([], [Validators.required]),
      //   }),
      // ]),

      // addRepository: this.fb.group({

      // }),
    }
    // {
    //   companyId: ['', Validators.required],
    //   name: [''],
    //   repositories: this.fb.array([
    //     this.fb.group({
    //       id: ['', [Validators.required]],
    //       type: ['', Validators.required],
    //       token: ['', [Validators.required]],
    //       auth_type: ['password'],
    //       applications: this.fb.array([]),
    //     }),
    //   ]),
    // }
  );

  addHobby() {
    const control = new FormControl(null);
    (<FormArray>this.attachCompanyForm.get('hobbies')).push(control);
  }

  // Application
  applicaitonVal!: string;
  applicaitonVal1!: string;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  // Form Repo
  get repositories(): FormArray {
    return this.attachCompanyForm.get('repositories') as FormArray;
  }

  repoFormGroup(): FormGroup {
    return this.fb.group({
      id: [, [Validators.required]],
      type: ['', [Validators.required]],
      token: ['', [Validators.required]],
      auth_type: ['password'],
      applications: this.fb.array([]),
    });
  }

  addRepoFormGroupControl(): void {
    (<FormArray>this.repositories).push(this.repoFormGroup());
  }

  // Form Array

  repoApplication(repoIndex: number): FormArray {
    return <FormArray>this.repositories.at(repoIndex).get('applications');
  }

  addApplicaitonControl(repoIndex: string): void {}

  // addRepositoryControl() {
  //   let repo = {
  //     id: this.attachCompanyForm.value.id,
  //     type: this.attachCompanyForm.value.type,
  //     token: this.attachCompanyForm.value.token,
  //     auth_type: this.attachCompanyForm.value.auth_type,
  //     applications: this.attachCompanyForm.value.applications,
  //   };
  //   this.repoData.push(repo);
  //   console.log('Repo Added!', this.repoData);
  //   this.attachCompanyForm.value.id = '';
  //   this.attachCompanyForm.value.type = '';
  //   this.attachCompanyForm.value.token = '';
  //   this.attachCompanyForm.value.auth_type = '';
  // }

  addApplicaiton(repoIndex: number): void {
    console.log(this.repoApplication(repoIndex));
    this.repoApplication(repoIndex).push(
      new FormControl('', [Validators.required])
    );
  }

  // removeApplicaiton(empIndex:number) {
  //   this.addApplicaiton().removeAt(empIndex);
  // }

  // ---------------------------------------------

  getToken() {
    alert('Token is Coming...');
  }

  attachCompanyFormData() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
    console.log(this.attachCompanyForm.value);
  }
}
