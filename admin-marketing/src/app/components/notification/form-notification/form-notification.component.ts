import { Component, OnInit, EventEmitter, Input, Output, ViewChild, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Notification } from '../../../shared/class/notification';
import { CategoryNotification } from '../../../shared/class/category-notification';
import { NotificationService } from '../../../shared/services/notification.service';
import { CategoryNotificationService } from '../../../shared/services/category-notification.service';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ImageValidators } from './../../../shared/validators/image-validators';
import { ToastrService } from 'ngx-toastr';
import { VariableGlobals } from './../../../shared/commons/variable_globals';
import { User } from '../../../shared/class/user';
import 'rxjs/add/observable/throw';
import { env } from '../../../../environments/environment';
import { ScrollTop } from './../../../shared/commons/scroll-top';
import * as CONSTANT from './../../../shared/commons/constant';
import { HandleError } from '../../../shared/commons/handle_error';

declare var $ :any; // declare Jquery
declare var bootbox:any;

@Component({
    selector: 'form-notification',
    templateUrl: './form-notification.component.html',
    styleUrls: ['./form-notification.component.css'],
    providers: [
        NotificationService,
        CategoryNotificationService
    ]
})
export class FormNotificationComponent implements OnInit, AfterViewChecked {

    /*
        author: Lam
    */

    // set inputImage property as a local variable, #inputImage on the tag input file
    @ViewChild('inputImage')
    inputImage: any;

    @Input() position; // Get type http from component parent
    
    // Return 1 object to parent
    @Output() update_noti: EventEmitter<Notification> = new EventEmitter<Notification>();

    noti: Notification;

    formNotification: FormGroup;

    categories: CategoryNotification[];
    user_current: User;

    check_QR: boolean = true; // Check enable/disable input QR
    check_Location: boolean = true; // Check enable/disable input Location

    errorMessage: any; // Messages error
    msg_clear_image = ''; // message clear image

    api_domain: string = '';
    lang = 'vi';
    // when create notification's promotion, get promotion_id from URL 
    promotion_id: number;
    title_page = '';
    SYSTEM_ADMIN: number;

