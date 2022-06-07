import  { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import  { MatDialog } from '@angular/material/dialog';
import  {ToastrService} from "ngx-toastr";
import  { AuthService } from '../../../auth/auth.service';
import  { UserDataService } from '../../../shared/services/user-data.service';
import  {SharedSnackbarService} from "../../../shared/snackbar/shared-snackbar.service";
import  {PipelineService} from "../../../application/pipeline.service";
import {environment} from "../../../../environments/environment";
import  {TokenService} from "../../../auth/token.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private userInfo: UserDataService,
    private snackBar: SharedSnackbarService,
    private tostr: ToastrService,
    private pipelineLog: PipelineService,
    private tokenService : TokenService
  ) {}

  pageTitle = '';

  user: any = this.auth.getUserData();

  userPersonalInfo: any;

  sendWS:any

  async ngOnInit(): Promise<void> {
    this.userInfo.getUserInfo(this.user.user_id).subscribe((res) => {
      this.userPersonalInfo = res;
      // console.log('User Info: ', res);
    });
    console.log(this.auth.getUserData())
    const socket = this.pipelineLog.connectToSocket();
    socket.onmessage=(e)=>{
      if (e.data !=='null'){
        const  res =  JSON.parse(e.data);
        // console.log(res, 'hed')
        if (res.status ==='INITIALIZING'){
          console.log(res.process_id)
          this.tostr.info('<a href="http://google.com">Hello world!</a>', 'Toastr fun!',{
            closeButton:true,
            enableHtml:true,
            positionClass:"toast-top-center"
          });
        }
      }
    }
    this.sendWS = setInterval(()=>{
      socket.send(' ')
    },300)
  }

  ngOnDestroy() {
    if (this.sendWS) {
      clearInterval(this.sendWS);
    }
  }

  logout() {
    this.auth.logOut();
  }

  testClick(){

    this.tostr.info('Hello world!', 'Toastr fun!',{
      closeButton:true,


    });
  }
}
