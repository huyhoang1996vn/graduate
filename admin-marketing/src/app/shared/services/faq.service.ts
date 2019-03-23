import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class FaqService {

    constructor(private http: Http) {
    }

    /* 
        function getEvents(): Get all notification
        author: Lam
    */
    getFaqs(lang): Observable<any>{
        const url_getFaqs = `${env.api_domain_root}/${lang}/api/${api.faq_list}`;
        return this.http.get(url_getFaqs).map((res: Response) => res.json());
    }

    getFaq(id: number, lang): Observable<any>{
        const url_getFaq = `${env.api_domain_root}/${lang}/api/${api.faq}${id}/`;
        return this.http.get(url_getFaq).map((res: Response) => res.json());
    }

    /* 
        function onDelEventSelect(): Delete all event selected
        author: Lam
    */
    onDelFaqSelect(arr, lang): Observable<any>{
        const url_onDelFaqSelect = `${env.api_domain_root}/${lang}/api/${api.faq_list}`;

        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            body: JSON.stringify(param)
        });

        return this.http.delete(url_onDelFaqSelect, _options).map((res: Response) => res.json());
    }

    addFaq(value, lang): Observable<any>{
        const url_addFaq = `${env.api_domain_root}/${lang}/api/${api.faq}`;
        let body = JSON.stringify(value); // String payload
        return this.http.post(url_addFaq, body )
            .map((res: Response) => res.json());
    }

    updateFaq(value, id: number, lang): Observable<any>{
        const url_updateFaq = `${env.api_domain_root}/${lang}/api/${api.faq}${id}/`;
        return this.http.put(url_updateFaq, JSON.stringify(value))
            .map((res: Response) => res.json());
    }

    onDelFaq(id: number, lang): Observable<any>{
        const url_onDelFaq = `${env.api_domain_root}/${lang}/api/${api.faq}${id}/`;
        return this.http.delete(url_onDelFaq).map((res: Response) => res.json());
    }

}
