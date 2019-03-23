import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';
import { Router } from '@angular/router';
import { VariableGlobals } from '../../shared/commons/variable_globals';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Injectable()
export class AuthHttp extends Http {

    constructor(
        private backend: XHRBackend,
        private defaultOptions: RequestOptions,
        private router: Router,
        public variable_globals: VariableGlobals,
        private spinnerService: Ng4LoadingSpinnerService,
    ) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        this.showLoader();
        return super.request(url, options).finally(() => {
            this.hideLoader();
        });
    }

    private showLoader(): void {
        this.spinnerService.show();
    }

    private hideLoader(): void {
        this.spinnerService.hide();
    }
}