import { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { AppListService } from '../app-list.service';
import { ApplicationListComponent } from '../application-list/application-list.component';
import 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-scss';
import {dump as toYaml, load as fromYaml} from 'js-yaml';
import {Location} from "@angular/common";
import {AppEditorModalComponent} from "../app-editor-modal/app-editor-modal.component";
import {ResourcePermissionService} from "../../shared/services/resource-permission.service";
import {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";


@Component({
  selector: 'kcci-application-modal',
  templateUrl: './application-modal.component.html',
  styleUrls: ['./application-modal.component.scss'],
})
export class ApplicationModalComponent implements OnInit {
  public href: string = "";
  url: string = "asdf";
  yamlInputData = '';
  showFiller = false;
  panelOpenState = false;
  isValid:any;
  arrayData:any = [];
  totalError:any=0;
  hasPipeline:boolean = false;
  appStep:any;
  stepAsMap = new Map()
  userPersonalInfo: any;
  user: any = this.auth.getUserData();

  companyID: any;

  repositoryId: any;
  applicationURL: any;
  isLoading: boolean = false;
  stepper: number = 1;
  validity:any;
  options:any = {
    log: false,
    structure: true,
    onWarning: null,
    writeJson: false
  };

  files:any = [
    'file paths',
    'that exists',
    'somewhere',
    'and are Yaml files'
  ];
  applicationName: any;
  showOk: boolean | undefined;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ApplicationModalComponent>,
    private userInfo: UserDataService,
    private auth: AuthService,
    private service: AppListService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationListComponent,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    public resource: ResourcePermissionService,
    private snack: SharedSnackbarService
  ) {}

  ngOnInit(): void {
    console.log("data---",this.data)
    this.repositoryId = this.data.repositoryId;
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.companyID = res.data.metadata.company_id;
    });
  }


// <-----------Check Validity of Steps----------->

  // checkValidity(allSteps:any){
  //   allSteps.map((items:any, index:number)=>{
  //     let next_val:any = null;
  //     let params_val:any = null;
  //
  //     // <----------Checking Next Array---------->
  //     if(items?.next !== null){
  //       const nextValue = items?.next?.map((item:any)=>{
  //         return item.valid;
  //       })
  //       next_val = !nextValue.includes('false')
  //     }
  //
  //     // <----------Checking Param Array---------->
  //     if(items?.params !== null){
  //       const paramsValue = items?.params?.map((item:any)=>{
  //         return item.valid;
  //       })
  //       params_val = !paramsValue.includes('false')
  //     }
  //     if(items.name.valid=='true' && next_val==true && params_val==true && items.trigger.valid=='true' && items.type.valid=='true'){
  //       return items.isValid = true;
  //     }
  //     else{
  //       return items.isValid = false;
  //     }
  //   })
  // }

