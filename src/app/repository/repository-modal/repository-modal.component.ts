import  { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import  { FormBuilder} from '@angular/forms';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import  { MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import  { RepoServiceService } from '../repo-service.service';
import  { RepositoryComponent } from '../repository/repository.component';

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
    { value: 'BIT_BUCKET', viewValue: 'Bitbucket' },
    { value: 'GITHUB', viewValue: 'Github' },
    { value: 'GITLAB', viewValue: 'Gitlab' },
  ];

  isLoading = false;

  tooltipMsg =
    "Click on 'Generate Here' to generate the token and paste that in the input field.";

  constructor(
    public dialogRef: MatDialogRef<RepositoryModalComponent>,
    private service: RepoServiceService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: RepositoryComponent) { }

  ngOnInit(): void {
    // @ts-ignore
    console.log("CompID:",this.data.companyID)
  }

  repoFormGroup:any = this.fb.group({
      type: ['', [Validators.required]],
      token: ['', [Validators.required]],
    });

  subsub(){

    this.isLoading = true
    this.service.addRepository(this.data.companyID,this.repoFormGroup.value).subscribe((res)=>{

      this.isLoading = false
      this.dialogRef.close();
      console.log("RepoRespo: ",res);

    },
    (err) => {
      // this.openSnackBarError('Authentication Error', '');
      console.log('err', err);
    })
  }

  closeAppModal() {
    this.dialogRef.close();
  }
}
