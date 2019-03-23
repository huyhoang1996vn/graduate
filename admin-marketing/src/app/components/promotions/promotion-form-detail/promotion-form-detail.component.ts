import { Component, OnInit, EventEmitter, Input, Output, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/add/observable/throw';

import { Promotion } from '../../../shared/class/promotion';
import { Category } from '../../../shared/class/category';
import { PromotionType } from '../../../shared/class/promotion-type';
import { PromotionLabel } from '../../../shared/class/promotion-label';
import { PromotionService } from '../../../shared/services/promotion.service';
import { CategoryService } from '../../../shared/services/category.service';
import { PromotionTypeService } from '../../../shared/services/promotion-type.service';
import { PromotionLabelService } from '../../../shared/services/promotion-label.service';
import { DatePipe } from '@angular/common';
import { DateValidators } from './../../../shared/validators/date-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ImageValidators } from './../../../shared/validators/image-validators';
import { ToastrService } from 'ngx-toastr';
import { User } from './../../../shared/class/user';
import { VariableGlobals } from './../../../shared/commons/variable_globals';
import { env } from '../../../../environments/environment';
import * as ckeditor_config from './../../../shared/commons/ckeditor_config';
import * as moment from 'moment';
import { ScrollTop } from './../../../shared/commons/scroll-top';
import { HandleError } from '../../../shared/commons/handle_error';
import * as CONSTANT from './../../../shared/commons/constant';

declare var $ :any; // declare Jquery
declare var bootbox:any;

@Component({
    selector: 'app-promotion-form-detail',
    templateUrl: './promotion-form-detail.component.html',
    styleUrls: ['./promotion-form-detail.component.css'],
    providers: [
        PromotionService,
        PromotionLabelService
    ]
})

export class PromotionFormDetailComponent implements OnInit, AfterViewChecked {

    promotion: Promotion;

    @Input() position; // Get type http from component parent

    // Return 1 object to parent
    @Output() update_promotion: EventEmitter<Promotion> = new EventEmitter<Promotion>();

    promotionTypes: PromotionType[];
    promotionLabels: PromotionLabel[];
    categorys: Category[];
    user_current: User;

    promotionForm: FormGroup;
    ckEditorConfig:any;
    selected = true;

    api_domain:string = "";
    msg_clear_image = '';
    msg_clear_thumbnail = '';

    errors: any = "";
    apply_date: Date = new Date();

    lang = 'vi';
    title_page = "";
    SYSTEM_ADMIN: number;

    constructor(
        private promotionService: PromotionService,
        private categoryService: CategoryService,
        private promotionTypeService: PromotionTypeService,
        private promotionLabelService: PromotionLabelService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private toastr: ToastrService,
        private variable_globals: VariableGlobals,
        private scrollTop: ScrollTop,
        private handleError:HandleError
    ) {
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        this.SYSTEM_ADMIN = CONSTANT.SYSTEM_ADMIN;
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        // get current user
        this.user_current = this.variable_globals.user_current;

        this.getAllCategory();
        this.getPromotionTypes();
        this.getPromotionLabels();

        this.ckEditorConfig = ckeditor_config.config;

        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title_page = "Chỉnh Sửa Khuyến Mãi";
            this.getPromotion();
        } else {
            // Add new Form
            this.title_page = "Thêm Khuyến Mãi";
            this.promotion = new Promotion()
            this.creatPromotionForm();
        }
    }

    ngAfterViewChecked(){
        if(this.isDisable()){
            // disabled button, input, select, only view
            $('form button,form input,form select').attr('disabled', true);
        }
    }

    /*
        function creatForm(): Create Reactive Form
        @author: diemnguyen
    */ 
    private creatPromotionForm(): void {
        this.promotionForm = this.fb.group({
            id: [this.promotion.id],
            name: [this.promotion.name, [Validators.required, Validators.maxLength(255)]],
            image: [this.promotion.image, [ImageValidators.validateFile]],
            image_thumbnail: [this.promotion.image_thumbnail, [ImageValidators.validateFile]],
            short_description: [this.promotion.short_description, [Validators.required, Validators.maxLength(350)]],
            content: [this.promotion.content, [Validators.required]],
            promotion_category: [this.promotion.promotion_category ? this.promotion.promotion_category : ''],
            promotion_label: [this.promotion.promotion_label ? this.promotion.promotion_label : ''],
            promotion_type: [this.promotion.promotion_type ? this.promotion.promotion_type.id : ''],
            apply_date: [this.promotion.apply_date ? moment(this.promotion.apply_date,"DD/MM/YYYY").toDate() : '',
                [DateValidators.validStartDate, DateValidators.formatStartDate]],
            end_date: [this.promotion.end_date ? moment(this.promotion.end_date,"DD/MM/YYYY").toDate() : '',
                [DateValidators.validEndDate, DateValidators.formatEndDate]],
            apply_time: [this.promotion.apply_time ? moment(this.promotion.apply_time,"HH:mm").format() : '', 
                [DateValidators.validStartTime, DateValidators.formatStartTime]],
            end_time: [this.promotion.end_time ? moment(this.promotion.end_time,"HH:mm").format() : '',
                [DateValidators.validEndTime, DateValidators.formatEndTime]],
            is_draft: [this.promotion.is_draft],
            is_clear_image: [false],
            is_clear_image_thumbnail: [false],
        }, {validator: this.dateTimeLessThan()});
    }

    /*
        Function dateTimeLessThan(): validate date, time
        Author: Lam
    */
    dateTimeLessThan(){
        return (group: FormGroup): {[key: string]: any} => {
            // get date, time by #id
            let start_date = $('#start_date').val() ? moment($('#start_date').val(), "DD/MM/YYYY").toDate() : '';
            let end_date = $('#end_date').val() ? moment($('#end_date').val(), "DD/MM/YYYY").toDate() : '';
            let start_time = $('#start_time').val() ? moment($('#start_time').val(), 'HH:mm').toDate() : '';
            let end_time = $('#end_time').val() ? moment($('#end_time').val(), 'HH:mm').toDate() : '';
            // case start date > end date
            if(moment(start_date, "DD/MM/YYYY").toDate() > moment(end_date, "DD/MM/YYYY").toDate()){
                return {
                    dates: "Vui lòng nhập ngày kết thúc lớn hơn hoặc bằng ngày áp dụng"
                };
            }
            // check time exist
            if(start_time !== '' || end_time !== ''){
                // case select time but not select start date
                if(start_date === ''){
                    return {
                        datempty: "Vui lòng nhập ngày áp dụng"
                    };
                }else if(start_time === '' || end_time === ''){ // case only start or end time, require select start and end time
                    return {
                        slectedtime: "Vui lòng nhập thời gian áp dụng/kết thúc"
                    };
                }else{
                    // case start = end date(check date == not working), require start time >= end time
                    if(start_date >= end_date && start_date <= end_date && start_time >= end_time){ 
                        return {
                            times: "Vui lòng nhập thời gian kết thúc lớn hơn thời gian áp dụng"
                        };
                    }
                }
            }
            return {};
        }
    }    

    /*
        Call Service get promotion by Id
        @author: diemnguyen 
    */
    getPromotion() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.promotionService.getPromotionById(id, this.lang).subscribe((data) => {
            this.promotion = data;
            this.creatPromotionForm();
        }, (error) => {
            this.handleError.handle_error(error);;
        });
    }

    /*
        function getPromotionType(): get all promotion type
        @author: diemnguyen
    */ 
    getAllCategory(): void{
        this.categoryService.getAllCategory().subscribe(
            (data) => {
                this.categorys = data;
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        function getPromotionType(): get all promotion type
        @author: diemnguyen
    */ 
    getPromotionTypes(): void{
        this.promotionTypeService.getAllPromotionsType().subscribe(
            (data) => {
                this.promotionTypes = data;
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        function getPromotionLabel(): get all promotion label
        @author: diemnguyen
    */ 
    getPromotionLabels(): void{
        this.promotionLabelService.getPromotionLabels(this.lang).subscribe(
            (data) => {
                this.promotionLabels = data;
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        Change file input event. ( image field and thumbnail image field)
        @author: diemnguyen
    */
    onFileChange(event) {
        let reader = new FileReader();
        let input_id = $(event.target).attr('id');
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.promotionForm.get(input_id).setValue({ filename: file.name, filetype: file.type, value: file });
        }
    }

    /*
        Click save button
        Call save(promotion id is null) or update(promotion id is not null) service
        @author: diemnguyen
    */
    saveEvent(): void {
        // set and update valdiator, so error validate ng-datetime "owlDateTimeParse"
        this.promotionForm.controls['apply_date'].setValidators([DateValidators.validStartDate,
            DateValidators.formatStartDate]);
        this.promotionForm.controls['apply_date'].updateValueAndValidity();
        this.promotionForm.controls['end_date'].setValidators([DateValidators.validEndDate,
            DateValidators.formatEndDate]);
        this.promotionForm.controls['end_date'].updateValueAndValidity();
        this.promotionForm.controls['apply_time'].setValidators([DateValidators.validStartTime,
            DateValidators.formatStartTime]);
        this.promotionForm.controls['apply_time'].updateValueAndValidity();
        this.promotionForm.controls['end_time'].setValidators([DateValidators.validEndTime,
            DateValidators.formatEndTime]);
        this.promotionForm.controls['end_time'].updateValueAndValidity();

        // case form invalid, show error fields, scroll top
        if(this.promotionForm.invalid){
            ValidateSubmit.validateAllFormFields(this.promotionForm);
            if(this.position !== 'popup'){
                this.scrollTop.scrollTopFom();
            }else{
                $('#UpdatePromotion').animate({ scrollTop: $('.modal-title').offset().top }, 'slow');
            }
        }else{
            // get value date, time by #id 
            this.promotionForm.value.apply_date = $('#start_date').val();
            this.promotionForm.value.end_date = $('#end_date').val();
            this.promotionForm.value.apply_time = $('#start_time').val();
            this.promotionForm.value.end_time = $('#end_time').val();
            this.errors = '';
            const that = this;
            // Convert FormGroup to FormData
            let promotionFormData = this.convertFormGroupToFormData(this.promotionForm);
            let value_form = this.promotionForm.value;
            /*
                Case 1: Promotion id is not null then call update service
                Case 1: Promotion id is null then call save service
            */
            if(this.promotion.id) {
                if((value_form.is_clear_image === true && typeof(value_form.image) != 'string') ||
                    (value_form.is_clear_image_thumbnail === true && typeof(value_form.image_thumbnail) != 'string')){
                    // case field is image
                    if(value_form.is_clear_image === true && typeof(value_form.image) != 'string'){
                        this.promotionForm.get('is_clear_image').setValue(false);
                        this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                    }
                    // case field is image thumbnail
                    if(value_form.is_clear_image_thumbnail === true && typeof(value_form.image_thumbnail) != 'string'){
                        this.promotionForm.get('is_clear_image_thumbnail').setValue(false);
                        this.msg_clear_thumbnail = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                    }
                    if(this.position !== 'popup'){
                        this.scrollTop.scrollTopFom();
                    }else{
                        $('#UpdatePromotion').animate({ scrollTop: $('.modal-title').offset().top }, 'slow');
                    }
                }else{
                    this.promotionService.updatePromotion(promotionFormData, this.promotion.id, this.lang).subscribe(
                        (data) => {
                            // popup edit pormotion at user promotion
                            if(this.position === 'popup'){
                                this.promotion = data;
                                // clean input image
                                $("#image_thumbnail").val("");
                                $("#image").val("");
                                this.update_promotion.emit(this.promotion);
                                $('#UpdatePromotion').modal('toggle');
                                this.msg_clear_image = '';
                                this.msg_clear_thumbnail = '';
                                this.toastr.success(`Chỉnh sửa "${this.promotionForm.value.name}" thành công`);
                            }else{
                                // Navigate to promotion page where success
                                this.toastr.success(`Chỉnh sửa "${this.promotionForm.value.name}" thành công`);
                                that.router.navigate(['/promotions']);
                            }
                        }, 
                        (error) => {
                            if(error.status == 400){
                                that.errors = JSON.parse(error.response).message;
                                if(this.position !== 'popup'){
                                    this.scrollTop.scrollTopFom();
                                }else{
                                    $('#UpdatePromotion').animate({ scrollTop: $('.modal-title').offset().top }, 'slow');
                                }
                            }else{
                                $('#UpdatePromotion').modal('toggle');
                                this.handleError.handle_error(error);
                            }
                        }
                    );
                }
            } else {
                this.promotionService.savePromotion(promotionFormData, this.lang).subscribe(
                    (data) => {
                        // Navigate to promotion page where success
                        this.toastr.success(`Thêm mới "${this.promotionForm.value.name}" thành công`);
                        that.router.navigate(['/promotions']);
                    }, 
                    (error) => {
                        if(error.status == 400){
                            that.errors = JSON.parse(error.response).message;
                            this.scrollTop.scrollTopFom();
                        }else{
                            this.handleError.handle_error(error);
                        }
                    }
                );
            }
        }
    }

    /*
        Click promotion button
        step1: open popup comfirm
        step2:  + click ok button call service delete
                + click cance button close popup
        @author: diemnguyen
    */
    deletePromotionEvent(event) {
        const id = this.promotion.id;
        const that = this;
        if (id) {
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa Khuyến Mãi này?",
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
                        // Call service delete promotion by id
                        that.promotionService.deletePromotionById(id, that.lang).subscribe(
                            (data) => {
                                that.toastr.success(`Xóa "${that.promotion.name}" thành công`);
                                that.router.navigate(['/promotions']);
                            }, 
                            (error) => {
                                that.handleError.handle_error(error);
                            });
                    }
                }
            });

        } else  {
            bootbox.alert("Vui lòng chọn Khuyến Mãi cần xóa");
        }
    }

    /*
        Function isDisable(): Check promotion not is_draft or end_date < date now and current user is not system admin
        Author: Lam
    */
    isDisable(){
        if(this.user_current && this.promotion && this.promotion.id){
            let date_now = moment(this.datePipe.transform(Date.now(), 'dd/MM/yyy'), "DD/MM/YYYY").toDate();
            let end_date = this.promotion.end_date ? moment(this.promotion.end_date, "DD/MM/YYYY").toDate() : '';
            if((this.promotion.is_draft === false || (end_date !== '' && end_date < date_now)) && this.user_current.role !== this.SYSTEM_ADMIN){
                return true;
            }
        }
        return false;
    }

    /*
        Convert form group to form data to submit form
        @author: diemnguyen
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
                } else if (k === 'image' || k === 'image_thumbnail') {
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
