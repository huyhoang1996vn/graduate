import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../../shared/services/auth.service';
import { User } from './../../shared/class/user';
import { env } from './../../../environments/environment';
import 'rxjs/add/observable/throw';
import { VariableGlobals } from './../../shared/commons/variable_globals';
import { UserService } from './../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ValidateSubmit } from './../../shared/validators/validate-submit';
import { HandleError } from '../../shared/commons/handle_error';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [AuthService]
})
export class LoginComponent implements OnInit {

    formLogin: FormGroup;
    user: User = new User();

    msg_error: string = '';
    key_recaptcha: string = '';

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        public variable_globals: VariableGlobals,
        private userService: UserService,
        private toastr: ToastrService,
        private handleError:HandleError
    ) { 
        this.key_recaptcha = env.key_recaptcha 
    }

    ngOnInit() {
        if(this.variable_globals.user_current){
            this.router.navigateByUrl('/');
        }

        this.creatForm();
    }

    /*
        Function: getUserByToken(): call service function getUserByToken() get user by token
        Author: Lam
    */
    getUserByToken(value){
        this.userService.getUserByToken(value).subscribe(
            (data) => {
                if(data.is_staff === false){
                    this.toastr.error("Tài khoản của bạn không có quyền đăng nhập vào Site Quản Trị Hệ Thống.");
                    this.router.navigate(['/login']);
                }else{
                    this.variable_globals.user_current = data;
                    let data_user = {id: data.id, full_name: data.full_name, email: data.email, role: data.role };
                    localStorage.setItem('current_user', JSON.stringify(data_user));
                }
            },
            (error) => {
                this.handleError.handle_error(error);;
            }
        );
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formLogin = this.fb.group({
            email: [this.user.email, Validators.required],
            password: [this.user.password, Validators.required],
            captcha: ['', Validators.required]
        });
    }

    /*
        Function setMessageError(): set message error when key down emai or password
        Author: Lam
    */
    setMessageError(){
        this.msg_error = '';
    }    

    /*
        function onSubmit(): Call service function auth
        author: Lam
    */ 
    onSubmit(){
        if(this.formLogin.invalid){
            ValidateSubmit.validateAllFormFields(this.formLogin);
        }else{
            this.authService.auth(this.formLogin.value).subscribe(
                (data) => {
                    localStorage.setItem('auth_token', data.token);
                    if(data.token){
                        this.getUserByToken(data.token);
                    }
                    this.router.navigateByUrl('/');
                },
                (error) => {
                    this.msg_error = error.json().non_field_errors[0] ? error.json().non_field_errors[0] : "Lỗi";
                }
            );
        }
    }

}