    constructor(
        private notificationService: NotificationService,
        private categoryNotificationService: CategoryNotificationService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private variable_globals: VariableGlobals,
        private toastr: ToastrService,
        private scrollTop: ScrollTop,
        private handleError:HandleError
    ) { 
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        // get params url
        this.route.params.subscribe(params => {
            if(params.promotion){
                this.promotion_id = +params.promotion;
            }
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.SYSTEM_ADMIN =  CONSTANT.SYSTEM_ADMIN;
        this.getCategory();
        // get current user
        this.user_current = this.variable_globals.user_current;

        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title_page = "Chỉnh Sửa Thông Báo";
            this.getNotification();
        } else {
            // Add new Form
            this.title_page = "Thêm Thông Báo";
            this.noti = new Notification();
            this.creatForm();
        }
    }

    ngAfterViewChecked(){
        if(this.isDisable()){
            // disabled button, input, select, only view
            $('.form-notification button, .form-notification input, .form-notification select, .form-notification textarea').attr('disabled', true);
        }
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formNotification = this.fb.group({
            subject: [this.noti.subject, [Validators.required, Validators.maxLength(255)]],
            message: [this.noti.message, [Validators.required]],
            image: [this.noti.image, [ImageValidators.validateFile]],
            sub_url_web: [this.noti.sub_url_web, [Validators.maxLength(255)]],
            category: [this.noti.category ? this.noti.category : '', Validators.required],
            is_QR_code: [this.noti.is_QR_code ? this.noti.is_QR_code : false],
            location: [this.noti.location ? this.noti.location : '', [Validators.maxLength(500)]],
            is_clear_image: [false],
            // is_public: [this.noti.is_public ? true : false ],
            
            // if update, get promotion's noti, 
            // if create, get promotion_id in url or null 
            promotion: [this.noti.promotion ? this.noti.promotion : (this.promotion_id ? this.promotion_id : null)]
        });
    }

    /*
        Function getNotification():
         + Get id from url path
         + Callback service function getNotification() by id
        Author: Lam
    */
    getNotification(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.notificationService.getNotification(id, this.lang).subscribe(data => {
            this.noti = data;
            if(this.noti.category === 1){
                this.check_QR = false;
                if(this.noti.is_QR_code === true){
                    this.check_Location = false;
                }
            }
            this.creatForm();
        });
    }

    /*
        function getCategory(): get all category nitofication
        author: Lam
    */ 
    getCategory(): void{
        this.categoryNotificationService.getCategoryNotifications(this.lang).subscribe(
            (data) => {
                this.categories = data.message;
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChange(event): void{
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formNotification.get('image').setValue({
                filename: file.name,
                filetype: file.type,
                value: file,
            });
        }
    }

    /*
        Function onSubmit():
         + Step 1: Check notification id add notification (post), edit notification (put), edit use modal (popup)
         + Step 2:  
            * TH1:  + notification id empy, callback service function addNoti() to add Notification, 
                    + Later, redirect list notification with message
            * TH2:  + notification id exist put or popup, callback service function updateNoti() to update Notification
                    + position = put then check clear imgae, success then redirect list notification with message, fail show error
                    + position = popup then update Notification show and hidden modal  
        author: Lam
    */ 
    onSubmit(): void{
        // case form invalid, show error fields, scroll top
        if(this.formNotification.invalid){
            ValidateSubmit.validateAllFormFields(this.formNotification);
            if(this.position !== 'popup'){
                this.scrollTop.scrollTopFom();
            }else{
                $('#UpdateNoti').animate({ scrollTop: $('.modal-title').offset().top }, 'slow');
            }
        }else{
            // parse category id strin to int
            this.formNotification.value.category = parseInt(this.formNotification.value.category);
            // Convert FormGroup to FormData
            let noti_form_data = this.convertFormGroupToFormData(this.formNotification);
            let value_form = this.formNotification.value;
            // case create new
            if(!this.noti.id){
                this.notificationService.addNoti(noti_form_data, this.lang).subscribe(
                    (data) => {
                        this.toastr.success(`Thêm mới "${value_form.subject}" thành công`);
                        // promotion_id exist redirect notification detail
                        if(this.promotion_id){
                            this.router.navigate(['/notification/detail/', data.id, {lang: this.lang}]);
                        }else{
                            this.router.navigate(['/notification/list']);
                        }
                    },
                    (error) => {
                        // code 400, error validate
                        if(error.status === 400){
                            this.errorMessage = JSON.parse(error.response).message;
                            this.scrollTop.scrollTopFom();
                        }else{
                            this.handleError.handle_error(error);
                        }
                    }
                );
            }else if(this.noti.id){
                // check remove image when select checkbox clear image and choose image
                if(value_form.is_clear_image === true && typeof(value_form.image) != 'string'){
                    this.formNotification.get('is_clear_image').setValue(false);
                    this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                    if(this.position !== 'popup'){
                        this.scrollTop.scrollTopFom();
                    }else{
                        $('#UpdateNoti').animate({ scrollTop: $('.modal-title').offset().top }, 'slow');
                    }
                }else{
                    this.notificationService.updateNoti(noti_form_data, this.noti.id, this.lang).subscribe(
                        (data) => {
                            this.noti = data;
                            // position is popup, toggle popup, emit noti to parent
                            if(this.position === "popup"){
                                // clean input message
                                $("#input_image").val("");
                                this.update_noti.emit(this.noti);
                                $('#UpdateNoti').modal('toggle');
                                this.msg_clear_image = '';
                                this.toastr.success(`Chỉnh sửa "${value_form.subject}" thành công`);
                            }else {
                                this.toastr.success(`Chỉnh sửa "${value_form.subject}" thành công`);
                                // promotion_id exist redirect notification detail
                                if(this.promotion_id){
                                    this.router.navigate(['/notification/detail/', data.id, {lang: this.lang}]);
                                }else{
                                    this.router.navigate(['/notification/list']);
                                }
                            }
                        },
                        (error) => {
                            // code 400, error validate
                            if(error.status === 400){
                                this.errorMessage = JSON.parse(error.response).message;
                                if(this.position !== 'popup'){
                                    this.scrollTop.scrollTopFom();
                                }else{
                                    $('#UpdateNoti').animate({ scrollTop: $('.modal-title').offset().top }, 'slow');
                                }
                            }else{
                                $('#UpdateNoti').modal('toggle');
                                this.handleError.handle_error(error);
                            }
                        }
                    );
                }
            }
        }
    }

    /*
        Function deleteNotificationEvent(): confirm delete
        @author: Lam
    */
    deleteNotificationEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Thông Báo này?",
            buttons: {
                cancel: {
                    label: "HỦY"
                },
                confirm: {
                    label: "XÓA"
                }
            },
            callback: function (result) {
                if(result) {
                    that.onDelete();
                }
            }
        });
    }

