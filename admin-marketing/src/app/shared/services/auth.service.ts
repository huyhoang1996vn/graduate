import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {

    constructor(private http: Http) { }

    /* 
        function login(): login with email, password
        author: Lam
    */
    auth(value): Observable<any> {
        return this.http.post(api.login, JSON.stringify(value), httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error);
    }

}
