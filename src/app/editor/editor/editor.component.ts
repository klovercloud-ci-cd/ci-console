import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {Ace, edit, Range} from 'ace-builds';
import 'ace-builds';
import 'ace-builds/src-noconflict/theme-dracula';
import {dump as toYaml, load as fromYaml} from 'js-yaml';
import {MatDialogConfig} from "@angular/material/dialog";
import { MatDialog } from '@angular/material/dialog';
import {EditorModalComponent} from "../editor-modal/editor-modal.component";

@Component({
  selector: 'kcci-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('editor') editorRef!: ElementRef;
  @Output() textChange = new EventEmitter<string>();
  @Input() text!: string;
  @Input() errorLine: any;
  @Input() InputData: any;
  @Input() readOnly: boolean = false;
  @Input() mode: string = 'yaml';
  @Input() prettify: boolean = true;
  editor!: Ace.Editor;
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
            "valid":"false",
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
              "valid":"true",
              "value":"ReadWriteOnce"
            },
            {
              "accepts":"*",
              "message":"",
              "name":"args",
              "valid":"true",
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
            }
          ]
        },
        {
          "name":{
            "accepts":"*",
            "message":"",
            "name":"name",
            "valid":"true",
            "value":"interstep"
          },
          "type":{
            "accepts":"BUILD, DEPLOY, INTERMEDIARY, JENKINS_JOB",
            "message":"",
            "name":"type",
            "valid":"false",
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
              "valid":"true",
              "value":"deployDev"
            },
            {
              "accepts":"deployDev, jenkinsJob, build, interstep",
              "message":"",
              "name":"next",
              "valid":"true",
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
  // All possible options can be found at:
  // https://github.com/ajaxorg/ace/wiki/Configuring-Ace
  options = {
    showPrintMargin: false,
    highlightActiveLine: true,
    tabSize: 2,
    wrap: true,
    fontSize: 14,
    fontFamily: '\'Roboto Mono Regular\', monospace',
  };

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.editor
  }

  ngAfterViewInit(): void {
    this.initEditor_();
  }

  onTextChange(text: string): void {
    this.textChange.emit(text);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.editor) {
      return;
    }
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'text':
            this.onExternalUpdate_();
            break;
          case 'mode':
            this.onEditorModeChange_();
            break;
          default:
        }
      }
    }
  }

  private initEditor_(): void {
    this.editor = edit(this.editorRef.nativeElement);
    this.editor.setOptions(this.options);
    this.editor.setValue(this.text, -1);
    this.editor.setReadOnly(this.readOnly);
    this.editor.setTheme('ace/theme/dracula');
    // console.log("this.errorLine: ", this.errorLine);

    this.setEditorMode_();
    this.editor.session.setUseWorker(false);
    this.editor.on('change', () => this.onEditorTextChange_());

    // <-----------Multiple Error Showing----------->

    // this.editor.getSession().setAnnotations(jsonErrorArray[currentFileName]);
    // let jsonErrorArray:any = [];
    // let fileNamesArray:any = [];
    // this.errorLine = [2,3];
    // for(let i=0; i<this.errorLine.length; i++){
    //   jsonErrorArray.push({
    //     row: this.errorLine[i] - 1,
    //     column: undefined,
    //     text: "Error occurred in this line!", // Or the Json reply from the parser
    //     type: "error"
    //   })
    // }
    // console.log("jsonErrorArray: ",jsonErrorArray)
    //
    // this.editor.getSession().setAnnotations(jsonErrorArray);


    this.editor.getSession().setAnnotations([{
      row: this.errorLine - 1,
      column: undefined,
      text: "Error occurred in this line!", // Or the Json reply from the parser
      type: "error", // also "warning" and "information"
    }]);

    const that = this;
    this.editor.getSession().getAnnotations().map((x: any) => {
      if ((x?.row + 1) > 0) {
        const errorList = document.getElementsByClassName('ace_error');
        setTimeout(() => {
          if (errorList.length > 0) {

            for (let i = 0; i < errorList.length; i++) {
              (function (index) {
                if (errorList[index].innerHTML.includes(x?.row + 1)) {
                  errorList[index].addEventListener("click", function (e: any) {
                    that.handleEvent(e, x?.row + 1);
                  })
                }
              })(i);
            }
          }
        }, 500);
      }

    })
  }

  handleEvent(event: any, row: any) {
    const key = this.editor.getValue().split('\n')[row - 1].split(':')[0];
    //console.log(this.editor.getValue().split('\n'))
    const data = fromYaml(this.editor.getValue());
    // @ts-ignore
    // console.log(key);
    let stepName:any;
    let mainKey:any;
    let mainValue:any;
    // @ts-ignore
    for (const [k, v] of Object.entries(data)) {
      // console.log("Trig: ",key, v);
      // stepName = v;
      // console.log(v);
      if(k === key) {
        mainKey = k;
        mainValue = v;
        // console.log("Trig-2: ",`${k}: ${v}`);
      }
    }

    console.log("InputData-----: ", mainKey);
    console.log("InputData-----: ",this.InputData, mainKey);

    switch(mainKey) {
      case 'name':
        if(this.InputData.name.accepts=='*' && this.InputData.name.valid !== "true") {
          // this.InputData.name.valid = true;

          this.openDialog(mainKey,'Type any name')
          console.log("Valid All");
        }
        break;
      case 'type':
        console.log("-----Type")
        break;
      case 'trigger':
        console.log("-----Trigger")
        break;
      case 'params':
        console.log("-----Params")
        break;
      case 'next':
        console.log("-----Next")
        break;
      default:
        console.log("-----nothing match found")
    }


    // if(mainKey == 'name'){
    //   if(this.InputData.name.accepts=='*')
    //   console.log("Valid All")
    // }else{
    //   console.log("InValid")
    // }

    // <------------Mat Dialog------------>

    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = '30%';
    // dialogConfig.panelClass = 'custom-modalbox';
    // dialogConfig.data = {
    //   mainKey: mainKey,
    //   mainValue: mainValue
    // };
    // this.dialog.open(EditorModalComponent, dialogConfig);
  }

    openDialog(key:string,msg:string) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '30%';
      dialogConfig.panelClass = 'custom-modalbox';
      dialogConfig.data = {
        key:key,
        message: msg,
      };
      this.dialog.open(EditorModalComponent, dialogConfig);
    }


  private onExternalUpdate_(): void {
    const point = this.editor.getCursorPosition();
    this.editor.setValue(this.text, -1);
    this.editor.moveCursorToPosition(point);
  }

  private onEditorTextChange_(): void {
    this.text = this.editor.getValue();
    this.onTextChange(this.text);
  }

  private onEditorModeChange_(): void {
    this.setEditorMode_();
  }

  private setEditorMode_(): void {
    this.editor.getSession().setMode(`ace/mode/${this.mode}`);
  }
}


