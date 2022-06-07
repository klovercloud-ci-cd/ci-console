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
import { Ace, edit, Range } from 'ace-builds';
import 'ace-builds';
import 'ace-builds/src-noconflict/theme-dracula';


@Component({
  selector: 'kcci-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('editor') editorRef!: ElementRef;
  @Output() textChange = new EventEmitter<string>();
  @Input() text!: string;
  @Input() errorLine!: number;
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
  constructor() {}

  ngOnInit(): void { }

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
    console.log("this.errorLine: ",this.errorLine);
    
    this.setEditorMode_();
    this.editor.session.setUseWorker(false);
    this.editor.on('change', () => this.onEditorTextChange_());
   
    
    const some = document.querySelectorAll('.ace_gutter > .ace_layer > .ace_error');
    //@ts-ignore
    console.log(some);
    
    // some.addEventListener('click', (event) => {
    //   console.log('Hi!');
    // });

    this.editor.getSession().setAnnotations([{
      row: this.errorLine -1,
      column: undefined,
      text: "Error occurred in this line.", // Or the Json reply from the parser 
      type: "error", // also "warning" and "information"
      
    }]);
    // this.editor.session.addMarker(new Range(1, 0, 1, 1), 'ace_highlight-marker', 'fullLine',true);
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