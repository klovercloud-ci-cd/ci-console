import  { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import  { MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'kc-delete-conformation-dialog',
  templateUrl: './delete-conformation-dialog.component.html',
  styleUrls: ['./delete-conformation-dialog.component.scss']
})
export class DeleteConformationDialogComponent implements OnInit {

  message = "Are you sure?"

  constructor (
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DeleteConformationDialogComponent>) {
      if(data) {
        this.message = data.message || this.message;
      }
    }

  ngOnInit(): void {}

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
