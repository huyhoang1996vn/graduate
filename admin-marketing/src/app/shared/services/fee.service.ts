import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Fee } from '../class/fee';
import { Http, Response, Headers } from '@angular/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { RequestOptions, Request, RequestMethod, RequestOptionsArgs } from '@angular/http'
import { api } from '../utils/api';
import "rxjs/add/operator/catch";

@Injectable()
export class FeeService {

    constructor(private http: Http) {
    }

    private feeUrl = api.fee;
    private feeUrlList = api.fee_list;
    private feeApply = api.fee_apply;


    getFees(): Observable<Fee[]> {
        return this.http.get(this.feeUrlList).map((res: Response) => res.json());
    }

    /*
        get Detail Fee
        @author: Trangle
     */
    getFee(id: number): Observable<Fee> {
        let url = this.feeUrl + `${id}/`;
        return this.http.get(url).map((res: Response) => res.json());
    }

    createFee(fee: Fee): Observable<Fee> {
        return this.http.post(this.feeUrl, fee).map((res: Response) => res.json());
    }

    /*
        Update Fee
        @author: Trangle
     */
    updateFee(fee, id:number): Observable<Fee> {
        let url = this.feeUrl + `${id}/`;
        return this.http.put(url, fee ).map((res: Response) => res.json());
    }
    
    deleteFeeById(id:number): Observable<Fee> {
        let url = this.feeUrl + `${id}/`;
        return this.http.delete(url ).map((res: Response) => res.json());
    }

    deleteListFee(list_id: number[]): Observable<Fee> {
        let options = new RequestOptions({
            body: { 'list_id': list_id },
            method: RequestMethod.Delete,
        })
        return this.http.delete(this.feeUrlList, options).map((res: Response) => res.json());
    }
    applyFee(id: number): Observable<Fee> {
        let feeDetailUrl = this.feeApply + `${id}/`;
        return this.http.put(feeDetailUrl, null).map((res: Response) => res.json());

    }
}