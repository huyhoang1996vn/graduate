import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class RolePermissionService {

    constructor(private http: Http) { 
    }

    /* 
        function getRolePermission(): Get all Category Notifications
        author: Lam
    */
    getRolePermission(): Observable<any> {
        return this.http.get(api.user_role).map((res: Response) => res.json());
    }

    /* 
        function getRole(): Get all Category Notifications
        author: Lam
    */
    getRole(): Observable<any> {
        return this.http.get(api.role_list).map((res: Response) => res.json());
    }

    saveRolePermission(list_role_permission): Observable<any> {
        let body = JSON.stringify(list_role_permission);
        return this.http.put(api.user_role, body).map((res: Response) => res.json());
    }

}
