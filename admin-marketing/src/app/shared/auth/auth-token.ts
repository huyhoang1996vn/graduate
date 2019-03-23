import * as moment from 'moment';
import * as config_auth from './reset-auth-data';

/* 
	expire time is 15 munites 
	if over expire time, clear data of auth
	else return token
*/
export let get_token = function(){
	var exp = localStorage.getItem('time');
    if (exp && moment().valueOf() > parseInt(exp)) {
        config_auth.resetAuthData();
        return '';
    }
    // Current time + 15 minutes
    var exp_time = moment().add(15, 'minutes').valueOf().toString();
    localStorage.setItem('time', exp_time);
    return localStorage.getItem('auth_token');
}
	
