import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateValidators } from './../../shared/validators/date-validators';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { OpenTimeService } from './../../shared/services/open-time.service';
import * as moment from 'moment';
import { ValidateSubmit } from './../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';
import { HandleError } from '../../shared/commons/handle_error';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'app-open-time',
    templateUrl: './open-time.component.html',
    styleUrls: ['./open-time.component.css'],
    providers: [OpenTimeService]
})
export class OpenTimeComponent implements OnInit {

    @ViewChild(CalendarComponent) viCalendar: CalendarComponent;

    formOpenTime: FormGroup;

    list_day = [];

    errorMessage: any;

    // config options full calendar
    calendarOptions: Options;
    is_init_calendar: boolean = true;

    month_event: any;
    year_event: any;

    is_disabled_day_of_week: boolean = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private openTimeService: OpenTimeService,
        private toastr: ToastrService,
        private handleError:HandleError
    ) { }

    ngOnInit() {
        this.creatForm();
        

        let date_now = new Date();
        this.getOpenTime(date_now.getMonth() + 1, date_now.getFullYear());
    }

    /*
        function getOpenTime(): Create Reactive Form
        author: Lam
    */ 
    getOpenTime(month, year){
        this.openTimeService.getOpenTime(month, year).subscribe(
            (data) => {
                let events_new = [];
                if(data){
                    data.map(item => {
                        events_new.push({
                            title: `${this.StrimTime(item.start_time)} - ${this.StrimTime(item.end_time)}`,
                            start: item.open_date
                        });
                    })
                }
                if(this.is_init_calendar){
                    this.calendarOptions = {
                        locale: 'vi',
                        monthNames: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                            'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
                        dayNamesShort: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
                        editable: false,
                        eventLimit: false,
                        buttonText: {
                            today: 'Hôm nay'
                        },
                        events: events_new
                    };
                    this.is_init_calendar = false;
                }else{
                    this.viCalendar.fullCalendar('removeEvents');
                    this.viCalendar.fullCalendar('addEventSource', events_new);
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
        this.formOpenTime = this.fb.group({
            start_date: ['', 
                [DateValidators.validStartDate, DateValidators.formatStartDate, DateValidators.requiredStartDate]],
            end_date: ['', 
                [DateValidators.validEndDate, DateValidators.formatEndDate, DateValidators.requiredEndDate]],
            start_time: ['', 
                [DateValidators.validStartTime, DateValidators.requiredStartTime, DateValidators.formatStartTime]],
            end_time: ['',
                [DateValidators.validEndTime, DateValidators.requiredEndTime, DateValidators.formatEndTime]],
            is_draft: [false],
        }, {validator: this.dateTimeLessThanOpenTime()});
    }

    /*
        Function dateTimeLessThanOpenTime(): validate date, time
        Author: Lam
    */
    dateTimeLessThanOpenTime(){
        return (group: FormGroup): {[key: string]: any} => {
            // get val date, time by #id
            let start_date = $('#start_date').val() ? moment($('#start_date').val(), "DD/MM/YYYY").toDate() : '';
            let end_date = $('#end_date').val() ? moment($('#end_date').val(), "DD/MM/YYYY").toDate() : '';
            let start_time = $('#start_time').val() ? moment($('#start_time').val(), 'HH:mm').toDate() : '';
            let end_time = $('#end_time').val() ? moment($('#end_time').val(), 'HH:mm').toDate() : '';
            // check start date = end date (check date == not working) and start >= end time let return error
            if(start_time !== '' && end_time !== '' && start_time >= end_time){
                return {
                    times: "Vui lòng nhập thời gian kết thúc lớn hơn thời gian bắt đầu"
                };
            }

            // case start date = end date, disabled input day of week 
            if(start_date !== '' && end_date !== '' && start_date >= end_date && start_date <= end_date){
                this.is_disabled_day_of_week = true;
                this.list_day = [];
            }else{
                this.is_disabled_day_of_week = false;
            }

            // check start and end date not empty, start date > end date let return error
            if(start_date !== '' && end_date !== '' && start_date > end_date){
                return {
                    dates: "Vui lòng nhập ngày kết thúc lớn hơn hoặc bằng ngày bắt đầu"
                };
            }
            return {};
        }
    } 

    /*
        function ckbDayAll(): select checkbox all dates of the week
        author: Lam
    */ 
    ckbDayAll(event){
        this.list_day = [];
        // target checked is true let checked all checkbox, is false let unchecked
        if(event.target.checked){
            this.list_day = [1,2,3,4,5,6,7];
            $('.table-open-time tbody input').prop('checked', true);
        }else{
            $('.table-open-time tbody input').prop('checked', false);
        }
    }

    /*
        function ckbDay(): select checkbox dates of the week
        author: Lam
    */ 
    ckbDay(event){
        // get value input 
        let number_day = parseInt(event.target.value);
        // target checked is true let push number day to list_day
        if(event.target.checked){
            this.list_day.push(number_day);
            // check length list_day = 7(7 day in week) let input checkbox all will checked
            if(this.list_day.length === 7){
                $('#checked_all').prop('checked', true);
            }
        }else{ 
            $('#checked_all').prop('checked', false);
            // Remove number day in array list_day
            this.list_day = this.list_day.filter(k => k !== number_day);
        }
    }

    /*
        function clickButton(): event click today, pre, next fullcalendar
        author: Lam
    */ 
    clickButton(event) {
        this.month_event = event.data.month() + 1;
        this.year_event = event.data.year();
        this.getOpenTime(this.month_event, this.year_event);
    }

    /*
        function StrimTime(): get HH:mm of string HH:mm:ss
        author: Lam
    */ 
    StrimTime(time){
        let str = time.substring(0,5);
        return str;
    }

    /*
        function onSubmit(): save open time
        author: Lam
    */
    onSubmit(){
        // show error valdiate when submit form
        if(this.formOpenTime.invalid){
            ValidateSubmit.validateAllFormFields(this.formOpenTime);
        }else{
            // Get value and format date, time for value form open time
            this.formOpenTime.value.day_of_week = this.list_day;
            this.formOpenTime.value.start_date = $('#start_date').val();
            this.formOpenTime.value.end_date = $('#end_date').val();
            this.formOpenTime.value.start_time = $('#start_time').val();
            this.formOpenTime.value.end_time = $('#end_time').val();
            this.openTimeService.addOpenTime(this.formOpenTime.value).subscribe(
                (data) => {
                    this.toastr.success(`Thêm mới giờ mở cửa thành công`);
                    this.formOpenTime.reset(); // reset form
                    this.list_day = [];
                    $('.table-open-time tr td input:checkbox').prop('checked', false);
                    // get data events month select current
                    if(this.month_event && this.year_event){
                        this.getOpenTime(this.month_event, this.year_event);
                    }else{
                        // get data events month current
                        let date_now = new Date();
                        this.getOpenTime(date_now.getMonth() + 1, date_now.getFullYear());
                    }
                    this.errorMessage = null;
                },
                (error) => {
                    // code 400, erro validate
                    if(error.status === 400){
                        this.errorMessage = error.json().message;
                    }else{
                        this.handleError.handle_error(error);;
                    }
                }
            );
        }
    }

}
