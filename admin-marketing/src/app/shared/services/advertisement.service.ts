import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import { Advertisement } from '../../shared/class/advertisement';

@Injectable()
export class AdvertisementService {

	constructor(private http: Http) {
	}
	/*
		GET: Get All Advertiment From Service
		@author: TrangLe
	 */
	getAllAdvertisement(lang): Observable<any> {
		let urlAdv = `${env.api_domain_root}/${lang}/api/${api.advertisement}`;
		return this.http.get( urlAdv ).map((res: Response) => res.json());
	}

	/*
		POST: Add Advertiment
		@author: TrangLe
	 */
	addAdvertisement(adv: Advertisement, lang): Observable<Advertisement> {
		let urlAdv = `${env.api_domain_root}/${lang}/api/${api.advertisement}`;
		return this.http.post( urlAdv, adv )
			.map((res: Response) => res.json());
	}

	/*
		GET: Get Advertiment By Id
		@author: TrangLe
	 */
	getAdvertisement(id: number, lang): Observable<Advertisement> {
		const url = `${env.api_domain_root}/${lang}/api/${api.advertisement}${id}/`;
		return this.http.get( url ).map((res: Response) => res.json());
	}

	deleteAdvById(id: number, lang): Observable<Advertisement> {
		const url = `${env.api_domain_root}/${lang}/api/${api.advertisement}${id}/`;
		return this.http.delete( url ).map((res: Response) => res.json());
	}

	/*
		POST: Update detail Advertiment
		@author: TrangLe
	 */
	updateAdv(adv, id: number, lang): Observable<Advertisement> {
		// const id = adv.id;
		var body = JSON.stringify(adv);
		const url = `${env.api_domain_root}/${lang}/api/${api.advertisement}${id}/`;
		return this.http.put( url, body ).map((res: Response) => res.json());
	}
	/*
		DELETE: Delete All Advertiment which checked box
		@author: TrangLe
	 */
	deleteAllAdvsSelected(adv_id, lang): Observable<any> {
		let url = `${env.api_domain_root}/${lang}/api/${api.advertisement}`;
		let param = {
			adv_id: adv_id
		}
		let _options = new RequestOptions({
			body: JSON.stringify(param)
		});
		return this.http.delete(url, _options)
			.map((res: Response) => res.json());
	}
}
