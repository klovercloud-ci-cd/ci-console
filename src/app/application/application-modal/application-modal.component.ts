import  { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import  { FormBuilder} from '@angular/forms';
import { Validators } from '@angular/forms';
import  { MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import  { ActivatedRoute } from '@angular/router';
import  { AuthService } from 'src/app/auth/auth.service';
import  { UserDataService } from 'src/app/shared/services/user-data.service';
import  { AppListService } from '../app-list.service';
import  { ApplicationListComponent } from '../application-list/application-list.component';

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

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ApplicationModalComponent>,
    private userInfo: UserDataService,
    private auth: AuthService,
    private service: AppListService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationListComponent
  ) {}

  ngOnInit(): void {
    // @ts-ignore
    this.repositoryId = this.data.repositoryId;
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.companyID = res.data.metadata.company_id;
    });
  }

  addApplication = this.fb.group({
    name: ['', Validators.required],
    url: ['', Validators.required],
  });

  addApplicationFormData() {
    this.isLoading = true;

    const data = {
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
