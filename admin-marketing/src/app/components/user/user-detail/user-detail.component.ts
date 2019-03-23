import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import * as config_auth from './../../../shared/auth/reset-auth-data';
import { User } from '../../../shared/class/user';
import { UserService } from '../../../shared/services/user.service';
import { UserValidators } from './../../../shared/validators/user-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { NumberValidators } from './../../../shared/validators/number-validators';
import { VariableGlobals } from './../../../shared/commons/variable_globals';
import { HandleError } from '../../../shared/commons/handle_error';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as CONSTANT from '../../../shared/commons/constant';

import { env } from '../../../../environments/environment';

// Using bootbox 
declare var bootbox: any;

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.css'],
    providers: [UserService]
})
export class UserDetailComponent implements OnInit, AfterViewChecked {

    user; user_current: User;
    formUser: FormGroup; // formUser is type of FormGroup
    user_form = new User();
    readonly_value = true;

    errorMessage: string = '';
    errors: string = '';
    api_domain: string = "";
    msg_clear_image: string = '';
    textValue: string = '';
    token: string = '';
    is_disable: boolean = false;

    SYSTEM_ADMIN: number;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private userService: UserService,
        private router: Router,
        private datePipe: DatePipe,
        private toastr: ToastrService,
        private variable_globals: VariableGlobals,
        private handleError:HandleError
    ) {
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                const id = +this.route.snapshot.paramMap.get('id');
                this.getUserById();
            }
        );
        this.SYSTEM_ADMIN =  CONSTANT.SYSTEM_ADMIN;
        this.user_current = this.variable_globals.user_current;

    }
    ngAfterViewChecked(){
        if(this.checkDisable()){
            // disabled input wwith class textDisable
            $('.textDisable').prop('disabled', true);
        }
    }

	/*
         Create Form to edit User
         @author: Trangle   
     */
    createFormUser() {
        this.formUser = this.fb.group({
            email: [this.user.email, [Validators.required, UserValidators.emailValidators]],
            full_name: [this.user.full_name, [Validators.required]],
            birth_date: [this.user.birth_date ? moment(this.user.birth_date, "DD/MM/YYYY").toDate() : '', [UserValidators.birtdateValidators, UserValidators.formatBirtday]],
            phone: [this.user.phone, [Validators.required, NumberValidators.validPhone]],
            personal_id: [this.user.personal_id, [NumberValidators.validPersonID]],
            country: [this.user.country],
            address: [this.user.address],
            city: [this.user.city],
            avatar: [this.user.avatar],
            new_password: ['', [UserValidators.passwordValidators, Validators.maxLength(32)]],
            role: [this.user.role ? this.user.role['id'] : ''],
            is_active: [this.user.is_active],
            is_staff: [this.user.is_staff],
            is_clear_image: [false],
            flag_notification: [this.user.flag_notification],
        })
    }

    /*
        GET: Get User By Id
        Call getUserById user.service
        Sucess: Reurnt objects user, create Form to edit
        Fail: nagivate component error and show error message
        @author: Trangle
     */
    getUserById() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.userService.getUserById(id)
            .subscribe(
                (data) => {
                    this.user = data;
                    this.createFormUser();
                    this.checkDisableInput();
                },
                (error) => {
                    this.handleError.handle_error(error);
                }
            );
    }

    /*
        Update User
        updateValueAndValidity for filed birtday
        Check formUser invalid true => call ValidateSubmit to show error
        formUser is valid:
            + get value birth_date when enter input
            + convert formGroup to Form Data
            + Success: nagivate user-list and show success meaage
            + Fail: return error
        @author: Trangle
     */
    onSubmit() {
        this.formUser.controls['birth_date'].setValidators([
            UserValidators.birtdateValidators, UserValidators.formatBirtday]);
        this.formUser.controls['birth_date'].updateValueAndValidity();
        if (this.formUser.invalid) {
            ValidateSubmit.validateAllFormFields(this.formUser);
        } else {
            // Check is_clear_image
            if (this.formUser.value.is_clear_image === true && typeof (this.formUser.value.avatar) != 'string') {
                // Set value is_clear_image
                this.formUser.get('is_clear_image').setValue(false);
                // Show msg_clear_image when chose both is_clear_image and chose file
                this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
            } else {
                var self = this;
                this.formUser.value.birth_date = $('#birth_date').val();
                let userFormGroup = this.convertFormGroupToFormData(this.formUser);
                this.userService.updateUser(userFormGroup, this.user.id).subscribe(
                    (data) => {
                        self.toastr.success(`Chỉnh sửa "${this.formUser.value.email}" thành công`);
                        /*
                            Check user_current login change email and password
                            True: 
                                + localStorage remove auth_token and current_user
                                + Set user_current = null and nagivate login
                            False: Nagivate to user_list 
                         */
                        if(this.user_current.email == this.user.email){
                            if (data.new_password !== '' || this.user_current.email !== data.email){
                                config_auth.resetAuthData();
                                this.variable_globals.user_current = null;
                                self.router.navigate(['/login']);
                            } else {
                                // Navigate to promotion page where success
                                this.variable_globals.user_current = data;
                                // Update localStorage
                                let data_user = {id: data.id, full_name: data.full_name, email: data.email, role: data.role };
                                localStorage.setItem('current_user', JSON.stringify(data_user));
                                self.router.navigate(['/user-list']);
                            }
                        } else {
                            // Navigate to promotion page where success
                            self.router.navigate(['/user-list']);
                        }
                    },
                    (error) => {
                        if (error.status == 400) {
                            let error_txt = JSON.parse(error.response);
                            if (error_txt.message.non_field_errors) {
                                self.toastr.error(`${error_txt.message.non_field_errors}`);
                            } else {
                                this.errorMessage = error_txt.message
                            }
                        } else {
                            self.handleError.handle_error(error);
                        }
                    }
                );
            }
        }
    }

    /*
        DELETE: Delete User By Id
        Call deleteUserById from user.service
        Success: nagivate user-list and show success message
        Fail: Return error
        @author: Trangle
    */
    deleteUserById(user: User) {
        this.userService.deleteUserById(user)
            .subscribe(
                () => {
                    this.toastr.success(`Xóa "${user.email}" thành công`);
                    this.router.navigate(['/user-list']);
                },
                (error) => {
                    this.handleError.handle_error(error);
                }
            );
    }

    /* 
        upload image 
        FileReader: reading file contents
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
        Show password 
        if type = 'password' is hide
        else type= "text" is show
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

    // Change attribute readonly password
    ChangeReadonly(event) {
        if (event.target.checked) {
            this.readonly_value = false;
        } else {
            this.readonly_value = true;
        }
    }

    /* 
        Confirm delete feedback detail
        Using: bootbox plugin
        @author: Trangle
    */
    confirmDeleteFeedback(user: User) {
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa User này?",
            buttons: {
                cancel: {
                    label: "HỦY"
                },
                confirm: {
                    label: "XÓA"
                }
            },
            callback: (result) => {
                if (result) {
                    // Check result = true. call function callback
                    this.deleteUserById(user)
                }
            }
        });
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
        Remove message error when click input tags
        @author: Trangle
     */
    removeErrorMessage() {
        this.errorMessage = '';
    }

    /*
        Disable birth_date with owlDateTime
        @author:
     */
    checkDisableInput() {
        if(this.user.is_staff == 1 && this.user_current.role !== this.SYSTEM_ADMIN) {
            this.is_disable = true;
        }else {
            this.is_disable = false;
        }   
    }

    /*
        validOnlyNumber for phone and personal_id
        @author: Trangle
     */
    validOnlyNumber(value, field) {
        this.formUser.get(field).setValue(value.replace(/[^0-9]/g, ''));
    }

    /*
        Check disable birt_date
        @author: Trangle
     */
    checkDisable(){
        /*
            Check if exist user_current, user, user.id
            check user.is_staff and user_current.role: true ? false
        */
        if(this.user_current && this.user && this.user.id){
            if(this.user.is_staff == 1 && this.user_current.role !== this.SYSTEM_ADMIN){
                return true;
            }
        }
        return false;
    }
}
