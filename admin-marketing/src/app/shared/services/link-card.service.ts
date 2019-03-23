import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../class/user';
import { Customer } from '../class/customer';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class LinkCardService {

    private url_app = api.user;
    private url_embed = api.user_embed;
    private url_relate = api.relate;
    private url_delete_relate = api.delete_relate;

    constructor(private http: Http) {
    }

    /* 
        function getEmail(): Get user by email
        author: Lam
    */
    getEmail(email) {
        const url_get_email = `${this.url_app}?email=${email}`;
        return this.http.get(url_get_email).map((res: Response) => res.json());
    }

    /* 
        function updateUserApp(): Update user
        author: Lam
    */
    updateUserApp(user_app: User, id: number): Observable<any> {
        const urlUser = `${this.url_app}${id}/`;
        return this.http.put(urlUser, JSON.stringify(user_app))
            .map((res: Response) => res.json());
    }

    /* 
        function getBarcode(): Get user embed by barcode
        author: Lam
    */
    getBarcode(barcode): Observable<any> {
        const url_get_barcode = `${this.url_embed}?barcode=${barcode}`;
        return this.http.get(url_get_barcode).map((res: Response) => res.json());
    }

    /* 
        function updateUserEmbed(): Update user embed
        author: Lam
    */
    updateUserEmbed(user_embed: User): Observable<any> {
        const id = user_embed.barcode;
        const urlUser = `${this.url_embed}${id}/`;
        return this.http.put(urlUser, JSON.stringify(user_embed))
            .map((res: Response) => res.json());
    }

    /* 
        function getUserApp(): Get user by id
        author: Lam
    */
    getUserApp(id: number): Observable<any> {
        const url_app_id = `${this.url_app}${id}`;
        return this.http.get(url_app_id).map((res: Response) => res.json());
    }

    /* 
        function getUserEmbed(): Get user embed by id
        author: Lam
    */
    getUserEmbed(id: number): Observable<any> {
        const url_embed_id = `${this.url_embed}${id}`;
        return this.http.get(url_embed_id).map((res: Response) => res.json());
    }

    /* 
        function delLinkCard(): Delete link card by id
        author: Lam
    */
    delLinkCard(id: number): Observable<any> {
        const url_del_linkcard = `${this.url_delete_relate}${id}`;
        return this.http.delete(url_del_linkcard).map((res: Response) => res.json());
    }

    /* 
        function relate(): check link card and create link card
        author: Lam
    */
    relate(email, barcode): Observable<any> {
        let obj_relate = { email: email, barcode: barcode };
        return this.http.post(this.url_relate, obj_relate).map((res: Response) => res.json());
    }

    /* function getAllLinkedUsers(): Get all linked card users
        author: Trangle
    */
    getAllLinkedUsers(): Observable<User[]> {
        const url = `${api.user_link_card}`;
        return this.http.get(url).map((res: Response) => res.json());
    }
    /* Delete All checkbox chosen
        author: TrangLe
    */

    deleteAllUserLinkedSelected(user_linked_id): Observable<any> {
        const url = `${api.user_link_card}`;
        let param = {
            user_linked_id: user_linked_id
        }
        let _options = new RequestOptions({
            body: JSON.stringify(param)
        });
        return this.http.delete(url, _options).map((res: Response) => res.json());
    }

}