// <-----------Data in Key Value Pair----------->
  private p: any;

  // getDataKeyValue(allSteps:any){
  //   allSteps.map((_item: any, index:number)=>{
  //
  //     const nextVal = _item.next.map((nextValue:any)=>{
  //       return nextValue.value;
  //     })
  //
  //     const paramVal = _item.params.map((paramValue:any)=>{
  //       const param = `${paramValue.name} : ${paramValue.value}`
  //       return param;
  //     })
  //
  //     const _obj:any = {
  //       name: _item.name.value,
  //       type: _item.type.value,
  //       trigger: _item.trigger.value,
  //       params: paramVal,
  //       next: nextVal,
  //     }
  //
  //     let next_val:any = null;
  //     let params_val:any = null;
  //
  //     // <----------Checking Next Array---------->
  //     if(_item?.next !== null){
  //       const nextValue = _item?.next?.map((item:any)=>{
  //         return item.valid;
  //       })
  //       next_val = !nextValue.includes('false')
  //     }
  //
  //     // <----------Checking Param Array---------->
  //     if(_item?.params !== null){
  //       const paramsValue = _item?.params?.map((item:any)=>{
  //         return item.valid;
  //       })
  //       params_val = !paramsValue.includes('false')
  //     }
  //     // this.arrayData.push(_obj);
  //
  //     let error;
  //
  //
  //     if(_item.name.valid=='false'){
  //       error = 1;
  //     }else if(_item.type.valid=='false'){
  //       error = 2;
  //     }else if(_item.trigger.valid=='false'){
  //       error = 3;
  //     }else if(params_val==false){
  //       error = 4;
  //     }else if(next_val==false){
  //       error = 5 + _item?.params.length;
  //     }
  //     this.stepAsMap.set(_item?.name?.value, {isValid: _item.isValid, data: toYaml(_obj), error:error, stepData:_item})
  //   })
  // }
  //
  // getTotalError(appSteps:any){
  //
  //   const v_val=appSteps.map((p:any)=>{
  //
  //       const obj={
  //         n_val:p.name.valid ==='true'?0:1 ,
  //         ty_val:p.type.valid === 'true'?0:1,
  //         t_val:p?.trigger?.valid === 'true'?0:1,
  //         nx_val:p.next.filter((obj:any) => obj.valid === "false").length,
  //         params:p.params.filter((obj:any) => obj.valid === "false").length
  //
  //       }
  //
  //       return obj
  //
  //     }
  //   )
  //
  //   const fCount = v_val.reduce((accumulator:any, object:any) => {
  //     return accumulator + object.n_val+object.ty_val+object.t_val+object.nx_val+object.params;
  //   }, 0);
  //   this.totalError = fCount;
  // }


  addApplication = this.fb.group({
    name: ['', Validators.required],
    url: ['', Validators.required],
  });

  // gotoNext(e:number){
  //   const {name,url} = this.addApplication.value;
  //   this.href = this.router.url;
  //   this.stepper = e;
  // }

  addApplicationFormData() {
    // console.log("this.repositoryId",this.repositoryId)
    // this.isLoading = true;
    // const data = {
    //   applications: [
    //     {
    //       _metadata: {
    //         name: this.addApplication.value.name,
    //       },
    //       url: this.addApplication.value.url,
    //     },
    //   ],
    // };
    //
    // this.service
    //   .addApplication(data, this.companyID, this.repositoryId)
    //   .subscribe(
    //     (res) => {
    //       this.isLoading = false;
    //       this.dialogRef.close();
    //       console.log("appRes:",res)
    //     },
    //     (err) => {
    //       // this.openSnackBarError('Authentication Error', '');
    //       this.snack.openSnackBar('Webhook Updated Action Failed',err.error.message,'sb-error')
    //     }
    //   );
  }

  closeAppModal() {
    this.dialogRef.close();
  }

  // editorPropsFix(data: any): void {
  //   const stepName= data?.stepname;
  //   const itemValue = this.stepAsMap.get(stepName)
  //   const newStepName= data?.replaceValue;
  //   const _item = itemValue?.stepData;
  //
  //   const nextVal = _item?.next?.map((nextValue:any)=>{
  //     return nextValue.value;
  //   })
  //
  //   const paramVal = _item?.params?.map((paramValue:any)=>{
  //     const param = `${paramValue.name} : ${paramValue.value}`
  //     return param;
  //   })
  //   const _obj:any = {
  //     name: newStepName,
  //     type: _item.type.value,
  //     trigger: _item.trigger.value,
  //     params: paramVal,
  //     next: nextVal,
  //   }
  //   const newKeyValue = {isValid: _item.isValid, data: toYaml(_obj),  stepData:_item}
  //   this.stepAsMap = this.mapReplace(this.stepAsMap, stepName, newStepName, newKeyValue)
  // }
  //
  // mapReplace(map: any, prevKey: string, newKey: string, newKeyValue: any): any {
  //   const x = new Map()
  //   for (const [key, value] of this.stepAsMap) {
  //     if (prevKey === key) {
  //       x.set(newKey, newKeyValue)
  //       continue
  //     }
  //     x.set(key, value)
  //   }
  //   return x
  // }

  openAppEditor() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%';
    dialogConfig.maxWidth = '700px'
    dialogConfig.data = {
      repositoryId: this.repositoryId,
      applicationURL: this.addApplication.value.url,
      applicationName: this.addApplication.value.name,
      showOk:true,
    };
    this.dialog.open(AppEditorModalComponent, dialogConfig);
    this.dialogRef.close();
  }
}
