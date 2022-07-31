// import {Component, Inject, OnInit} from '@angular/core';
// import {FormBuilder, Validators} from "@angular/forms";
// import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
// import {UserDataService} from "../../shared/services/user-data.service";
// import {AuthService} from "../../auth/auth.service";
// import {AppListService} from "../app-list.service";
// import {ActivatedRoute, Router} from "@angular/router";
// import {ApplicationListComponent} from "../application-list/application-list.component";
// import {EditorModalComponent} from "../../editor/editor-modal/editor-modal.component";
// import {Location} from "@angular/common";
// import {dump as toYaml} from "js-yaml";

import { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
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
import {ApplicationModalComponent} from "../application-modal/application-modal.component";
import {ResourcePermissionService} from "../../shared/services/resource-permission.service";
import {SharedSnackbarService} from "../../shared/snackbar/shared-snackbar.service";

@Component({
  selector: 'kcci-app-editor-modal',
  templateUrl: './app-editor-modal.component.html',
  styleUrls: ['./app-editor-modal.component.scss']
})
export class AppEditorModalComponent implements OnInit {
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
  invalidUrl:any;
  companyID: any;

  repositoryId: any;
  isLoading: boolean = false;
  stepper: number = 1;
  validity:any;
  appUrlData:any;
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
  constructor(
    private fb: FormBuilder,
    private allDialog: MatDialog,
    public dialogRef: MatDialogRef<AppEditorModalComponent>,
    public closeDialogRef: MatDialogRef<ApplicationModalComponent>,
    private userInfo: UserDataService,
    private auth: AuthService,
    private service: AppListService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationListComponent,
    @Inject(MAT_DIALOG_DATA) public appUrlDatas: ApplicationModalComponent,
    private router: Router,
    private location: Location,
    public resource: ResourcePermissionService,
    public snack: SharedSnackbarService,
  ) {
  }

  async ngOnInit(): Promise<void> {

    // <----------Fetching User Info---------->
    this.repositoryId = this.data.repositoryId;
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.companyID = res.data.metadata.company_id;
    });

    this.getPipelineSteps();
  }

  getPipelineSteps(){

    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.companyID = res.data.metadata.company_id;
      this.service.getAppSteps(this.companyID,this.appUrlDatas.repositoryId,this.appUrlDatas.applicationURL).subscribe((res) => {

        this.appStep = res;
        // @ts-ignore
        if (this.appStep?.data?.steps?.length>0){
          this.hasPipeline=true;
        }

        this.validity = this.checkValidity(this.appStep?.data?.steps);
        this.getDataKeyValue(this.appStep?.data?.steps);
        this.getTotalError(this.appStep?.data?.steps);
      },
        (err)=>{
        if (err.status == 400){
        this.invalidUrl = true;
        }
        });
    });
  }

  applicationAdd(){
    const data = {
      applications: [
        {
          _metadata: {
            name: this.appUrlDatas.applicationName,
          },
          url: this.appUrlDatas.applicationURL,
        },
      ],
    };

    this.service
      .addApplication(data, this.companyID, this.appUrlDatas.repositoryId)
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.dialogRef.close();
        },
        (err) => {
          this.snack.openSnackBar('Application add Failed',err.error._metadata,'sb-error')
        }
      );
  }


// <-----------Check Validity of Steps----------->

  checkValidity(allSteps:any){
    allSteps.map((items:any, index:number)=>{
      let next_val:any = null;
      let params_val:any = null;

      // <----------Checking Next Array---------->
      if(items?.next !== null){
        const nextValue = items?.next?.map((item:any)=>{
          return item.valid;
        })
        next_val = !nextValue.includes('false')
      }

      // <----------Checking Param Array---------->
      if(items?.params !== null){
        const paramsValue = items?.params?.map((item:any)=>{
          return item.valid;
        })
        params_val = !paramsValue.includes('false')
      }
      if(items.name.valid=='true' && next_val==true && params_val==true && items.trigger.valid=='true' && items.type.valid=='true'){
        return items.isValid = true;
      }
      else{
        return items.isValid = false;
      }
    })
  }

