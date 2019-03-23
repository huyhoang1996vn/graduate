import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { api } from '../utils/api';
import { Denomination } from '../../shared/class/denomination';


@Injectable()
export class DenominationService {

	constructor(private http: Http) {

	}

	/*
		GET: Get All Denomination From Server
		@author: TrangLe
	 */
	getAllDenomination(): Observable<Denomination[]> {
		let urlDeno = `${api.denomination}`;
		return this.http.get(urlDeno).map((res: Response) => res.json());
	}

	/*
		GET: Get Denomination By Id
		@author: Trangle
	 */
	getDenominationById(id:number): Observable<Denomination> {
		let url = `${api.denomination}${id}/`;
		return this.http.get(url).map((res: Response) => res.json());
	}
	/*
		POST: Create a new denomination
		Author: TrangLe
	*/
	createDenomination(deno: any): Observable<Denomination> {
		let urlDeno = `${api.denomination}`;
		return this.http.post(urlDeno, deno).map((res: Response) => res.json());
	}

	/*
		PUT: Update Denomination Detail
		@author: Trangle
	 */
	updateDenomination(denomi, id:number): Observable<Denomination> {
		let url = `${api.denomination}${id}/`;
		return this.http.put(url, denomi).map((res: Response) => res.json());
	}

	/*
		DELETE: Delete Denomination Detail
		@author: Trangle
	 */
	
	deleteDenominationByid(id:number): Observable<Denomination> {
		let url = `${api.denomination}${id}/`;
		return this.http.delete(url).map((res: Response) => res.json());
	}

	/*
		DELETE: Delete All Denomination Which Checked box
	 */
	deleteAllDenosSelected(deno_id): Observable<any> {
		const url = `${api.denomination}`;
		let param = {
			deno_id: deno_id
		}
		let _options = new RequestOptions({
			body: JSON.stringify(param)
		});

		return this.http.delete(url, _options).map((res: Response) => res.json());
	}
}
