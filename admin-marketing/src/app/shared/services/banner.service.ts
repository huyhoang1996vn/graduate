import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Banner } from '../../shared/class/banner';
import { api } from '../utils/api';
import { get_token } from '../auth/auth-token';

@Injectable()
export class BannerService {

    constructor(private http: Http) {
    }
    /*
      GET: Get All Banner From Service
      @author: TrangLe  
    */
    getAllBanner(): Observable<Banner[]> {
        let url_banner = `${api.banner}`;
        return this.http.get(url_banner).map((res: Response) => res.json());
    }

    /*
      GET: Get Banner By Id
      @author: TrangLe
    */
    getBannerById(id: number): Observable<Banner> {
        // const url = `${api.banner}${id}/`;
        let url = `${api.banner}${id}/`
        return this.http.get(url).map((res: Response) => res.json());
    }
    /*
        PUT: Update Banner By Id
        @author: Trangle
    */

    updateBanner(bannerFormData: FormData, id: number): Observable<any> {
        // let url = `${api.banner}${id}/`;
        let url = `${api.banner}${id}/`;
        
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url);
            let token = get_token();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(bannerFormData);

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
      POST: Create a New Banner
      @author: TrangLe
    */
    CreateBanner(bannerFormData: FormData): Observable<any> {
        let url = `${api.banner}`;
        
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            let token = get_token();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(bannerFormData);
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
    deleteUserById(id: number): Observable<any> {
        let url = `${api.banner}${id}/`
        return this.http.delete(url).map((res: Response) => res.json());
    }

    deleteBannerSelected(banner_id): Observable<any> {
        let url = `${api.banner}`;
        let param = {
            banner_id: banner_id
        }
        let _options = new RequestOptions({
            body: JSON.stringify(param)
        });

        return this.http.delete(url, _options).map((res: Response) => res.json());
    }
}