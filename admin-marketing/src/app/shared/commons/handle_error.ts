import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HandleError {

	constructor(private router: Router, private toastr: ToastrService,){

    }
	handle_error(error) {
		switch (error.status) {
			case 401:
				return this.router.navigate(['/login']);
            case 403 || 400: 
            	if (error.response) {
            		return this.toastr.warning(`${JSON.parse(error.response).message}`);
            	} 
            	return this.toastr.warning(`${error.json().message}`);
            case 404:
            	return this.router.navigate(['/error', { message: 'HTTP 404 Not Found'}]);
            case 500:
            	return this.router.navigate(['/error', { message: '500 - Internal Server Error'}]);
            case 0:
            	return this.router.navigate(['/error', { message: 'ERR_CONNECTION_REFUSED'}]);
            default:
                return this.router.navigate(['/error', { message: '501 - Other Error'}]);

        }
	};
}