import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class OpenTimeService {

    constructor(private http: Http) { 
    }

    /* 
        function getOpenTime(): get list date of month, year
        author: Lam
    */
    getOpenTime(month, year): Observable<any> {
        const url_getOpenTime = `${api.opentime}?month=${month}&year=${year}`;
        return this.http.get(url_getOpenTime).map((res: Response) => res.json());
    }

    /* 
        function addOpenTime(): add date start to end
        author: Lam
    */
    addOpenTime(value): Observable<any> {
        let body = JSON.stringify(value); // String payload
        return this.http.post(api.opentime, body)
            .map((res: Response) => res.json());
    }

}
