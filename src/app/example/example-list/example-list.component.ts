import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example-list',
  templateUrl: './example-list.component.html',
  styleUrls: ['./example-list.component.scss'],
})
export class ExampleListComponent implements OnInit {
  color: number = 1;
  open:boolean = false;
  constructor() {}

  ngOnInit(): void {}

  clickEvent(){
    this.open = !this.open;
    console.log(this.open);
    
  }
}
