import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  showFiller = true;
  pageTitle: string = '';
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log(this.router.url.substring(1));

    this.pageTitle = this.router.url.substring(1);
  }
}
