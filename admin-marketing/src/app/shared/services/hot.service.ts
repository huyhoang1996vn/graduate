import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";
import { get_token } from '../auth/auth-token';

@Injectable()
export class HotService {


    constructor(private http: Http) {
    }

    /* 
        function getHots(): Get all hot
        author: Lam
    */
    getHots(lang): Observable<any>{
        const url_getHots = `${env.api_domain_root}/${lang}/api/${api.hot_list}`;
        return this.http.get(url_getHots).map((res: Response) => res.json());
    }

    getHot(id: number, lang): Observable<any>{
        const url_getHot = `${env.api_domain_root}/${lang}/api/${api.hot}${id}/`;
        return this.http.get(url_getHot).map((res: Response) => res.json());
    }

    /* 
        function onDelHotSelect(): Delete all hot selected
        author: Lam
    */
    onDelHotSelect(arr, lang): Observable<any>{
        const url_onDelHotSelect = `${env.api_domain_root}/${lang}/api/${api.hot_list}`;

        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            body: JSON.stringify(param)
        });

        return this.http.delete(url_onDelHotSelect, _options).map((res: Response) => res.json());
    }

    addHot(value: FormData, lang): Observable<any>{
        const url_addHot = `${env.api_domain_root}/${lang}/api/${api.hot}`;

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url_addHot);
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

    updateHot(value: FormData, id: number, lang): Observable<any>{
        const url_updateHot = `${env.api_domain_root}/${lang}/api/${api.hot}${id}/`;

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url_updateHot);
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

    onDelHot(id, lang): Observable<any>{
        const url_onDelHot = `${env.api_domain_root}/${lang}/api/${api.hot}${id}/`;
        return this.http.delete(url_onDelHot).map((res: Response) => res.json());
    }

}