    /*
        Function onDelete():
         + Get id from url path
         + Callback service function onDelNoti() by id to delete notification
        Author: Lam
    */
    onDelete(): void {
        const id = this.noti.id;
        this.notificationService.onDelNoti(id, this.lang).subscribe(
            (data) => {
                this.toastr.success(`Xóa "${this.formNotification.value.subject}" thành công`);
                this.router.navigate(['/notification/list']);
            },
            (error) => {
                 this.handleError.handle_error(error);;
            }
        );
    }

    /*
        Function isQRCode(): set value is_QR_code and enable/disable input Location
        Author: Lam
    */
    isQRCode(event): void{
        if(event == "true"){
            this.check_Location = false;
            this.formNotification.get('is_QR_code').setValue(true);
        }else{
            this.check_Location = true;
            this.formNotification.get('location').setValue(null);
            this.formNotification.get('is_QR_code').setValue(false);
        }
    }

    /*
        Function changeCategory(): Check catrgory
        Author: Lam
    */
    changeCategory(event){
        let cate_id = parseInt(event.target.value);
        // check cate_id = 1 is "Khuyen Mai"
        if(cate_id === 1){
            // undisable input QR, location
            this.check_QR = false;
            this.check_Location = false;
            this.formNotification.get('is_QR_code').setValue(true);
            // noti id exist let set locaion = location old
            if(this.noti.id){
                this.formNotification.get('location').setValue(this.noti.location);
            }else{
                // set default location 'Quầy MBS'
                this.formNotification.get('location').setValue('Quầy MBS');
            }
        }else{
            // disabled input QR, location if not "Khuyen Mai"
            this.check_QR = true;
            this.check_Location = true;
            this.formNotification.get('is_QR_code').setValue(false);
            this.formNotification.get('location').setValue(null);
        }
    }

    /*
        Function isDisable(): Check notification sent and current user is not system admin
        Author: Lam
    */
    isDisable(){
        if(this.user_current && this.noti && this.noti.id){
            if(this.noti.sent_date && this.user_current.role !== this.SYSTEM_ADMIN){
                return true;
            }
        }
        return false;
    }

    /*
        Convert form group to form data to submit form
        @author: lam
    */
    private convertFormGroupToFormData(promotionForm: FormGroup) {
        // Convert FormGroup to FormData
        let promotionValues = promotionForm.value;
        let promotionFormData:FormData = new FormData(); 
        if (promotionValues){
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(promotionValues).forEach(k => { 
                if(promotionValues[k] == null) {
                    promotionFormData.append(k, '');
                } else if (k === 'image') {
                    // if image has value, form data append image
                    if (promotionValues[k].value){
                        promotionFormData.append(k, promotionValues[k].value);
                    }
                } else {
                    promotionFormData.append(k, promotionValues[k]);
                }
            });
        }
        return promotionFormData;
    }

}
