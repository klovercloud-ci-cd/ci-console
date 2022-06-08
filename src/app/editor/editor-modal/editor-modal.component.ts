import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EditorModalComponent,
    public dialogRef: MatDialogRef<EditorModalComponent>,
    ) {
    message:data.message;
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

}
