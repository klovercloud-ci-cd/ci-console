import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
//import { userInfo } from 'os';
import { AuthService } from 'src/app/auth/auth.service';
import { ToolbarService } from 'src/app/shared/services/toolbar.service';
import { UserDataService } from 'src/app/shared/services/user-data.service';
import { SharedSnackbarService } from 'src/app/shared/snackbar/shared-snackbar.service';

@Component({
  selector: 'kcci-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  //user: any = this.auth.getUserData();
  userResourceArray:any;

  storepath:any;
  superadminresponsibilityarray: any = [];
  adminresponsibilityarray: any = [];
  viewerresponsibilityarray: any=[];
  userInfo: any;
//   element:any;
  constructor(
    // private _toolbarService: ToolbarService,
    // private userData: UserDataService,
    // private auth: AuthService,
    // private snack: SharedSnackbarService,
  )
  // This is a demo data for Practice
   {
   
  }

  ngOnInit(): void {
    // this._toolbarService.changeData({ title: 'Account' });
    // this.userData.getUserInfo(this.user.user_id).subscribe((res) => {
    //   this.userInfo = res;
    //   this.userResourceArray = res.data.resource_permission.resources;
    // },(err)=>{
    //   this.snack.openSnackBar('User not found!',err.error.message,'sb-error')
    // });

    // =====Json======
    this.userInfo = {
        "data": {
            "metadata": {
                "company_id": "93071fc3-d136-4fa5-9184-eee42a7255a7",
                "first_name": "",
                "last_name": ""
            },
            "id": "868af140-551b-48f7-bec3-8316e49262fb",
            "first_name": "shabrul",
            "last_name": "islam",
            "email": "shabrul2451@gmail.com",
            "phone": "1521339629",
            "password": "",
            "status": "active",
            "created_date": "2022-08-04T06:07:13.511Z",
            "updated_date": "2022-08-04T06:07:13.511Z",
            "auth_type": "password",
            "resource_permission": {
                "resources": [
                    {
                        "name": "user",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "pipeline",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "process",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "company",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "user",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "pipeline",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "process",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "company",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "pipeline",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "process",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "company",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "user",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "pipeline",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "process",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "company",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "pipeline",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "process",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "company",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "user",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "pipeline",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "process",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "company",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "repository",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "application",
                        "roles": [
                            {
                                "name": "ADMIN"
                            }
                        ]
                    },
                    {
                        "name": "role",
                        "roles": [
                            {
                                "name": "VIEWER"
                            }
                        ]
                    },
                    {
                        "name": "permission",
                        "roles": [
                            {
                                "name": "VIEWER"
                            }
                        ]
                    },
                    {
                        "name": "Pipeline",
                        "roles": [
                            {
                                "name": "VIEWER"
                            }
                        ]
                    },
                    {
                        "name": "Repository",
                        "roles": [
                            {
                                "name": "SUPERADMIN"
                            }
                        ]
                    },
                    {
                        "name": "Application",
                        "roles": [
                            {
                                "name": "SUPERADMIN"
                            }
                        ]
                    },
                    {
                        "name": "role",
                        "roles": [
                            {
                                "name": "SUPERADMIN"
                            }
                        ]
                    },
                    {
                        "name": "permission",
                        "roles": [
                            {
                                "name": "SUPERADMIN"
                            }
                        ]
                    }
                    
                ]
            }
        },
        "status": "success",
        "message": "Success!"
    };
  //   this.userResourceArray = [
  //     {
  //         "name": "user",
  //         "roles": [
  //             {
  //                 "name": "ADMIN"
  //             }
  //         ]
  //     },
  //     {
  //         "name": "pipeline",
  //         "roles": [
  //             {
  //                 "name": "ADMIN"
  //             }
  //         ]
  //     },
  //     {
  //         "name": "process",
  //         "roles": [
  //             {
  //                 "name": "ADMIN"
  //             }
  //         ]
  //     },
  //     {
  //         "name": "company",
  //         "roles": [
  //             {
  //                 "name": "ADMIN"
  //             }
  //         ]
  //     },
  //     {
  //         "name": "repository",
  //         "roles": [
  //             {
  //                 "name": "ADMIN"
  //             }
  //         ]
  //     },
  //     {
  //         "name": "application",
  //         "roles": [
  //             {
  //                 "name": "ADMIN"
  //             }
  //         ]
  //     },
  //     {
  //         "name": "role",
  //         "roles": [
  //             {
  //                 "name": "VIEWER"
  //             }
  //         ]
  //     },
  //     {
  //         "name": "permission",
  //         "roles": [
  //             {
  //                 "name": "VIEWER"
  //             }
  //         ]
  //     }
  // ]
  this.storepath=this.userInfo?.data?.resource_permission?.resources;
  this.storepath?.forEach((element:any) => {
    console.log(element)
    if(element.roles[0].name=="ADMIN")
    {
        this.adminresponsibilityarray.push(element.name )
    }
    if(element.roles[0].name=="VIEWER")
    {
        this.viewerresponsibilityarray.push(element.name )
    }
    if(element.roles[0].name=="SUPERADMIN")
    {
        this.superadminresponsibilityarray.push(element.name)
    }
  });
   

  
   
  }
  
}
