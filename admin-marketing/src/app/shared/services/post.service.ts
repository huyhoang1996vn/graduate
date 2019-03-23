import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";
import { get_token } from '../auth/auth-token';

@Injectable()
export class PostService {

    constructor(private http: Http) {
    }

    /* 
        function getPosts(): Get all post
        author: Lam
    */
    getPosts(lang): Observable<any> {
        const url_getPosts = `${env.api_domain_root}/${lang}/api/${api.post_list}`;
        return this.http.get(url_getPosts).map((res: Response) => res.json());
    }

    getPost(id: number, lang): Observable<any> {
        const url_getPost = `${env.api_domain_root}/${lang}/api/${api.post}${id}/`;
        return this.http.get(url_getPost).map((res: Response) => res.json());
    }

    /* 
        function onDelHotSelect(): Delete all hot selected
        author: Lam
    */
    onDelPostSelect(arr, lang): Observable<any> {
        const url_onDelPostSelect = `${env.api_domain_root}/${lang}/api/${api.post_list}`;

        let param = {
            list_id: arr
        }
        let _options = new RequestOptions({
            body: JSON.stringify(param)
        });

        return this.http.delete(url_onDelPostSelect, _options).map((res: Response) => res.json());
    }

    addPost(value: FormData, lang): Observable<any> {
        const url_addPost = `${env.api_domain_root}/${lang}/api/${api.post}`;
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url_addPost);
            let token = get_token();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(value);

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

    updatePost(value: FormData, id: number, lang): Observable<any> {
        const url_updatePost = `${env.api_domain_root}/${lang}/api/${api.post}${id}/`;
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url_updatePost);
            let token = get_token();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(value);

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

    onDelPost(id: number, lang): Observable<any> {
        const url_onDelPost = `${env.api_domain_root}/${lang}/api/${api.post}${id}/`;
        return this.http.delete(url_onDelPost).map((res: Response) => res.json());
    }

}