// import {
//   AfterViewInit,
//   Component,
//   ElementRef,
//   EventEmitter,
//   Input,
//   OnChanges,
//   OnInit,
//   Output,
//   SimpleChanges,
//   ViewChild,
// } from '@angular/core';
// import { Ace, edit } from 'ace-builds';
// import 'ace-builds';
// import 'ace-builds/src-noconflict/theme-dracula';

// @Component({
//   selector: 'kcci-editor',
//   templateUrl: './editor.component.html',
//   styleUrls: ['./editor.component.scss']
// })
// export class EditorComponent implements OnInit, AfterViewInit, OnChanges {
//   @ViewChild('editor') editorRef!: ElementRef;
//   @Output() textChange = new EventEmitter<string>();
//   @Input() text!: string;
//   @Input() readOnly: boolean = false;
//   @Input() mode: string = 'json';
//   @Input() prettify: boolean = true;
//   editor!: Ace.Editor;
//   // All possible options can be found at:
//   // https://github.com/ajaxorg/ace/wiki/Configuring-Ace
//   options = {
//     showPrintMargin: false,
//     highlightActiveLine: true,
//     tabSize: 2,
//     wrap: true,
//     fontSize: 14,
//     fontFamily: '\'Roboto Mono Regular\', monospace',
//   };
//   constructor() {}
//   ngOnInit(): void { }
//   ngAfterViewInit(): void {
//     this.initEditor_();
//   }
//   onTextChange(text: string): void {
//     this.textChange.emit(text);
//   }
//   ngOnChanges(changes: SimpleChanges): void {
//     if (!this.editor) {
//       return;
//     }
//     for (const propName in changes) {
//       if (changes.hasOwnProperty(propName)) {
//         switch (propName) {
//           case 'text':
//             this.onExternalUpdate_();
//             break;
//           case 'mode':
//             this.onEditorModeChange_();
//             break;
//           default:
//         }
//       }
//     }
//   }
//   private initEditor_(): void {
//     this.editor = edit(this.editorRef.nativeElement);
//     this.editor.setOptions(this.options);

//     const newData = JSON.parse(this.text);
//     const nextVal = newData.next.map((nextValue:any)=>{
//       // console.log("nextValue",nextValue);
//       return nextValue.value;
//    })

//    const paramVal = newData.params.map((paramValue:any)=>{
//       // console.log("nextValue",paramValue);
//       const param = `${paramValue.name} : ${paramValue.value}`
//       return param;
//    })
//     const _obj:any = {};
//       _obj.steps = {
//          name: newData.name.value,
//          type: newData.type.value,
//          trigger: newData.trigger.value,
//          params: paramVal,
//          next: nextVal
//       }
//       console.log("_obj",_obj);

//     this.editor.setValue(this.text, -1);
//     // this.editor.setReadOnly(this.readOnly);
//     this.editor.setTheme('ace/theme/textmate');
//     this.setEditorMode_();
//     this.editor.session.setUseWorker(false);

//     // console.log("this.text", JSON.parse(this.text));
//     this.editor.on('change', () => this.onEditorTextChange_());
//   }
//   private onExternalUpdate_(): void {
//     const point = this.editor.getCursorPosition();

//     this.editor.setValue(this.text, -1);
//     this.editor.moveCursorToPosition(point);
//   }
//   private onEditorTextChange_(): void {
//     this.text = this.editor.getValue();
//     this.onTextChange(this.text);
//   }
//   private onEditorModeChange_(): void {
//     this.setEditorMode_();
//   }
//   private setEditorMode_(): void {
//     this.editor.getSession().setMode(`ace/mode/${this.mode}`);
//   }
// }
