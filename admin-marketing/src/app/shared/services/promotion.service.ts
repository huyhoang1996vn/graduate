import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";
import { User } from '../class/user';
import { Promotion } from '../class/promotion';
import { api } from '../utils/api';
import { get_token } from '../auth/auth-token';

/*
    @author: diemnguyen
*/
@Injectable()
export class PromotionService {

    constructor(private http: Http) { 
    }

    /*  
        Get user promotion list
        @author: diemnguyen
    */
    getUsersPromotion(id: number, lang): Observable<any> {
        const url_getUsersPromotion = `${env.api_domain_root}/${lang}/api/${api.user_promotion}${id}/`;
        return this.http.get(url_getUsersPromotion).map((res: Response) => res.json());

    }

    /*  
        Get all promotion
        @author: diemnguyen
    */
    getAllPromotion(lang): Observable<any> {
        const url_getAllPromotion = `${env.api_domain_root}/${lang}/api/${api.promotion_list}`;
        return this.http.get(url_getAllPromotion).map((res: Response) => res.json());
    }

    /*  
        Get promotion by Id
        @author: diemnguyen
    */
    getPromotionById(id: number, lang): Observable<any> {
        const url_getPromotionById = `${env.api_domain_root}/${lang}/api/${api.promotion}${id}/`;
        return this.http.get(url_getPromotionById).map((res: Response) => res.json());
    }


    /*  
        Delete promotion by Id
        @author: diemnguyen
    */
    deletePromotionById(id: number, lang): Observable<any> {
        const url_deletePromotionById = `${env.api_domain_root}/${lang}/api/${api.promotion}${id}/`;
        return this.http.delete(url_deletePromotionById).map((res: Response) => res.json());
    }

    /*  
        Save Promotion
        @author: diemnguyen
    */
    savePromotion(promotionFormData:FormData, lang): Observable<any> {
        const url_savePromotion = `${env.api_domain_root}/${lang}/api/${api.promotion}`;

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url_savePromotion);
            let token = get_token();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(promotionFormData);

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
        Update promotion by Id
        @author: diemnguyen
    */
  
     updatePromotion(promotionFormData:FormData, id: number, lang): Observable<any> { 
        const url_savePromotion = `${env.api_domain_root}/${lang}/api/${api.promotion}${id}/`;

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            // xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpZW1uZ3V5ZW5Adm9vYy52biIsIm9yaWdfaWF0IjoxNTE5Mjk1NDM1LCJ1c2VyX2lkIjozNjAsImVtYWlsIjoiZGllbW5ndXllbkB2b29jLnZuIiwiZXhwIjoxNTE5Mjk1NzM1fQ.z7K4Q6AiT0v6l2BMjrgjBXDqbFUMKTmVxfv4ASv70ng');
            xhr.open('PUT', url_savePromotion);
            let token = get_token();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(promotionFormData);

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
        Delete list promotion selected
        @author: diemnguyen
    */
    deletePromotionList(list_id_selected, lang): Observable<any>{
        const url_deletePromotionList = `${env.api_domain_root}/${lang}/api/${api.promotion_list}`;

        let param = {
            list_promotion_id: list_id_selected
        }

        let _options_delete = new RequestOptions({
            body: JSON.stringify(param)
        });
        return this.http.delete(url_deletePromotionList, _options_delete);
    }

    /*  
        Update User Promotion
        @author: diemnguyen
    */
    updateUserPromotion(id: number, list_user_id, lang): Observable<any>{
        const url_updateUserPromotion = `${env.api_domain_root}/${lang}/api/${api.user_promotion}${id}/`;
        let param = {
            list_user_id: list_user_id
        }
        return this.http.post(url_updateUserPromotion, JSON.stringify(param));
    }
    /*  
        Generator QR code
        @author: diemnguyen
    */
    generator_QR_code(id: number): Observable<any>{
        let generator_QR_code_url = `${api.generator_QR_code}${id}/`
        return this.http.post(generator_QR_code_url, JSON.stringify({'vo':'promotion'}));
    }

    /*  
        Function getPromotionReport(): get promotion report
        @author: Lam
    */
    getPromotionReport(id: number, lang): Observable<any>{
        let url_getPromotionReport = `${env.api_domain_root}/${lang}/api/${api.promotion_statistic}${id}/`
        return this.http.get(url_getPromotionReport).
            map((res: Response) => res.json());
    }
}
