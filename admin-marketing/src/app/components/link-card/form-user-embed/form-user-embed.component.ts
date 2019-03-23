import { Component, OnInit, Input, EventEmitter, Output, AfterViewChecked } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../../../shared/class/customer';
import { LinkCardService } from '../../../shared/services/link-card.service';
import { DateValidators } from './../../../shared/validators/date-validators';
import { NumberValidators } from './../../../shared/validators/number-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/observable/throw';
import * as moment from 'moment';
import { HandleError } from '../../../shared/commons/handle_error';

@Component({
  selector: 'form-user-embed',
  templateUrl: './form-user-embed.component.html',
  styleUrls: ['./form-user-embed.component.css'],
  providers: [LinkCardService]
})
export class FormUserEmbedComponent implements OnInit, AfterViewChecked {

    /*
        Author: Lam
    */

    // receive value from parrent add-link-card component
    @Input() status_error;
    // Return 1 object to parent
    @Output() is_btn_linkcard_embed: EventEmitter<any> = new EventEmitter<any>();
    @Output() is_submit: EventEmitter<any> = new EventEmitter<any>();

    embedForm: FormGroup;

    user_embed = new Customer();

    // Enable/Disable input field when change input checkbox
    dis_input_embed = {barcode: true, full_name: true, email: true, phone: true, 
                        birth_date: true, personal_id: true, address: true};

    msg_success = ''; // Message show error
    msg_error: any;
    is_disable_checkbox: boolean = true;
    is_disabled_btn_embed: boolean = true;

    errorMessage = '';

    constructor(
        private fb: FormBuilder, 
        private linkCardService: LinkCardService,
        private router: Router,
        private toastr: ToastrService,
        private handleError:HandleError
    ) { }

    ngOnInit() {
        this.userEmbedForm();
        this.isDisableBirthday();
    }

    ngAfterViewChecked(){
        this.isDisableBirthday();
    }

    /*
        Function userAppForm(): create form
        Author: Lam
    */
    userEmbedForm(){
        this.embedForm = this.fb.group({
            barcode: [this.user_embed.barcode, [Validators.required]],
            full_name: [this.user_embed.full_name, [Validators.required]],
            email: [this.user_embed.email, [Validators.required, Validators.email]],
            phone: [this.user_embed.phone, 
                [Validators.required, NumberValidators.validPhone]],
            birth_date: [this.user_embed.birth_date ? moment(this.user_embed.birth_date,"DD/MM/YYYY").toDate() : '', 
                [DateValidators.requiredBirthDayEmbed, DateValidators.validBirthDayLessCurrentDayEmbed, 
                DateValidators.validBirthDayEmbed, DateValidators.formatBirthDayEmbed]],
            personal_id: [this.user_embed.personal_id, 
                [Validators.required, NumberValidators.validPersonID]],
            address: [this.user_embed.address, Validators.required],
        });
    }

    /*
        Function searchBarcode(): call service function getBarcode() to get user embed by barcode
        Author: Lam
    */
    searchBarcode(value){
        let barcode = parseInt(value);
        this.linkCardService.getBarcode(barcode).subscribe(
            (data) => {
                // case cards_state is a number
                if(typeof(data.cards_state) === 'number'){
                    this.user_embed = data;
                    this.embedForm.setValue({
                        barcode: this.user_embed.barcode,
                        full_name: this.user_embed.full_name,
                        email: this.user_embed.email,
                        phone: this.user_embed.phone,
                        birth_date: this.user_embed.birth_date ? moment(this.user_embed.birth_date,"DD/MM/YYYY").toDate() : '',
                        personal_id: this.user_embed.personal_id,
                        address: this.user_embed.address
                    });
                }
                // case cards_state = 0, id card exist
                if(data.cards_state === 0){
                    if(data.is_related === true){
                        this.errorMessage = 'Mã thẻ này đã liên kết.';
                        this.disabledEmbed(true);
                    }else{
                        this.errorMessage = '';
                        this.disabledEmbed(false);
                    }
                }else if(data.cards_state === 1){ // case cards_state = 1, id card lock
                    this.errorMessage = 'Mã thẻ này đã bị khóa. Vui lòng liên kết với mã thẻ khác.';
                }else if(data.cards_state === 2){ // case cards_state = 1, id card replaced
                    this.errorMessage = 'Mã thẻ này đã bị thay thế. Vui lòng liên kết với mã thẻ khác.';
                }else{ // case cards_state = 1, id card invalid
                    this.errorMessage = 'Mã thẻ này không hợp lệ.';
                    this.embedForm.reset();
                }
                // disabled checkbox, button when id card lock, replaced, invalid
                if(data.cards_state !== 0){
                    this.disabledEmbed(true);
                }
                this.msg_error = null;
                // emit to parent set object status error 
                this.is_submit.emit(true);
            },
            (error) => { 
                if(error.status != 400 ){
                    this.handleError.handle_error(error);
                }
                this.msg_error = null;
                this.errorMessage = error.json().message; 
                this.disabledEmbed(true);
                // emit to parent set object status error 
                this.is_submit.emit(true);
                this.embedForm.reset();
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
            this.is_disabled_btn_embed = true;
            // input checkbox in form unchekced
            $('.form-user-embed input:checkbox').prop('checked', false);
            // disable fields in form
            this.dis_input_embed = {barcode: true, full_name: true, email: true, phone: true, 
                        birth_date: true, personal_id: true, address: true};

            // emit to parent, disable/undisable button link card
            this.is_btn_linkcard_embed.emit(this.is_disabled_btn_embed);
        }else{
            this.is_disable_checkbox = false;
            this.is_disabled_btn_embed = false;
            // emit to parent, disable/undisable button link card
            this.is_btn_linkcard_embed.emit(this.is_disabled_btn_embed);
        }
    }

    isDisableBirthday(){
        if(this.dis_input_embed.birth_date){
            $('#birth_date_embed').prop('disabled', true);
        }else{
            $('#birth_date_embed').prop('disabled', false);
        }
    }

    /*
        Function stripText(): numbers only
        Author: Lam
    */
    stripText(value, field) {
        this.embedForm.get(field).setValue(value.replace(/[^0-9]/g, ''));
    }

    /*
        Function stripEmail(): remove space
        Author: Lam
    */
    stripEmail(value){
        this.embedForm.get('email').setValue(value.replace(/ /g,""));
    }

    /*
        Function stripText(): numbers only
        Author: Lam
    */
    stripBarcode(search_barcode) {
        $('#get_barcode').val(search_barcode.replace(/[^0-9]/g, ''));
    }

    /*
        Function onSubmitEmbed(): call service function updateUserEmbed() to update user embed
        Author: Lam
    */
    onSubmitEmbed(){
        // case form invalid, show error fields, scroll top
        if(this.embedForm.invalid){
            ValidateSubmit.validateAllFormFields(this.embedForm);
        }else{
            this.embedForm.value.birth_date = $('#birth_date_embed').val();
            this.linkCardService.updateUserEmbed(this.embedForm.value).subscribe(
                (data) => {
                    this.searchBarcode(this.embedForm.value.barcode);
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
