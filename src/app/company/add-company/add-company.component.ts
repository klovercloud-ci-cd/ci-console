import { Component, HostListener, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { TokenService } from 'src/app/auth/token.service';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
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
  tooltipMsg: string =
    "Click on 'Generate Here' to generate the token and paste that in the input field.";

  repos: RepoType[] = [
    { value: 'BIT_BUCKET', viewValue: 'Bitbucket' },
    { value: 'GITHUB', viewValue: 'Github' },
    { value: 'GITLAB', viewValue: 'Gitlab' },
  ];
  isLoading = false;
  showAddApp = false;
  showAddRepo = false;

  constructor(
    private fb: FormBuilder,
    private attachCompanyService: AttachCompanyService,
    private _toolbarService: ToolbarService,
    private authService: AuthService,
    private tokenService: TokenService,
    public dialogRef: MatDialogRef<AttachCompanyService>,
  ) {}

  ngOnInit(): void {
    this._toolbarService.changeData({ title: 'Settings' });
  }

  // ----------------- Attach Company Form -----------------

  formDataFormat: any;
  repoData: any = [];

  attachCompanyForm = this.fb.group({
    // companyId: ['', Validators.required],
    name: [''],
    repositories: this.fb.array([]),
  });

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
    this.isLoading = true;
    console.log(this.attachCompanyForm.value);
    let {  name, repositories } = this.attachCompanyForm.value;

    repositories.map((item: any, index: number) => {
      const app = item.applications.map((app: any) => {
        return { _metadata: { name: app.name }, url: app.url };
      });
      item.applications = app;
      return item;
    });
    let companyData = {
      name,
      repositories,
    };
    console.log(companyData);
    this.attachCompanyService
      .attachCompany(this.attachCompanyForm.value)
      .subscribe(
        (res) => {
          this.isLoading = false;
          if (res.status === 'success') {
            this.authService.refreshToken({
              refresh_token: this.tokenService.getRefreshToken(),
            }).subscribe((res) => {
            this.dialogRef.close();
            this.refresh();
            });
          }
          console.log(res.status);
        },
        (err) => {
          console.log('err', err);
        }
      );
  }
  refresh(): void {
    window.location.reload();
}
  closeAppModal() {
    this.dialogRef.close();
  }
}
