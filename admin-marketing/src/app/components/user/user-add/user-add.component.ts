import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";

import { User } from '../../../shared/class/user';
import { Role } from '../../../shared/class/role';

import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../../shared/services/user.service';
import { RoleService } from '../../../shared/services/role.service';
import { UserValidators } from './../../../shared/validators/user-validators';
import { NumberValidators } from './../../../shared/validators/number-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { HandleError } from '../../../shared/commons/handle_error';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
    selector: 'app-user-add',
    templateUrl: './user-add.component.html',
    styleUrls: ['./user-add.component.css'],
    providers: [RoleService, UserService]
})
export class UserAddComponent implements OnInit {

    formUser: FormGroup; //formUser is type of FormGroup
    user_form = new User();

    users: User[] = [];
    roles: Role[];

    errorMessage: string = '';

    isSelected = true; // Set value default selcted 

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private roleService: RoleService,
        private router: Router,
        private datePipe: DatePipe,
        private toastr: ToastrService,
        private handleError:HandleError
    ) {
    }

    ngOnInit() {
        this.getAllRoles();
        this.createForm();
    }

    /*
        Create Form User
        @author: Trangle
     */
    createForm() {
        this.formUser = this.fb.group({
            email: [this.user_form.email, [Validators.required, UserValidators.emailValidators]],
            full_name: [this.user_form.full_name, [Validators.required]],
            phone: [this.user_form.phone, [Validators.required, NumberValidators.validPhone]],
            personal_id: [this.user_form.personal_id, [NumberValidators.validPersonID]],
            country: [this.user_form.country],
            address: [this.user_form.address],
            city: [this.user_form.city],
            avatar: [this.user_form.avatar],
            password: [this.user_form.password, [Validators.required, UserValidators.passwordValidators, Validators.maxLength(32)]],
            is_active: [this.user_form.is_active],
            is_staff: [this.user_form.is_staff],
            role: [this.user_form.role, [UserValidators.validateSelectRole]],
            birth_date: [this.user_form.birth_date ? moment(this.user_form.birth_date, "DD/MM/YYYY").toDate() : '', [UserValidators.birtdateValidators, UserValidators.formatBirtday]],
            flag_notification: [this.user_form.flag_notification],
        });
    }

    /*
        GET: get all role
        Call getAllRoles from role.service
        sucess: Return objects roles
        fail: nagivate component error show error message
        @author: Trangle
     */
    getAllRoles() {
        this.roleService.getAllRoles().subscribe(
            (result) => {
                this.roles = result
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        )
    }

    /*
        POST: Create User
        Check formUser invalid is True => Call ValidateSubmit show error
        formUser is valid :
            + convert formGroup to Form Data
            + Get value birth_date
            + Call createUser from user.service
        Success: Push data, nagivate component user_list and show success message
        Fail: Return error
        @author: Trangle
     */
    onSubmit() {
        // set and update valdiator, so error validate ng-datetime "owlDateTimeParse"
        this.formUser.controls['birth_date'].setValidators([
            UserValidators.birtdateValidators, UserValidators.formatBirtday]);
        this.formUser.controls['birth_date'].updateValueAndValidity();
        if (this.formUser.invalid) {
            ValidateSubmit.validateAllFormFields(this.formUser);
        } else {
            var self = this;
            this.formUser.value.birth_date = $('#birth_date').val();
            let userFormGroup = this.convertFormGroupToFormData(this.formUser);
            this.userService.createUser(userFormGroup).subscribe(
                (data) => {
                    self.users.push(data);
                    this.toastr.success(`Thêm "${this.formUser.value['email']}" thành công`);
                    self.router.navigate(['/user-list']);
                },
                (error) => {
                    if (error.status == 400) {
                        // Show message in form
                        self.errorMessage = JSON.parse(error.response).message;
                    } else {
                        // Nagivate component error and show error message
                        this.handleError.handle_error(error);
                    }
                }
            )
        }
    }

    /* 
        upload image 
        FileReader: reading file contents
        @author: Trangle
    */
    onFileChange(event) {
        let reader = new FileReader();
        let input_id = $(event.target).attr('id');
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formUser.get(input_id).setValue({ filename: file.name, filetype: file.type, value: file });
        }
    }
    /*
       Show and hide password
        if type='passwod' is hide
        else type='text' is show
        @author: Trangle
    */
    showPassword(input: any): any {
        if (input.type = input.type === "password") {
            input.type = "text";
            $('span#toggleShowHide').addClass('fa fa-eye').removeClass('fa-eye-slash');
        } else {
            input.type = "password";
            $('span#toggleShowHide').addClass('fa-eye-slash').removeClass('fa-eye');
        }
    }
    /*
        Convert form group to form data to submit form
        @author: trangle
    */
    private convertFormGroupToFormData(userForm: FormGroup) {
        // Convert FormGroup to FormData
        let userValues = userForm.value;
        let userFormData: FormData = new FormData();
        if (userValues) {
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(userValues).forEach(k => {
                if (userValues[k] == null) {
                    userFormData.append(k, '');
                } else if (k === 'avatar') {
                    // if image has value, form data append image
                    if (userValues[k].value){
                        userFormData.append(k, userValues[k].value);
                    }
                } else {
                    userFormData.append(k, userValues[k]);
                }
            });
        }
        return userFormData;
    }
    /*
        remove error message when clik input tag
        @author: Trangle 
     */
    removeErrorMessage() {
        this.errorMessage = '';
    }

    /*
        validOnlyNumber for phone and personal_id
        @author: Trangle
     */
    validOnlyNumber(value, field) {
        this.formUser.get(field).setValue(value.replace(/[^0-9]/g, ''));
    }

}
