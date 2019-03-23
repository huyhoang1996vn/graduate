import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../../shared/services/feedback.service'
import { Router } from '@angular/router';
import 'rxjs/add/observable/throw';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CheckDateValid } from './../../../shared/validators/check-date-valid';
import { HandleError } from '../../../shared/commons/handle_error';

@Component({
    selector: 'app-statistics-feedback',
    templateUrl: './statistics-feedback.component.html',
    styleUrls: ['./statistics-feedback.component.css'],
    providers: [FeedbackService]
})
export class StatisticsFeedbackComponent implements OnInit {

    date_status_start: any;
    date_status_end: any;
    date_rate_start: any;
    date_rate_end: any;
    fb_status: any;
    fb_rate: any;
    status_sum: number;
    rate_sum: number;

    start_date: string = '';
    end_date: string = '';

    checkDateValid = new CheckDateValid();
    // check permission to display page
    error_permission:boolean = false;
    constructor(
        private feedbackService: FeedbackService, 
        private router: Router,
        private toastr: ToastrService,
        private handleError:HandleError
    ) {}

    ngOnInit() {
        this.getStatisticFeedback();
    }

    /* 
        function getStatisticFeedback(): get summary feedback status status and rate
        author: Lam
    */
    getStatisticFeedback(){
        this.feedbackService.getStatisticFeedback().subscribe(
            (data) => {
                this.error_permission = false;
                this.fb_status = data.message.status;
                this.fb_rate = data.message.rate;
                this.status_sum = data.message.status_sum;
                this.rate_sum = data.message.rate_sum;
            },
            (error) => {
                this.error_permission = true;
                this.handleError.handle_error(error);
            }
        );
    }

    /* 
        function onSubmitStatus():
         + Check validate
         + get date start and end. Later, Check date start and end exist.
         + Valid success, call service function searchStatisticFeedback to get statistic feedback status
         + Fail, show messsage error
        author: Lam
    */
    onSubmitStatus(){
        let start;
        let end;
        let isCheckValid: boolean = true;
        // check valid status
        isCheckValid = this.checkValid('status', 'startD_status', 'endD_status');
        if(isCheckValid === false) return;
        // get start and end by #id
        start = $('#startD_status').val() ? String($('#startD_status').val()) : '';
        end = $('#endD_status').val() ? String($('#endD_status').val()) : '';

        // Get date to set params dispatch list feedback
        this.start_date = start;
        this.end_date = end;

        this.feedbackService.searchStatisticFeedback('status', start, end).subscribe(
            (data) => {
                this.fb_status = data.message.status;
                this.status_sum = data.message.status_sum;
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

     /* 
        function onSubmitRate():
         + Check validate
         + get date start and end. Later, Check date start and end exist.
         + Valid success, call service function searchStatisticFeedback to get statistic feedback status
         + Fail, show messsage error
        author: Lam
    */
    onSubmitRate(){
        let start;
        let end;
        let isCheckValid: boolean = true;
        // check valid rate
        isCheckValid = this.checkValid('rate', 'startD_rate', 'endD_rate');
        if(isCheckValid === false) return;
        // get start and end by #id
        start = $('#startD_rate').val() ? String($('#startD_rate').val()) : '';
        end = $('#endD_rate').val() ? String($('#endD_rate').val()) : '';

        this.feedbackService.searchStatisticFeedback('rate', start, end).subscribe(
            (data) => {
                this.fb_rate = data.message.rate;
                this.rate_sum = data.message.rate_sum;
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        Function checkDate(): validate start date and end date
        Author: Lam
    */
    checkDate(startD, endD) {
        // get start and end date by #id
        let start = $('#' + startD).val() ? moment($('#' + startD).val(), "DD/MM/YYYY").toDate() : '';
        let end = $('#' + endD).val() ? moment($('#' + endD).val(), "DD/MM/YYYY").toDate() : '';
        if(start <= end || start === '' || end === ''){
            return true;
        }
        return false;
    }

    /*
        Function formatDate(): validate format date, dd/mm/yyyy
        Author: Lam
    */
    formatDate(date) {
        // format date is dd/mm/yyyy
        let validatePattern = /^(\d{1,2})(\/|)(\d{1,2})(\/|)(\d{4})$/;
        // get date by #id
        let getValDate = String($('#'+ date).val());
        let dateValues = getValDate.match(validatePattern);
        // check value date mactch, null return false
        if(getValDate === ''){
            return true;
        }else if(dateValues === null){
            return false;
        }
        return true;
    }

    /*
        Function checkValid(): 
         + Validate checkDate and format date
         + Error return false, message error
         + Success return true
        Author: Lam
    */
    checkValid(event, startD, endD){
        let msg_formatD = '* Định dạng ngày sai. Vui lòng chọn lại ngày dd/mm/yyy';
        let msg_checkD = '* Vui lòng nhập ngày kết thúc lớn hơn hoặc bằng ngày bắt đầu';
        let msg_validD = '* Vui lòng nhập ngày bắt đầu/kết thúc hợp lệ ';

        let isCheckDate: boolean = true; // require start < end date
        let isFormatDate: boolean = true; // format dd/mm/yyyy
        let isvalidDate: boolean = true; // day in month( 2th only have 28/29 day), month < 13

        isFormatDate = this.formatDate(startD);

        if(isFormatDate === true){
            isFormatDate = this.formatDate(endD);
        }

        isCheckDate = this.checkDate(startD, endD);
        isvalidDate = this.validDate(startD, endD)
        // check format dd/mm/yyyy
        if(isFormatDate === false){
            this.toastr.warning(`${msg_formatD}`);
            return false;
        }else if(isvalidDate === false){ //require start < end date
            this.toastr.warning(`${msg_validD}`);
            return false;
        }else if(isCheckDate === false){ // day in month( 2th only have 28/29 day), month < 13
            this.toastr.warning(`${msg_checkD}`);
            return false;
        }
        return true;
    }

    /*
        Function trimDate(): valid date, day in month( 2th only have 28/29 day), month < 13
        Author: Lam
    */
    validDate(startD, endD){
        // get start and end date by #id
        let start = $('#' + startD).val() ? String($('#' + startD).val()) : '';
        let end = $('#' + endD).val() ? String($('#' + endD).val()) : '';
        // check valid start and end date
        let is_start = start ? this.checkDateValid.trimDate(start) : true;
        let is_end = end ? this.checkDateValid.trimDate(end) : true;
        if(is_start === false || is_end === false){
            return false;
        }
        return true;
    }
}
