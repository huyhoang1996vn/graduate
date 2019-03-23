import { Component, OnInit, Input, EventEmitter, Output, AfterViewChecked } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../shared/class/user';
import { LinkCardService } from '../../../shared/services/link-card.service';
import { DateValidators } from './../../../shared/validators/date-validators';
import { NumberValidators } from './../../../shared/validators/number-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/observable/throw';
import * as moment from 'moment';
import { HandleError } from '../../../shared/commons/handle_error';

@Component({
  selector: 'form-user-app',
  templateUrl: './form-user-app.component.html',
  styleUrls: ['./form-user-app.component.css'],
  providers: [LinkCardService]
})
export class FormUserAppComponent implements OnInit, AfterViewChecked {

    /*
        Author: Lam
    */

    // receive value from parrent add-link-card component
    @Input() status_error;
    // Return 1 object to parent
    @Output() is_btn_linkcard_app: EventEmitter<any> = new EventEmitter<any>();
    @Output() is_submit: EventEmitter<any> = new EventEmitter<any>();

    appForm: FormGroup;

    user_app = new User();

    // Enable/Disable input field when change input checkbox
    dis_input_app = {full_name: true, email: true, phone: true, birth_date: true, personal_id: true, address: true};

    msg_error: any;
    is_disable_checkbox: boolean = true;
    is_disabled_btn_app: boolean = true;

    errorMessage = '';

    constructor(
        private fb: FormBuilder, 
        private linkCardService: LinkCardService,
        private router: Router,
        private toastr: ToastrService,
        private handleError:HandleError
    ) { }

    ngOnInit() {;
        this.userAppForm();
        this.isDisableBirthday();
    }

    ngAfterViewChecked(){
        this.isDisableBirthday();
    }

    /*
        Function userAppForm(): create form
        Author: Lam
    */
    userAppForm(){
        this.appForm = this.fb.group({
            full_name: [this.user_app.full_name, [Validators.required]],
            email: [this.user_app.email, [Validators.required, Validators.email]],
            phone: [this.user_app.phone, 
                [Validators.required, NumberValidators.validPhone]],
            birth_date: [this.user_app.birth_date ? moment(this.user_app.birth_date,"DD/MM/YYYY").toDate() : '', 
                [DateValidators.requiredBirthDayApp, DateValidators.validBirthDayLessCurrentDayApp, 
                DateValidators.validBirthDayApp, DateValidators.formatBirthDayApp]],
            personal_id: [this.user_app.personal_id, 
                [Validators.required, NumberValidators.validPersonID]],
            address: [this.user_app.address, Validators.required],
        });
    }


    /*
        Function searchEmail(): call service function getEmail() to get user app by email
        Author: Lam
    */
    searchEmail(value){
        // reqired email
        if(!value){
            this.errorMessage = 'Bạn chưa nhập email';
            return;
        }else if(this.validateEmail(value)){ // fomat emmail
            this.errorMessage = 'Email không đúng định dạng';
            return;
        }
        this.linkCardService.getEmail(value).subscribe(
            (data) => {
                this.user_app = data;
                this.msg_error = null;
                this.appForm.setValue({
                    full_name: this.user_app.full_name,
                    email: this.user_app.email,
                    phone: this.user_app.phone,
                    birth_date: this.user_app.birth_date ? moment(this.user_app.birth_date,"DD/MM/YYYY").toDate() : '',
                    personal_id: this.user_app.personal_id,
                    address: this.user_app.address
                });
                // case account exist barcode
                if(data.barcode){
                    this.errorMessage = 'Tài khoản app đã liên kết.';
                    this.disabledEmbed(true);
                    this.is_submit.emit(true);
                }else{ // case account not linked
                    this.errorMessage = '';
                    this.disabledEmbed(false);
                    // emit to parent set object status error
                    this.is_submit.emit(true);
                }
            },
            (error) => { 
                if(error.status != 400 ){
                    this.handleError.handle_error(error);
                }
                this.errorMessage = error.json().message; 
                this.msg_error = null;
                this.disabledEmbed(true);
                // emit to parent set object status error
                this.is_submit.emit(true);
                this.appForm.reset();
            } 
        );
    }

    /*
        Function disabledEmbed(): disabled checkbox, button, emit to parent
        Author: Lam
    */
    disabledEmbed(event){
        if(event === true){
            this.is_disable_checkbox = true;
            this.is_disabled_btn_app = true;
            // input checkbox in form unchekced
            $('.form-user-app input:checkbox').prop('checked', false);
            // disable fields in form
            this.dis_input_app = {full_name: true, email: true, phone: true, birth_date: true, personal_id: true, address: true};
            // emit to parent, disable/undisable button link card
            this.is_btn_linkcard_app.emit(this.is_disabled_btn_app);
        }else{
            this.is_disable_checkbox = false;
            this.is_disabled_btn_app = false;
            // emit to parent, disable/undisable button link card
            this.is_btn_linkcard_app.emit(this.is_disabled_btn_app);
        }
    }

    /*
        Function stripText(): numbers only
        Author: Lam
    */
    stripText(value, field) {
        this.appForm.get(field).setValue(value.replace(/[^0-9]/g, ''));
    }

    /*
        Function stripEmail(): remove space
        Author: Lam
    */
    stripEmail(value){
        this.appForm.get('email').setValue(value.replace(/ /g,""));
    }

    /*
        Function validateEmail(): validate email format is email 
        Author: Lam
    */
    validateEmail(email): boolean{
        let regex = /^[A-Za-z0-9_.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        let is_check = regex.test(email);
        if (!is_check) {
            return true;
        }
        return false;
    }

    isDisableBirthday(){
        if(this.dis_input_app.birth_date){
            $('#birth_date_app').prop('disabled', true);
        }else{
            $('#birth_date_app').prop('disabled', false);
        }
    }

    /*
        Function onSubmitApp(): call service function updateUserApp() to update user app
        Author: Lam
    */
    onSubmitApp(){
        // case form invalid, show error fields, scroll top
        if(this.appForm.invalid){
            ValidateSubmit.validateAllFormFields(this.appForm);
        }else{
            let id = this.user_app.id;
            this.appForm.value.birth_date = $('#birth_date_app').val();
            this.linkCardService.updateUserApp(this.appForm.value, id).subscribe(
                (data) => {
                    this.searchEmail(this.appForm.value.email);
                    this.toastr.success(`${data.message}`);
                    this.msg_error = null;
                    // emit to parent set object status error
                    this.is_submit.emit(true);
                },
                (error) => {
                    // code 400, error validate
                    if(error.status === 400){
                        this.msg_error = error.json().message;
                        // emit to parent set object status error
                        this.is_submit.emit(true);
                    }else{
                        this.handleError.handle_error(error);;
                    }
                }
            );
        }
    }

}
