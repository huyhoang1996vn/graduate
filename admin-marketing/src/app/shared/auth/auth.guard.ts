import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { VariableGlobals } from './../commons/variable_globals';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private variableGlobals: VariableGlobals) { }

    /*
        Function canActivate(): check token
        Author: Lam
    */

    canActivate() {
        if (localStorage.getItem('auth_token')) {
            this.variableGlobals.user_current = JSON.parse(localStorage.getItem('current_user'));
            // logged in so return true
            return true;
        }
        this.variableGlobals.user_current = null;
        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
     
}