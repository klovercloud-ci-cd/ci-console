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
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import { MatDialog } from '@angular/material/dialog';
import {EditorModalComponent} from "../editor-modal/editor-modal.component";
import { Router, Event, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import {EditorService} from "../../shared/services/editor.service";
// import {Router} from "@angular/router";

@Component({
  selector: 'kcci-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('editor') editorRef!: ElementRef;
  @Output() textChange = new EventEmitter<string>();
  @Output() dataChange = new EventEmitter<string>();
  @Output() fixProp = new EventEmitter<any>()
  @Input() text!: string;
  @Input() errorLine: any;
  @Input() InputData: any;
  @Input() readOnly: boolean = false;
  @Input() mode: string = 'yaml';
  @Input() prettify: boolean = true;

  editor!: Ace.Editor;

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

  title = 'detect-route-change';
  currentRoute: string;
  private data: string | undefined;

  constructor
    (
    private dialog: MatDialog,private router: Router,
    private editorService: EditorService,
    public editorDialogRef: MatDialogRef<EditorModalComponent>){

    this.currentRoute = "";
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
        console.log('Route change detected',this.currentRoute);
      }
      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        this.currentRoute = event.url;
        console.log("this.currentRoute:",this.currentRoute,event);
      }
      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });
  }

  ngOnInit(): void {
    // console.log("The DATA: ",fromYaml(this.text))

    this.editorDialogRef.afterClosed().subscribe((data) => {
      console.log("Editor M v.2: ", data)
    })
    console.log("UpD Route: ");

    // @ts-ignore
    this.editorService.toggleState$.subscribe((res:any) => {
      console.log("Response: ",res)
      // if(res.stepname == this.InputData.value?.stepData?.name?.value){
      //   switch(res.key) {
      //     case 'name':
      //       this.InputData.name.value = res.replaceValue;
      //       this.InputData.name.valid = true;
      //       break;
      //     case 'type':
      //       this.InputData.type.value = res.replaceValue;
      //       console.log("-----Type-2: ",this.InputData.type.value , res.replaceValue)
      //       break;
      //     case 'trigger':
      //       this.InputData.trigger.value = res.replaceValue;
      //       console.log("-----Trigger")
      //       break;
      //     // case 'params':
      //     //   console.log("-----Params")
      //     //   break;
      //     // case 'next':
      //     //   console.log("-----Next")
      //     //   break;
      //     default:
      //       console.log("-----nothing match found")
      //   }
      //
      //   // this.InputData.name.value = res.replaceValue;
      //   // console.log("ToYAML: ",toYaml(this.InputData));
      //   this.text = toYaml(this.InputData);
      // }
      // else if(res.stepname == this.InputData.type.value){
      //
      //   this.InputData.type.value = res.replaceValue;
      // }

      // console.log("ToYAML: ",this.text);

      console.log("All Data:", this.InputData);
      this.fixProp.emit(res)
    });

    // this.editorService
    //   .getKey()
    //   .subscribe(
    //     (res) => {
    //       console.log("Get Key: ",res);
    //     },
    //     (err) => {
    //       console.log('err', err);
    //     }
    //   );
  }

  ngAfterViewInit(): void {
    this.initEditor_();
    // @ts-ignore

  }

  onTextChange(text: string): void {
    this.textChange.emit(text);
  }
  onDataChange(data:any):void{
    this.dataChange.emit(data);
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
    console.log("Total Text: ",typeof this.text);

    this.setEditorMode_();
    this.editor.session.setUseWorker(false);
    this.editor.on('change', () => this.onEditorTextChange_());
    this.editor.on('change', () => this.onEditorDataChange_());

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


    // <-----------Error Line Showing----------->

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

    switch(mainKey) {
      case 'name':
        if(this.InputData.name.valid !== "true") {
          this.openDialog(this.InputData.name.value,mainKey,this.InputData[mainKey].accepts);
        }
        break;
      case 'type':
        if (this.InputData.type.valid !== "true"){
          this.openDialog(this.InputData.type.value.toLowerCase(),mainKey,this.InputData[mainKey].accepts);
        }
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



  }

    openDialog(step:string,key:string,msg:string) {
      let accepts = msg.split(",")
      // console.log(" step name:",step)
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '20%';
      dialogConfig.panelClass = 'custom-modalbox';
      dialogConfig.data = {
        key:key,
        stepname:step,
        message: accepts,
      };
      this.dialog.open(EditorModalComponent, dialogConfig);

      // this.dialog.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed');
      //   // reference the closeMessage property here
      //   console.log("Results:",result);
      // });
    }

  // refactorField(step:string,key:string,value:string){
  //   console.log("step:", step," key: ",key, " value: ",value)
  // }
  private onExternalUpdate_(): void {
    const point = this.editor.getCursorPosition();
    this.editor.setValue(this.text, -1);
    this.editor.moveCursorToPosition(point);
  }

  private onEditorTextChange_(): void {
    this.text = this.editor.getValue();
    this.onTextChange(this.text);
    console.log("On text : ",this.text)
  }
  private onEditorDataChange_(): void {
    this.data = this.editor.getValue();
    this.onDataChange(this.data);
    console.log("On Data : ",this.data)
  }

  private onEditorModeChange_(): void {
    this.setEditorMode_();
  }

  private setEditorMode_(): void {
    this.editor.getSession().setMode(`ace/mode/${this.mode}`);
  }
}
