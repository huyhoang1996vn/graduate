import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class CategoryService {

  	constructor(private http: Http) { 

    }

  	/* 
        function getCategoryNotifications(): Get all Category Notifications
        author: Lam
    */
    getAllCategory(): Observable<any> {
        return this.http.get(api.category_list ).map((res: Response) => res.json());
    }

}
