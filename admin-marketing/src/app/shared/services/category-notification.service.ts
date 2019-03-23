import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class CategoryNotificationService {

    private url = api.category_notifications;

    constructor(private http: Http) { 
    }

    /* 
        function getCategoryNotifications(): Get all Category Notifications
        author: Lam
    */
    getCategoryNotifications(lang): Observable<any> {
        const url = `${env.api_domain_root}/${lang}/api/${api.category_notifications}`;
        return this.http.get(url).map((res: Response) => res.json());
    }

}
