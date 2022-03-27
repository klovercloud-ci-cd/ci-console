import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AttachCompanyService } from '../attach-company.service';

interface RepoType {
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
  panelOpenState = true;

  repos: RepoType[] = [
    { value: 'bitbucket', viewValue: 'Bitbucket' },
    { value: 'github', viewValue: 'Github' },
    { value: 'gitlab', viewValue: 'Gitlab' },
  ];
  isLoading = false;
  showAddApp = false;
  showAddRepo = false;

  constructor(
    private fb: FormBuilder,
    private attachCompanyService: AttachCompanyService
  ) {}

  ngOnInit(): void {}

  // ----------------- Where it all began -----------------

  formDataFormat: any;
  repoData: any = [];

  // get hobbyControls() {
  //   return (<FormArray>this.attachCompanyForm.get('hobbies')).controls;
  // }

  attachCompanyForm = this.fb.group({
    companyId: ['', Validators.required],
    name: [''],
    repositories: this.fb.array([], [Validators.required]),
  });

  // addHobby() {
  //   const control = new FormControl(null);
  //   (<FormArray>this.attachCompanyForm.get('hobbies')).push(control);
  // }

  // Application
  applicaitonVal!: string;
  applicaitonVal1!: string;

  // Form Repo
  get repositories(): FormArray {
    return this.attachCompanyForm.get('repositories') as FormArray;
  }

  repoFormGroup(): FormGroup {
    return this.fb.group({
      type: ['', [Validators.required]],
      token: ['', [Validators.required]],
      auth_type: ['password'],
      applications: this.fb.array([]),
    });
  }

  appNameGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      url: ['', [Validators.required]],
    });
  }

  addRepoFormGroupControl(): void {
    (<FormArray>this.repositories).push(this.repoFormGroup());
  }

  // Form Array

  repoApplication(repoIndex: number): FormArray {
    return <FormArray>this.repositories.at(repoIndex).get('applications');
  }

  // addApplicaitonControl(repoIndex: string): void {}

  addApplicaiton(repoIndex: number): void {
    console.log('Add app: ', this.repoApplication(repoIndex));
    this.repoApplication(repoIndex).push(
      // new FormControl('', [Validators.required])
      this.appNameGroup()
    );
  }

  removeRepository(repositoryIndex: number) {
    this.repositories.removeAt(repositoryIndex);
  }

  removeApplicaiton(empIndex: number, appIndex: number) {
    this.repoApplication(empIndex).removeAt(appIndex);
  }

  // ---------------------------------------------

  getToken() {
    alert('Token is Coming...');
  }

  attachCompanyFormData() {
    // this.attachCompanyForm.delete('field1');
    console.log(this.attachCompanyForm.value);
    let { companyId, name, repositories } = this.attachCompanyForm.value;

    repositories.map((item: any) => {
      const app = item.applications.map((app: any) => {
        return { _metedata: { name: app.name }, url: app.url };
      });
      item.applications = app;
      return item;
    });
    let companyData = {
      id: companyId,
      name,
      repositories,
    };

    console.log(companyData);

    // this.attachCompanyService
    //   .attachCompany(this.attachCompanyForm.value)
    //   .subscribe(
    //     (res) => {
    //       if (res.status === 'success') {
    //         // this.isLoading = false;
    //         // this.router.navigate(['/auth/login']);
    //         // this.openSnackBar('Registration Successfull', '');
    //         console.log('Registration Successfull', '');
    //       }
    //       console.log(res.status);
    //       // console.log(this.authService.getUserData(), 'USER');
    //     },
    //     (err) => {
    //       // this.openSnackBarError('Authentication Error', '');
    //       console.log('err', err);
    //     }
    //   );

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }
}
