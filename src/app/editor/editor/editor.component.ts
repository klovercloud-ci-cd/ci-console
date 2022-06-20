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
import { load as fromYaml} from 'js-yaml';
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import { MatDialog } from '@angular/material/dialog';
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
  @Input() readOnly: boolean = true;
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
    private editorService: EditorService,){

    this.currentRoute = "";
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }
      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        this.currentRoute = event.url;
      }
      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
      }
    });
  }

  ngOnInit(): void {


    // @ts-ignore
    this.editorService.toggleState$.subscribe((res:any) => {

      this.fixProp.emit(res)
    });


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

  getErrorMessageAndSuggestion(line:Number, data:any){

    if (line==1){
        return {message:data.name.message,suggestions:data.name.accepts}
    }else if (line==2){
      return {message:data.type.message,suggestions:data.type.accepts}
    }else if (line==3){
      return {message:data.trigger.message,suggestions:data.trigger.accepts}
    }else if (line<=data.params.length+4 && line >4){
      return {message:data.params[Number(line)-5].message,suggestions:data.params[Number(line)-5].accepts}
    }else{
      return {message:data.params[Number(line)-(data.params.length+1)].message,suggestions:data.params[Number(line)-(data.params.length+1)].accepts}
    }

  }
  private initEditor_(): void {

    this.editor = edit(this.editorRef.nativeElement);
    this.editor.setOptions(this.options);
    this.editor.setValue(this.text, -1);
    this.editor.setReadOnly(this.readOnly);
    this.editor.setTheme('ace/theme/dracula');

    this.setEditorMode_();
    this.editor.session.setUseWorker(false);
    this.editor.on('change', () => this.onEditorTextChange_());
    this.editor.on('change', () => this.onEditorDataChange_());

    // <-----------Multiple Error Showing----------->

    // this.editor.getSession().setAnnotations(jsonErrorArray[currentFileName]);
    let jsonErrorArray:any = [];
    let fileNamesArray:any = [];




    for(let i=0; i<this.errorLine.length; i++){
      let value=this.getErrorMessageAndSuggestion(this.errorLine[i],this.InputData)
      let hasSuggestionMessage,noSuggestionMessage;

      if(!value.message){
        jsonErrorArray.push({
          row: this.errorLine[i] - 1,
          column: undefined,
          text: "No error message available.\nSuggestions: "+((value.suggestions=='*')?'Type anything':value.suggestions),
          type: "error"
        })
      }else {jsonErrorArray.push({
        row: this.errorLine[i] - 1,
        column: undefined,
        text: "[ERROR]: "+value.message+ ".\nSuggestions: "+((value.suggestions=='*')?'Type anything':value.suggestions),
        type: "error"
      })
      }
    }


    this.editor.getSession().setAnnotations(jsonErrorArray);


    // <-----------Error Line Showing----------->

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
  private onEditorDataChange_(): void {
    this.data = this.editor.getValue();
    this.onDataChange(this.data);
  }

  private onEditorModeChange_(): void {
    this.setEditorMode_();
  }

  private setEditorMode_(): void {
    this.editor.getSession().setMode(`ace/mode/${this.mode}`);
  }
}
