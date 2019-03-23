import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";
import { get_token } from '../auth/auth-token';

@Injectable()
export class EventService {

    constructor(private http: Http) {
     }

    /* 
        function getEvents(): Get all notification
        author: Lam
    */
    getEvents(lang): Observable<any>{
        const url_getEvents = `${env.api_domain_root}/${lang}/api/${api.event_list}`;
        return this.http.get(url_getEvents).map((res: Response) => res.json());
    }

    getEvent(id: number, lang): Observable<any>{
        const url_getEvent = `${env.api_domain_root}/${lang}/api/${api.event}${id}/`;
        return this.http.get(url_getEvent).map((res: Response) => res.json());
    }

    /* 
        function onDelEventSelect(): Delete all event selected
        author: Lam
    */
    onDelEventSelect(arr, lang): Observable<any>{
        const url_onDelEventSelect = `${env.api_domain_root}/${lang}/api/${api.event_list}`;

        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            body: JSON.stringify(param)
        });

        return this.http.delete(url_onDelEventSelect, _options).map((res: Response) => res.json());
    }

    addEvent(value: FormData, lang): Observable<any>{
        const url_addEvent = `${env.api_domain_root}/${lang}/api/${api.event}`;
        
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url_addEvent);
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

    updateEvent(value: FormData, id: number, lang): Observable<any>{
        const url_updateEvent = `${env.api_domain_root}/${lang}/api/${api.event}${id}/`;
        
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url_updateEvent);
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

    onDelEvent(id: number, lang): Observable<any>{
        const url_onDelEvent = `${env.api_domain_root}/${lang}/api/${api.event}${id}/`;
        return this.http.delete(url_onDelEvent).map((res: Response) => res.json());
    }

}
