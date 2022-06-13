import { OnInit } from '@angular/core';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../role.service';

@Component({
  selector: 'kc-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent implements OnInit {
  isSubmitting!: boolean;

  roleForm!: FormGroup;

  permissionList!: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _roleService: RoleService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RoleFormComponent>
  ) {}

  ngOnInit(): void {
    this.getPermissions();
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      permissions: [[], Validators.required],
    });
    if (this.data) {
      const _permissions = this.data?.permissions?.map(
        (permission: any) => permission?.name
      );
      const _payload = {
        name: this.data?.name,
        permissions: _permissions,
      };
      this.roleForm.patchValue(_payload);
      this.roleForm.get('name')?.disable();
    }
  }

  // Permissions Array
  get permissionsArray(): FormArray {
    return this.roleForm.get('permissions') as FormArray;
  }

  // Form Submit
  onSubmit(): void {
    const _formData = this.roleForm.getRawValue();
    console.log('Form Value:', this.roleForm.value, _formData);
    const permissions = _formData?.permissions?.map((role: any) => ({
      name: role,
    }));
    const payload = {
      permissions,
      name: _formData?.name?.toUpperCase(),
    };
    if (this.data) {
      this._roleService.updateRole(this?.data?.name, payload).subscribe(
        (_) => {
          // this.snackBar.open('Success! Role created.', 'Close', {
          //   duration: 4000,
          // });
          this.dialogRef.close(true);
        },
        (err) => {
          // this.snackBar.open(err?.error?.message, 'Close', {
          //   duration: 6000,
          // });
        }
      );
    } else {
      this._roleService.createRole(payload).subscribe(
        (_) => {
          // this.snackBar.open('Success! Role created.', 'Close', {
          //   duration: 4000,
          // });
          this.dialogRef.close(true);
        },
        (err) => {
          console.log('Error:', err?.error);
          // this.snackBar.open(err?.error?.message, 'Close', {
          //   duration: 6000,
          // });
        }
      );
    }
  }

  // Dependencies resources
  getPermissions(): void {
    this._roleService.getPermissions().subscribe(
      (res) => {
        this.permissionList = res?.data;
      },
      (err) => {
        // this.snackBar.open(err?.error?.message, 'Close', {
        //   duration: 5000,
        // });
      }
    );
  }
}