// <-----------Data in Key Value Pair----------->
  private p: any;

  getDataKeyValue(allSteps:any){
    allSteps.map((_item: any, index:number)=>{
      const nextVal = _item?.next?.map((nextValue:any)=>{
        return nextValue.value;
      })


      // count:=0
      const paramVal = _item?.params?.map((paramValue:any)=>{
        const param = `${paramValue.name} : ${paramValue.value}`
        return param;
      })

      let paramErrorIndexes=[]

      for (var i in _item.params) {
        if (_item.params[i].valid=='false'){
          paramErrorIndexes.push(Number(i)+5)
        }
      }
      let nextErrorIndexes=[]
      for (var i in _item.next) {
        if (_item.next[i].valid=='false'){
          if (paramErrorIndexes.length>0){
            nextErrorIndexes.push(Number(i)+6+Number(paramErrorIndexes[paramErrorIndexes.length-1]))
          }else{
            nextErrorIndexes.push(Number(i)+_item.params.length+6);
          }

        }
      }

      const _obj:any = {
        name: _item.name.value,
        type: _item.type.value,
        trigger: _item.trigger.value,
        params: paramVal,
        next: nextVal,
      }

      let next_val:any = null;
      let params_val:any = null;


      // <----------Checking Next Array---------->
      if(_item?.next !== null){
        const nextValue = _item?.next?.map((item:any)=>{

          return item.valid;
        })
        next_val = !nextValue.includes('false')
      }

      // <----------Checking Param Array---------->
      if(_item?.params !== null){
        const paramsValue = _item?.params?.map((item:any)=>{
          return item.valid;
        })
        params_val = !paramsValue.includes('false')
      }

      let error=new Array();

      if(_item.name.valid=='false'){
        error.push( 1);
      }
      if(_item.type.valid=='false'){
        error.push( 2);
      }
      if(_item.trigger.valid=='false'){
        error.push(3);
      }
        error.push(...paramErrorIndexes)

      error.push(...nextErrorIndexes)
      this.stepAsMap.set(_item?.name?.value, {isValid: _item.isValid, data: toYaml(_obj), error:error, stepData:_item})
    })
  }

  getTotalError(appSteps:any){
    const appStepObject=appSteps?.map((process:any,index:number)=>{
     let next_value=0
      if (process.next){
        next_value=process?.next?.filter((obj:any) => obj?.valid === 'false').length
      }else{
        next_value=0
      }
      const obj={
          name_value:process?.name?.valid =='true'?0:1 ,
          type_value:process?.type?.valid === 'true'?0:1,
          trigger_value:process?.trigger?.valid === 'true'?0:1,
          next_value:next_value,
          params:process?.params?.filter((obj:any) => obj?.valid === 'false').length
        }
        return obj
      }
    )


    const fCount = appStepObject.reduce((accumulator:any, object:any) => {
      return accumulator + Number(Number(object.name_value)+Number(object.type_value)+Number(object.trigger_value)+Number(object.next_value)+Number(object.params));
    }, 0);

    this.totalError = fCount;
  }

  addApplication = this.fb.group({
    name: ['', Validators.required],
    url: ['', Validators.required],
  });

  gotoNext(e:number){
    const {name,url} = this.addApplication.value;
    this.href = this.router.url;

    this.stepper = e;
  }
  closeAppModal() {
    this.dialogRef.close();
  }

  editorPropsFix(data: any): void {
    const stepName= data?.stepname;
    const itemValue = this.stepAsMap.get(stepName)
    const newStepName= data?.replaceValue;
    const _item = itemValue?.stepData;

    const nextVal = _item?.next?.map((nextValue:any)=>{
      return nextValue.value;
    })

    const paramVal = _item?.params?.map((paramValue:any)=>{
      const param = `${paramValue.name} : ${paramValue.value}`
      return param;
    })
    const _obj:any = {
      name: newStepName,
      type: _item.type.value,
      trigger: _item.trigger.value,
      params: paramVal,
      next: nextVal,
    }
    const newKeyValue = {isValid: _item.isValid, data: toYaml(_obj),  stepData:_item}
    this.stepAsMap = this.mapReplace(this.stepAsMap, stepName, newStepName, newKeyValue)
  }

  mapReplace(map: any, prevKey: string, newKey: string, newKeyValue: any): any {
    const x = new Map()
    for (const [key, value] of this.stepAsMap) {
      if (prevKey === key) {
        x.set(newKey, newKeyValue)
        continue
      }
      x.set(key, value)
    }
    return x
  }
}
