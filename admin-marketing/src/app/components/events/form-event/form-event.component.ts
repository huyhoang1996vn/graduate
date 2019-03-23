import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Event } from '../../../shared/class/event';
import { EventService } from '../../../shared/services/event.service';
import { env } from '../../../../environments/environment';
import { DateValidators } from './../../../shared/validators/date-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ImageValidators } from './../../../shared/validators/image-validators';
import * as moment from 'moment';
import * as ckeditor_config from './../../../shared/commons/ckeditor_config';
import { ToastrService } from 'ngx-toastr';
import { ScrollTop } from './../../../shared/commons/scroll-top';
import { HandleError } from '../../../shared/commons/handle_error';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'form-event',
    templateUrl: './form-event.component.html',
    styleUrls: ['./form-event.component.css'],
    providers: [EventService]
})
export class FormEventComponent implements OnInit {

    /*
        author: Lam
    */
    event: Event;
    formEvent: FormGroup;

    errorMessage: any; // Messages error
    msg_clear_image = '';
    msg_clear_thumbnail = '';

    api_domain: string = '';
    lang = 'vi';
    title_page = '';

    ckEditorConfig:any;

    constructor(
        private eventService: EventService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private scrollTop: ScrollTop,
        private handleError:HandleError
    ) {
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        // get params url
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });

        this.ckEditorConfig = ckeditor_config.config;

        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title_page = "Chỉnh Sửa Sự Kiện";
            this.getEvent();
        } else {
            // Add new Form
            this.title_page = "Thêm Sự Kiện";
            this.event = new Event();
            this.creatForm();
        }
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formEvent = this.fb.group({
            name: [this.event.name, [Validators.required, Validators.maxLength(255)]],
            image: [this.event.image, [ImageValidators.validateFile]],
            image_thumbnail: [this.event.image_thumbnail, [ImageValidators.validateFile]],
            short_description: [this.event.short_description, [Validators.required, Validators.maxLength(350)]],
            content: [this.event.content, Validators.required],
            start_date: [this.event.start_date ? moment(this.event.start_date,"DD/MM/YYYY").toDate() : '', 
                [DateValidators.validStartDate, DateValidators.formatStartDate, DateValidators.requiredStartDate]],
            end_date: [this.event.end_date ? moment(this.event.end_date,"DD/MM/YYYY").toDate() : '', 
                [DateValidators.validEndDate, DateValidators.formatEndDate, DateValidators.requiredEndDate]],
            start_time: [this.event.start_time ? moment(this.event.start_time,"HH:mm").format() : '', 
                [DateValidators.validStartTime, DateValidators.requiredStartTime, DateValidators.formatStartTime]],
            end_time: [this.event.end_time ? moment(this.event.end_time,"HH:mm").format() : '',
                [DateValidators.validEndTime, DateValidators.requiredEndTime, DateValidators.formatEndTime]],
            is_draft: [this.event.is_draft === true ? true : false],
            is_clear_image: [false],
            is_clear_image_thumbnail: [false]
        }, {validator: DateValidators.dateTimeLessThan()});

    }
     /*
        Function checkIsNewline():
         + check value has new line, 
         + check length + count_line > 350
         + if true, return error maxlength
        Author: HOang
    */
    checkIsNewline(value: string){
        var count_line = value.split(/\r\n|\r|\n/).length-1;
        if (count_line > 0){
            if(this.formEvent.value.short_description.length + count_line > 350){
                this.formEvent.controls['short_description'].setErrors({'maxlength': {requiredLength: 350, actualLength: 351}});
            }
        }
    }
    /*
        Function getEvent():
         + Get id from url path
         + Callback service function getEvent() by id
        Author: Lam
    */
    getEvent(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.eventService.getEvent(id, this.lang).subscribe(
            (data) => {
                this.event = data;
                this.creatForm();
                this.checkIsNewline(data.short_description);
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
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formEvent.get('image').setValue({
                filename: file.name,
                filetype: file.type,
                value: file,
            });
        }
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChangeThumbnail(event): void{
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formEvent.get('image_thumbnail').setValue({
                filename: file.name,
                filetype: file.type,
                value: file,
            });
        }
    }



    /*
        Function onSubmit():
         + Step 1: Check event add event (post), edit event (put)
         + Step 2:  
            * TH1:  + event id empty, call service function addEvent() to add event, 
                    + Later, redirect list event with message
            * TH2:  + event id exist call service function updateEvent() to update Event
                    + Later, redirect list event with message
        author: Lam
    */ 
    onSubmit(): void{
        // set and update valdiator, so error validate ng-datetime "owlDateTimeParse"
        this.formEvent.controls['start_date'].setValidators([DateValidators.validStartDate,
            DateValidators.formatStartDate, DateValidators.requiredStartDate]);
        this.formEvent.controls['start_date'].updateValueAndValidity();
        this.formEvent.controls['end_date'].setValidators([DateValidators.validEndDate,
            DateValidators.formatEndDate, DateValidators.requiredStartDate]);
        this.formEvent.controls['end_date'].updateValueAndValidity();
        this.formEvent.controls['start_time'].setValidators([DateValidators.validStartTime,
            DateValidators.requiredStartTime, DateValidators.formatStartTime]);
        this.formEvent.controls['start_time'].updateValueAndValidity();
        this.formEvent.controls['end_time'].setValidators([DateValidators.validEndTime,
            DateValidators.requiredEndTime, DateValidators.formatEndTime]);
        this.formEvent.controls['end_time'].updateValueAndValidity();
        
        // case form invalid, show error fields, scroll top
        if(this.formEvent.invalid){
            ValidateSubmit.validateAllFormFields(this.formEvent);
            this.scrollTop.scrollTopFom();
        }else{
            // get value date, time by #id 
            this.formEvent.value.start_date = $('#start_date').val();
            this.formEvent.value.end_date = $('#end_date').val();
            this.formEvent.value.start_time = $('#start_time').val();
            this.formEvent.value.end_time = $('#end_time').val();
            // convert Form Group to formData
            let event_form_data = this.convertFormGroupToFormData(this.formEvent);
            let value_form = this.formEvent.value;
            // case create new
            if(!this.event.id){
                this.eventService.addEvent(event_form_data, this.lang).subscribe(
                    (data) => {
                        this.toastr.success(`Thêm mới "${value_form.name}" thành công`);
                        this.router.navigate(['/event/list']);
                    },
                    (error) => {
                        // code 400, error validate
                        if(error.status == 400){
                            this.errorMessage = JSON.parse(error.response).message;
                            this.scrollTop.scrollTopFom();
                        }else{
                            this.handleError.handle_error(error);
                        }
                    }
                );
            }else{ // case update
                // check remove image when select checkbox clear image and choose image
                if((value_form.is_clear_image === true && typeof(value_form.image) != 'string') ||
                    (value_form.is_clear_image_thumbnail === true && typeof(value_form.image_thumbnail) != 'string')){
                    // case field is image
                    if(value_form.is_clear_image === true && typeof(value_form.image) != 'string'){
                        this.formEvent.get('is_clear_image').setValue(false);
                        this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                    }
                    // case field is image thumbnail
                    if(value_form.is_clear_image_thumbnail === true && typeof(value_form.image_thumbnail) != 'string'){
                        this.formEvent.get('is_clear_image_thumbnail').setValue(false);
                        this.msg_clear_thumbnail = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                    }
                    this.scrollTop.scrollTopFom();
                }else{
                    this.eventService.updateEvent(event_form_data, this.event.id, this.lang).subscribe(
                        (data) => {
                            this.toastr.success(`Chỉnh sửa "${value_form.name}" thành công`);
                            this.router.navigate(['/event/list']);
                        },
                        (error) => {
                            // code 400, error validate
                            if(error.status == 400){
                                this.errorMessage = JSON.parse(error.response).message;
                                this.scrollTop.scrollTopFom();
                            }else{
                                this.handleError.handle_error(error);
                            }
                        }
                    );
                }
            }
        }
    }
    
    /*
        Function deleteEvent(): confirm delete
        @author: Lam
    */
    deleteEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Sự Kiện này?",
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
         + Call service function onDelEvent() by id to delete event
        Author: Lam
    */
    onDelete(): void {
        const id = this.event.id;
        this.eventService.onDelEvent(id, this.lang).subscribe(
            (data) => {
                this.toastr.success(`Xóa "${this.formEvent.value.name}" thành công`);
                this.router.navigate(['/event/list']);
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
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
                } else if (k === 'image' || k === 'image_thumbnail') {
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
