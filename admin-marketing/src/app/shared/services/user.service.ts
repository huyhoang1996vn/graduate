import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { api } from '../utils/api';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { User } from '../../shared/class/user';
import { get_token } from '../auth/auth-token';

@Injectable()
export class UserService {

    constructor(private http: Http) {
    }

    /*
        GET: Get All Users From Server
        @author: TrangLe
     */
    getAllUsers(): Observable<User[]> {
        let url = `${api.users}`;
        return this.http.get(url).map((res: Response) => res.json());
    }

    /*
        DELETE: Delete User By Id
        @author: Trangle
     */
    getUserById(id: number): Observable<User> {
        const url = `${api.users}${id}/`;
        return this.http.get(url).map((res: Response) => res.json());
    }

    /*
        DELETE: Delete User By ID
        @author: Trangle
    */
    deleteUserById(user: User): Observable<User> {
        const id = user.id;
        const url = `${api.users}${id}/`;
        return this.http.delete(url).map((res: Response) => res.json());
    }

    /*
        POST: Create User
        @author: TrangLe
    */
    createUser(userFormData: FormData): Observable<any> {

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', api.users);
            let token = get_token();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(userFormData);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr);
                    }
                }
            }
        });
    }

    /*
        PUT: Update User
        @author: Trangle
    */

    updateUser(userForm: FormData, id: number): Observable<any> {
        const url = `${api.users}${id}/`;

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url);
            let token = get_token();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(userForm);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr);
                    }
                }
            }
        });
    }

    /*
        DELETE: Delete User Selected
        @author: Trangle
    */

    deleteUserSelected(user_id): Observable<any> {
        let url = `${api.users}`;
        let param = {
            user_id: user_id
        };
        let _options = new RequestOptions({
            body: JSON.stringify(param)
        });
        return this.http.delete(url, _options).map((res: Response) => res.json());
    }

    /*
        getUserByToken: get User By Token
        @author: Trangle
     */
    getUserByToken(value): Observable<any> {
        let _option = {
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${value}`
            })
        };
        return this.http.get(api.account_users, _option).map((res: Response) => res.json());
    }
}