import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'kcci-editor-modal',
  templateUrl: './editor-modal.component.html',
  styleUrls: ['./editor-modal.component.scss']
})
export class EditorModalComponent implements OnInit {
  mainKey: any;
  mainValue: any;
  message: any;
  key: any;
  stepname: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditorModalComponent,
    public dialogRef: MatDialogRef<EditorModalComponent>,
  ) {
    message:data.message;
    stepname: data.stepname
  }

  ngOnInit(): void {

    // @ts-ignore
    console.log("DATA:", this.data?.mainValue);
  }

  closeAppModal() {
    console.log("Close Method Call")
    const data = {"step1": "SOme data"}
    this.dialogRef.close(data);
  }

  Edit(value:string): void {
    console.log("value: ",value)
  }
}



// import {Component, Inject, OnInit} from '@angular/core';
// import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
// import { Output, EventEmitter } from '@angular/core';
// @Component({
//   selector: 'kcci-editor-modal',
//   templateUrl: './editor-modal.component.html',
//   styleUrls: ['./editor-modal.component.scss']
// })
// export class EditorModalComponent implements OnInit {
//   mainKey: any;
//   mainValue: any;
//   message: any;
//   key: any;
// <<<<<<< HEAD
// =======
//   stepname: any
//
// >>>>>>> 2ded9f836fb62b8d7f39f5f9aaa65536ec4f849c
//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: EditorModalComponent,
//     public dialogRef: MatDialogRef<EditorModalComponent>,
//     ) {
//     message:data.message;
//     stepname: data.stepname
//   }
//
//   ngOnInit(): void {
//
//     // @ts-ignore
//     console.log("DATA:", this.data?.mainValue);
//   }
//
//   closeAppModal() {
//     console.log("Close Method Call")
//     const data = {"step1": "SOme data"}
//     this.dialogRef.close(data);
//   }
//
//   Edit(value:string): void {
//     console.log("value: ",value)
//   }
// }
