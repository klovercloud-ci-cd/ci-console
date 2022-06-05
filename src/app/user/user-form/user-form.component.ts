import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from 'src/app/roles/role.service';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { ConfirmPasswordMatch } from 'src/app/shared/validators/confirmPassword.validator';
import { UserService } from '../user.service';

@Component({
  selector: 'kc-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  userId!: string;
  userData: any;

  userForm!: FormGroup;
  resourceList!: any[];
  roleList!: any[];

  isUserLoading!: boolean;
  isResourcesLoaded!: boolean;
  isRolesLoaded!: boolean;
  isSubmitting!: boolean;

  showPasswordField: boolean = true;

  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private _toolbarService: ToolbarService,
    private router: Router,
    private _roleService: RoleService
  ) {
    this.userId = route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this._toolbarService.changeData({ title: 'Settings' });
    if (this.userId) {
      this.getUser(this.userId);
    }
    this.getResources();
    this.getRoles();
    this.userForm = this.fb.group(
      {
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [],
        password: ['', [Validators.required]],
        conformationPassword: [''],
        auth_type: ['password', Validators.required],
        resource_permission: this.fb.group({
          resources: this.fb.array([]),
        }),
      },
      {
        validators: ConfirmPasswordMatch('password', 'conformationPassword'),
      }
    );

    if (!this.userId) {
      this.addResourcesGroup();
    } else {
      this.removePasswordControl();
    }
  }

  // Resource Form Array
  resourceGroup(data?: any): FormGroup {
    const _formGroup = this.fb.group({
      name: ['', Validators.required],
      roles: [[], Validators.required],
    });
    if (data) {
      _formGroup.patchValue(data);
    }
    return _formGroup;
  }

  get resourcesFormArray(): FormArray {
    return this.userForm
      ?.get('resource_permission')
      ?.get('resources') as FormArray;
  }

  addResourcesGroup(data?: any): void {
    this.resourcesFormArray.push(this.resourceGroup(data));
  }

  removeResourcesGroup(index: number): void {
    this.resourcesFormArray.removeAt(index);
  }

  // Patch Form
  patchForm(userData: any): void {
    console.log('patch userData', userData);
    const _formData = {
      first_name: userData?.first_name,
      last_name: userData?.last_name,
      phone: userData?.phone,
      email: userData?.email,
    };
    console.log(_formData);
    this.userForm.patchValue(_formData);
    const resources = userData?.resource_permission?.resources;
    if (resources?.length) {
      resources?.map((resource: any) => {
        const roles = resource?.roles?.map((role: any) => role?.name);
        const _payload = {
          name: resource?.name,
          roles: roles,
        };
        this.addResourcesGroup(_payload);
      });
    }
  }

  // Form Submit
  onSubmit(): void {
    this.isSubmitting = true;
    const _formData = this.userForm.value;
    console.log('_formData: ', _formData);

    const resourceData = this.resourcesFormArray.value;
    const resources = resourceData.map((resource: any) => {
      const roles = resource.roles.map((role: any) => {
        return { name: role };
      });
      return { ...resource, roles };
    });
    _formData.resource_permission['resources'] = resources;
    _formData['phone'] = _formData?.['phone'].toString();
    if (this.userData) {
      this._userService.updateUser(this.userId, _formData).subscribe(
        (_) => {
          this.snackBar.open('Success! User updated.', 'Close', {
            duration: 10000,
          });
          this.router.navigate(['/users']);
          this.isSubmitting = false;
        },
        (err) => {
          this.isSubmitting = false;
          this.snackBar.open(err?.error?.message, 'Close', {
            duration: 10000,
          });
        }
      );
    } else {
      this._userService.createUser(_formData).subscribe(
        (_) => {
          this.snackBar.open('Success! User created.', 'Close', {
            duration: 10000,
          });
          this.router.navigate(['/users']);
        },
        (err) => {
          this.isSubmitting = false;
          this.snackBar.open(err?.error?.message, 'Close', {
            duration: 10000,
          });
        }
      );
    }
  }

  // Update Form Dependencies
  getUser(id: string): void {
    this.isUserLoading = true;
    this._userService.getUser(id).subscribe(
      (res) => {
        this.isUserLoading = false;
        this.userData = res?.data;
        this.patchForm(res?.data);
      },
      (err) => {
        this.isUserLoading = false;
        this.snackBar.open(err?.error?.message, 'Close', {
          duration: 5000,
        });
        this.router.navigate(['/users']);
      }
    );
  }

  // Dependencies
  getResources(): void {
    this._userService.getResources().subscribe(
      (res) => {
        this.resourceList = res?.data;
      },
      (err) => {
        console.log(err);
        this.snackBar.open(err?.error?.message, 'Close', {
          duration: 5000,
        });
      }
    );
  }

  getRoles(): void {
    this._roleService.getRoles().subscribe(
      (res) => {
        this.roleList = res?.data;
      },
      (err) => {
        console.log(err);
        this.snackBar.open(err?.error?.message, 'Close', {
          duration: 5000,
        });
      }
    );
  }

  // Password
  togglePasswordControl(): void {
    if (this.showPasswordField) {
      this.removePasswordControl();
    } else {
      this.addPasswordControl();
    }
  }

  addPasswordControl(): void {
    this.showPasswordField = true;
    this.userForm.addControl(
      'password',
      this.fb.control('', [Validators.required, Validators.minLength(10)])
    );
    this.userForm.addControl('conformationPassword', this.fb.control(''));
  }

  removePasswordControl(): void {
    this.showPasswordField = false;
    this.userForm.removeControl('password');
    this.userForm.removeControl('conformationPassword');
  }
}
