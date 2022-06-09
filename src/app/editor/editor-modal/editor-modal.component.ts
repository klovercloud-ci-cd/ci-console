import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Output, EventEmitter } from '@angular/core';
import {Router} from "@angular/router";
import {EditorService} from "../../shared/services/editor.service";
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
  public href: string = "";
  url: string = "asdf";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditorModalComponent,
    public dialogRef: MatDialogRef<EditorModalComponent>,
    private editorService: EditorService,
    private router: Router,
  ) {
    message:data.message;
    stepname: data.stepname;
  }

  ngOnInit(): void {}

  closeAppModal() {
    console.log("Close Method Call");
    const data = {"step1": "SOme data"}
    console.log("Close Method Call",data);
    this.dialogRef.close(data);
  }

  Edit(stepname:any,key:any,replaceValue:any): void {

    setTimeout(() => {
      this.editorService.emitData(stepname,key,replaceValue);
    }, );

    this.dialogRef.close();
    // this.dialogRef.afterClosed().subscribe((data) => {
    //   console.log("Editor Model Data v.2: ", data)
    // })
  }
}

