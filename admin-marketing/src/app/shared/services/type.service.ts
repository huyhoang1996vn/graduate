import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class TypeService {

    constructor(private http: Http) {
    }

    /* 
        function getEvents(): Get all notification
        author: Lam
    */
    getTypes(lang): Observable<any>{
        const url_getTypes = `${env.api_domain_root}/${lang}/api/${api.type_list}`;
        return this.http.get(url_getTypes).map((res: Response) => res.json());
    }
}
