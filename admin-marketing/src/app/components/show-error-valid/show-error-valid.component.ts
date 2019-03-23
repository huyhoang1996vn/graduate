import { Component, OnInit, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
    selector: 'show-error-valid',
    templateUrl: './show-error-valid.component.html',
    styleUrls: ['./show-error-valid.component.css']
})
export class ShowErrorValidComponent implements OnInit {

    /*
        Purpose: show message error in form
        Author: Lam
    */

    // Type and message validate
    private static readonly errorMessages = {
       'email': () => 'Email không đúng định dạng',
       'required': () => 'Trường này không được bỏ trống',
       'minlength': (params) => 'Số ký tự tối thiểu là ' + params.requiredLength,
       'maxlength': (params) => 'Số ký tự cho phép tối đa là ' + params.requiredLength,
       'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
       'years': (params) => params.message,
       'countryCity': (params) => params.message,
       'uniqueName': (params) => params.message,
       'telephoneNumbers': (params) => params.message,
       'telephoneNumber': (params) => params.message,
       'owlDateTimeParse': (params) => '',
       'fomatDate': (param) => param.message,
       'fomatTime': (param) => param.message,
       'required_date': (param) => param.message,
       'required_time': (param) => param.message,
       'passwordValidate': (param) => param.message,
       'phoneValidate': (param) => param.message,
       'denominationValidate': (param) => param.message,
       'emailValidate': (param) => param.message,
       'birtdateValidate': (params) => params.message,
       'invalidDate':(params) => params.message,
       'fomatFile': (params) => params.message,
       'requiredSelectedRole': (params) => params.message,
       'feeValidate': (params) => params.message,
    };

    @Input()
    private control: AbstractControlDirective | AbstractControl;

    constructor() { }

    ngOnInit() {
    }

    /*
        Function shouldShowErrors(): check have error, user dirty or touched
        Author: Lam
    */
    shouldShowErrors(): boolean {
        return this.control && this.control.errors &&
            (this.control.dirty || this.control.touched);
    }

    /*
        Function shouldShowErrors(): show list errors
        Author: Lam
    */
    listOfErrors(): string[] {
        return Object.keys(this.control.errors)
            .map(field => this.getMessage(field, this.control.errors[field]));
    }

    /*
        Function getMessage(): callback function errorMessages() get error
        Author: Lam
    */
    private getMessage(type: string, params: any) {
        return ShowErrorValidComponent.errorMessages[type](params);
    }

}
