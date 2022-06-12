import { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
import {EditorModalComponent} from "../../editor/editor-modal/editor-modal.component";
import {Location} from "@angular/common";


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

  appStep: any = {
    "_metadata":null,
    "data":{
       "name":"test",
       "steps":[
          {
             "name":{
                "accepts":"*",
                "message":"",
                "name":"name",
                "valid":"true",
                "value":"build"
             },
             "type":{
                "accepts":"BUILD, DEPLOY, INTERMEDIARY, JENKINS_JOB",
                "message":"",
                "name":"type",
                "valid":"true",
                "value":"BUILD"
             },
             "trigger":{
                "accepts":"AUTO, MANUAL",
                "message":"",
                "name":"trigger",
                "valid":"true",
                "value":"AUTO"
             },
             "params":[
                {
                   "accepts":"*",
                   "message":"",
                   "name":"service_account",
                   "valid":"true",
                   "value":"test-sa"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"storage",
                   "valid":"true",
                   "value":"500Mi"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"access_mode",
                   "valid":"false",
                   "value":"ReadWriteOnce"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"args",
                   "valid":"false",
                   "value":"key3:value1,key4:value2"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"args_from_configmaps",
                   "valid":"true",
                   "value":"tekton/cm-test"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"images",
                   "valid":"true",
                   "value":"shabrul2451/test-dev,shabrul2451/test-pro"
                },
                {
                   "accepts":"git",
                   "message":"",
                   "name":"repository_type",
                   "valid":"true",
                   "value":"git"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"revision",
                   "valid":"true",
                   "value":"master"
                }
             ],
             "next":[
                {
                   "accepts":"jenkinsJob, build, interstep, deployDev",
                   "message":"",
                   "name":"next",
                   "valid":"true",
                   "value":"interstep"
                },
               {
                 "accepts":"jenkinsJob, build, interstep, deployDev",
                 "message":"",
                 "name":"next",
                 "valid":"true",
                 "value":"interstep"
               },
               {
                 "accepts":"jenkinsJob, build, interstep, deployDev",
                 "message":"",
                 "name":"next",
                 "valid":"true",
                 "value":"interstep"
               }
             ]
          },
          {
             "name":{
                "accepts":"step-1,step-2,step-3",
                "message":"",
                "name":"name",
                "valid":"false",
                "value":"interstep"
             },
             "type":{
                "accepts":"BUILD, DEPLOY, INTERMEDIARY, JENKINS_JOB",
                "message":"",
                "name":"type",
                "valid":"true",
                "value":"INTERMEDIARY"
             },
             "trigger":{
                "accepts":"AUTO, MANUAL",
                "message":"",
                "name":"trigger",
                "valid":"true",
                "value":"AUTO"
             },
             "params":[
                {
                   "accepts":"*",
                   "message":"",
                   "name":"command",
                   "valid":"true",
                   "value":"echo"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"command_args",
                   "valid":"true",
                   "value":"Hello World"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"envs",
                   "valid":"true",
                   "value":"key3:value1,key4:value2"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"envs_from_configmaps",
                   "valid":"true",
                   "value":"tekton/cm-test"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"envs_from_secrets",
                   "valid":"true",
                   "value":"tekton/cm-test"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"images",
                   "valid":"true",
                   "value":"ubuntu"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"revision",
                   "valid":"true",
                   "value":"latest"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"service_account",
                   "valid":"true",
                   "value":"test-sa"
                }
             ],
             "next":[
                {
                   "accepts":"deployDev, jenkinsJob, build, interstep",
                   "message":"",
                   "name":"next",
                   "valid":"false",
                   "value":"deployDev"
                },
                {
                  "accepts":"deployDev, jenkinsJob, build, interstep",
                  "message":"",
                  "name":"next",
                  "valid":"false",
                  "value":"deployDev"
               }
             ]
          },
          {
             "name":{
                "accepts":"*",
                "message":"",
                "name":"name",
                "valid":"true",
                "value":"deployDev"
             },
             "type":{
                "accepts":"BUILD, DEPLOY, INTERMEDIARY, JENKINS_JOB",
                "message":"",
                "name":"type",
                "valid":"true",
                "value":"DEPLOY"
             },
             "trigger":{
                "accepts":"AUTO, MANUAL",
                "message":"",
                "name":"trigger",
                "valid":"true",
                "value":"AUTO"
             },
             "params":[
                {
                   "accepts":"*",
                   "message":"",
                   "name":"name",
                   "valid":"true",
                   "value":"ubuntu"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"namespace",
                   "valid":"true",
                   "value":"default"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"revision",
                   "valid":"true",
                   "value":"master"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"type",
                   "valid":"true",
                   "value":"deployment"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"agent",
                   "valid":"true",
                   "value":"local_agent"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"env",
                   "valid":"true",
                   "value":"dev"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"images",
                   "valid":"true",
                   "value":"shabrul2451/test-dev"
                }
             ],
             "next":[
                {
                   "accepts":"build, interstep, deployDev, jenkinsJob",
                   "message":"",
                   "name":"next",
                   "valid":"true",
                   "value":"jenkinsJob"
                }
             ]
          },
          {
             "name":{
                "accepts":"*",
                "message":"",
                "name":"name",
                "valid":"true",
                "value":"jenkinsJob"
             },
             "type":{
                "accepts":"BUILD, DEPLOY, INTERMEDIARY, JENKINS_JOB",
                "message":"",
                "name":"type",
                "valid":"true",
                "value":"JENKINS_JOB"
             },
             "trigger":{
                "accepts":"AUTO, MANUAL",
                "message":"",
                "name":"trigger",
                "valid":"true",
                "value":"AUTO"
             },
             "params":[
                {
                   "accepts":"*",
                   "message":"",
                   "name":"job",
                   "valid":"true",
                   "value":"new"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"params",
                   "valid":"true",
                   "value":"id:123,verbosity:high"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"secret",
                   "valid":"true",
                   "value":"jenkins-credentials"
                },
                {
                   "accepts":"*",
                   "message":"",
                   "name":"url",
                   "valid":"true",
                   "value":"http://jenkins.default.svc:8080"
                }
             ],
             "next":[
               {
                  "accepts":"build, interstep, deployDev, jenkinsJob",
                  "message":"",
                  "name":"next",
                  "valid":"true",
                  "value":"jenkinsJob"
               },
               {
                  "accepts":"build, interstep, deployDev, jenkinsJob",
                  "message":"",
                  "name":"next",
                  "valid":"true",
                  "value":"jenkinsJob"
               }
            ]
          },
       ]
    },
    "status":"success",
    "message":"Successful"
 };
  stepAsMap = new Map()
  userPersonalInfo: any;
  user: any = this.auth.getUserData();

  companyID: any;

  repositoryId: any;
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
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ApplicationModalComponent>,
    private userInfo: UserDataService,
    private auth: AuthService,
    private service: AppListService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationListComponent,
    private editorDialogRef: MatDialogRef<EditorModalComponent>,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
    // @ts-ignore
    if (this.appStep.data.steps.length>0){
      this.hasPipeline=true;
    }

   // <----------Fetching User Info---------->
    this.repositoryId = this.data.repositoryId;
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      this.companyID = res.data.metadata.company_id;
    });

    this.validity = this.checkValidity(this.appStep.data.steps);

    this.getDataKeyValue(this.appStep.data.steps);

    this.getTotalError(this.appStep.data.steps);

    //  let output = this.appStep?.data?.steps.filter((items:any) => this.validity.find((items2:any) => (items2?.name?.value == items?.name?.value)));
    //  console.log("output: ",this.validity, output);
    // this.editorDialogRef.afterClosed().subscribe((data) => {
    //   console.log("Editor Model Data", data)
    // })
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

      const nextVal = _item.next.map((nextValue:any)=>{
        return nextValue.value;
      })

      const paramVal = _item.params.map((paramValue:any)=>{
        const param = `${paramValue.name} : ${paramValue.value}`
        return param;
      })

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
      // this.arrayData.push(_obj);

      let error;
      // console.log("_item?.name?.value:-",_item.name.valid);


      if(_item.name.valid=='false'){
        error = 1;
      }else if(_item.type.valid=='false'){
        error = 2;
      }else if(_item.trigger.valid=='false'){
        error = 3;
      }else if(params_val==false){
        error = 4;
      }else if(next_val==false){
        error = 5 + _item?.params.length;
      }
      // console.log("_ITEM: ",_item)
      this.stepAsMap.set(_item?.name?.value, {isValid: _item.isValid, data: toYaml(_obj), error:error, stepData:_item})
    })
  }

  getTotalError(appSteps:any){

    const v_val=appSteps.map((p:any)=>{

        const obj={
          n_val:p.name.valid ==='true'?0:1 ,
          ty_val:p.type.valid === 'true'?0:1,
          t_val:p?.trigger?.valid === 'true'?0:1,
          nx_val:p.next.filter((obj:any) => obj.valid === "false").length,
          params:p.params.filter((obj:any) => obj.valid === "false").length

        }

        return obj

      }
    )

    const fCount = v_val.reduce((accumulator:any, object:any) => {
      return accumulator + object.n_val+object.ty_val+object.t_val+object.nx_val+object.params;
    }, 0);
    this.totalError = fCount;
    console.log("fCount: ",fCount)
  }

  // getTotalError(appSteps:any){
  //   console.log("appSteps:",appSteps);
  //   let errors:any = [];
  //   appSteps.map((items:any, index:number)=>{
  //     let next_val:any = null;
  //     let params_val:any = null;
  //
  //     if(items.name.valid=='false' || items.type.valid=='false' || items.trigger.valid=='false'){
  //       this.totalError = this.totalError+1;
  //     }
  //     // else if(items.type.valid=='false'){
  //     //   errors.push('error');
  //     // }else if(items.trigger.valid=='false'){
  //     //   errors.push('error');
  //     // }
  //     // console.log("this.totalError: -",this.totalError)
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
  //   console.log("this.totalError:::: -",this.totalError)
  // }

  addApplication = this.fb.group({
    name: ['', Validators.required],
    url: ['', Validators.required],
  });

  gotoNext(e:number){
    const {name,url} = this.addApplication.value;
    this.href = this.router.url;
    // console.log("PATH: ",this.location.path());

    this.stepper = e;

  }

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

    this.service
      .addApplication(data, this.companyID, this.repositoryId)
      .subscribe(
        (res) => {
          this.isLoading = false;
         //  console.log('Add Application response', res);
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

  editorPropsFix(data: any): void {
    console.log("Get Update Data", data)
  //  Update Editor item
  //   key: "name" replaceValue: "step1" stepname: "interstep"
    const stepName= data?.stepname;
    const itemValue = this.stepAsMap.get(stepName)
    const newStepName= data?.replaceValue;
    console.log(itemValue)
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
      console.log("key val", newKey, key)
      if (prevKey === key) {
        x.set(newKey, newKeyValue)
        continue
      }
      x.set(key, value)
    }
    console.log("x", x)
    return x
  }
}
