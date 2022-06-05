import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import YamlValidator from 'yaml-validator';
import { AppListService } from '../app-list.service';
import { ApplicationListComponent } from '../application-list/application-list.component';


@Component({
  selector: 'kcci-application-modal',
  templateUrl: './application-modal.component.html',
  styleUrls: ['./application-modal.component.scss'],
})
export class ApplicationModalComponent implements OnInit {
  userPersonalInfo: any;
  user: any = this.auth.getUserData();
  companyID: any;
  repositoryId: any;
  isLoading: boolean = false;
  stepper: number = 1;
  options:any = {
    log: false,
    structure: false,
    onWarning: null,
    writeJson: false
  };
  
  files:any = [
    //'file paths',
    'that exists',
    'somewhere',
    'and are Yaml files'
  ];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ApplicationModalComponent>,
    private userInfo: UserDataService,
    private auth: AuthService,
    private service: AppListService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationListComponent
  ) {

  }

  ngOnInit(): void {
    //@ts-ignore
    this.repositoryId = this.data.repositoryId;
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.companyID = res.data.metadata.company_id;
      // this.service
      //   .getRepositoryInfo(this.companyID, repositoryId)
      //   .subscribe((response: any) => {
      //     console.log('ModalData: ', response.data.applications);
      //   });
    });
    const validator = new YamlValidator(this.options);
    
    console.log("Validator: ",validator.validate(this.files),validator.report());
  }
  
  addApplication = this.fb.group({
    name: ['', Validators.required],
    url: ['', Validators.required],
  });

  gotoNext(e:number){
    this.stepper = e;
    console.log("E: ",e);
  }

  addApplicationFormData() {
    this.isLoading = true;
    let data = {
      applications: [
        {
          _metadata: {
            name: this.addApplication.value.name,
          },
          url: this.addApplication.value.url,
        },
      ],
    };

    // this.service.addApplication(data, this.repositoryId, this.companyID);
    this.service
      .addApplication(data, this.companyID, this.repositoryId)
      .subscribe(
        (res) => {
          this.isLoading = false
          console.log('Add Application response', res);
          this.dialogRef.close();
          // console.log(this.authService.getUserData(), 'USER');
        },
        (err) => {
          // this.openSnackBarError('Authentication Error', '');
          console.log('err', err);
        }
      );
  }
  closeAppModal() {
    this.dialogRef.close();
  }
}
