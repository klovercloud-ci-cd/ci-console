import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RepoServiceService } from '../repo-service.service';
import { RepositoryComponent } from '../repository/repository.component';
interface Food {
  value: string;
  viewValue: string;
}
interface RepoType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'kcci-repository-modal',
  templateUrl: './repository-modal.component.html',
  styleUrls: ['./repository-modal.component.scss']
})

export class RepositoryModalComponent implements OnInit {
  repos: RepoType[] = [
    { value: 'bitbucket', viewValue: 'Bitbucket' },
    { value: 'github', viewValue: 'Github' },
    { value: 'gitlab', viewValue: 'Gitlab' },
  ];

  tooltipMsg: string =
    "Click on 'Generate Here' to generate the token and paste that in the input field.";

  constructor(
    public dialogRef: MatDialogRef<RepositoryModalComponent>,
    private service: RepoServiceService,
    private fb: FormBuilder,
    
    @Inject(MAT_DIALOG_DATA) public data: RepositoryComponent) { }

  ngOnInit(): void {
    //@ts-ignore
    console.log("CompID:",this.data.companyID)
  }

  repoFormGroup:any = this.fb.group({
      type: ['', [Validators.required]],
      token: ['', [Validators.required]],
      // applications: this.fb.array([]),
    });

  // repoApplication(repoIndex: number): FormArray {
  //   return <FormArray>attachCompanyForm.repositoriesget('applications');
  // }

  // addApplicaiton(repoIndex: number): void {
  //   console.log('Add app: ', this.repoApplication(repoIndex));
  //   this.repoApplication(repoIndex).push(
  //     // new FormControl('', [Validators.required])
  //     this.appNameGroup()
  //   );
  // }

  // removeApplicaiton(empIndex: number, appIndex: number) {
  //   this.repoApplication(empIndex).removeAt(appIndex);
  // }

  subsub(){
    // this.service.addRepository('e2b632b0-6dd3-41f5-b45e-d086466e0323').subscribe((res)=>{
    //   console.log("RepoRes: ",res);
      
    // })

    console.log("JJJ:",this.repoFormGroup.value);
    console.log("RepoAdded");
    
  }

  closeAppModal() {
    this.dialogRef.close();
  }
}
