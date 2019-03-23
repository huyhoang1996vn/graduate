
import { Headers, Http, BaseRequestOptions, RequestOptionsArgs, RequestOptions } from '@angular/http';
import * as moment from 'moment';
import * as config_auth from './reset-auth-data';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer';

export class AuthRequestOptions extends BaseRequestOptions {
 
	headers = new Headers({
		'Content-Type': 'application/json'
	});

	merge(options?: RequestOptionsArgs): RequestOptions {
		var newOptions = super.merge(options);
		const token = localStorage.getItem('auth_token');
		// Start check expire token	
		var exp = localStorage.getItem('time');

		if (exp && moment().valueOf() > parseInt(exp)) {
			newOptions.headers.set(AUTH_HEADER_KEY, `${AUTH_PREFIX}`);
			config_auth.resetAuthData();
		} else {
			newOptions.headers.set(AUTH_HEADER_KEY, `${AUTH_PREFIX} ${token}`);
			// Current time + 15 minutes
			var exp_time = moment().add(15, 'minutes').valueOf().toString();
			localStorage.setItem('time', exp_time);
		}
		
		return newOptions;
	}

}