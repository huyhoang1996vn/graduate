import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

	message_result: string ='';

  	constructor(private route: ActivatedRoute) { }

  	ngOnInit() {
	  	this.route.params.subscribe(params => {
	            if(params.message){
	                this.message_result = params.message;
	            } else {
	                this.message_result = "";
	            }
	        });
  	}

}
