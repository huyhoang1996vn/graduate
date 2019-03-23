import { Injectable } from '@angular/core';

import { Http, Headers, Response } from "@angular/http";

import { Observable } from 'rxjs/Observable';
 
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch'
import { api } from '../utils/api';

import { PromotionType } from '../../shared/class/promotion-type';


@Injectable()
export class PromotionTypeService {

    constructor(private http: Http) {
    }

    /*
        GET: Get All Promorion Type From Server
        @author: TrangLe
    */
    getAllPromotionsType(): Observable<any[]>{
        let urlPromotionType = `${api.promotion_type}`;
        return this.http.get(urlPromotionType).map((res: Response) => res.json());
    }
}