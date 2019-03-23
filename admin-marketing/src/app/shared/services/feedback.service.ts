import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import { Feedback } from '../../shared/class/feedback';
import { api } from '../utils/api';

@Injectable()
export class FeedbackService {

	private url_summary = api.summary;

	constructor(private http: Http) {
	}
	/*
		GET: Get Feedback By ID From Server
		@author: Trangle
	 */
	getFeedbackById(id: number): Observable<Feedback> {
		const url = `${api.feedback}${id}/`;
		return this.http.get(url).map((res: Response) => res.json());
	}

	/*
		GET: Get Feedback By Filter
		Filter: Status, Rate, Start_date, End_date
		Link url: url?status=value&&rate=value&&start_date=value&&end_date=value
		@author: Trangle
	 */
	getFeedbackFilter(filter: { status?: string, rate?: string, start_date?: string, end_date?: string }): Observable<any> {
		const url = `${api.feedback}`;

		let _options = new RequestOptions({
			params: filter
		});

		return this.http.get(url, _options).map((res: Response) => res.json());
	}
	/*
		PUT: Edit Feedback By ID
	 */
	updateFeedbackById(feedback, id: number): Observable<any> {
		const url = `${api.feedback}${id}/`;
		var body = JSON.stringify(feedback);
		return this.http.put(url,body).map((res: Response) => res.json());
	}
	/*
		DELETE: Delete Feedback By ID
		@author: Trangle
	*/
	deleteFeedbackById(feedback: Feedback): Observable<Feedback> {
		const id = feedback.id;
		const url = `${api.feedback}${id}/`;
		return this.http.delete(url).map((res: Response) => res.json());
	}
	/*
		DELETE: Delete All Feedback chosen
		@author: Trangle
	 */
	deleteAllFeedbackChecked(fed_id): Observable<any> {
		let param = {
			fed_id: fed_id
		}
		let _options = new RequestOptions({
			body: JSON.stringify(param)
		});
		return this.http.delete(api.feedback, _options)
			.map((res: Response) => res.json());
	}

    /* 
        function getStatisticFeedback(): get summary feedback status handle and rating
        author: Lam
    */
	getStatisticFeedback(): Observable<any> {
		return this.http.get(this.url_summary).map((res: Response) => res.json());
	}

    /* 
        function getStatisticFeedback(): get summary feedback status handle and rating by search_field, date start, end
        author: Lam
    */
	searchStatisticFeedback(name, start, end): Observable<any> {
		let url_search = `${this.url_summary}?search_field=${name}&start_date=${start}&end_date=${end}`;
		return this.http.get(url_search).map((res: Response) => res.json());
	}
}
