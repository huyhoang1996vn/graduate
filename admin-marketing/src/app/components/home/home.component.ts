import { Component, OnInit } from '@angular/core';
import { sites } from '../../shared/class/home';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  	constructor() { }

  	sites = sites;
  	
  	ngOnInit() {
  	}

}
