import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/class/user';
import { Notification } from '../../../shared/class/notification';
import { NotificationService } from '../../../shared/services/notification.service';
import { Promotion } from './../../../shared/class/promotion';
import { PromotionService } from './../../../shared/services/promotion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VariableGlobals } from './../../../shared/commons/variable_globals';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/observable/throw';
import { HandleError } from '../../../shared/commons/handle_error';
import * as CONSTANT from './../../../shared/commons/constant';


declare var bootbox:any;

@Component({
    selector: 'app-notification-detail',
    templateUrl: './notification-detail.component.html',
    styleUrls: ['./notification-detail.component.css'],
    providers: [NotificationService, PromotionService]
})
export class NotificationDetailComponent implements OnInit {

    /*
        Author: Lam
    */

    noti_detail: Notification;
    user_list_left: User[]; // List user not selected
    user_list_right: User[]; // List user selected

    is_disable_notification: boolean;
    is_update: boolean = false; // Check input checkbox Update Notification
    user_current: User;
    promotion: Promotion;
    length_user_right: number = 0;

    lang = 'vi';
    SYSTEM_ADMIN: number;

    constructor(
        private notificationService: NotificationService, 
        private promotionService: PromotionService,
        private route: ActivatedRoute,
        private router: Router,
        private variable_globals: VariableGlobals,
        private toastr: ToastrService,
        private handleError:HandleError
    ) { }

    ngOnInit() {
        // get params url
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.SYSTEM_ADMIN =  CONSTANT.SYSTEM_ADMIN;
        this.getUserNotification();
        // get current user
        this.user_current = this.variable_globals.user_current;
    }

    /*
        Function getUserNotification():
         + Get id from url path
         + Callback service function getUserNotification() by id to get noti_detail, user_list_left, user_list_right
        Author: Lam
    */
    getUserNotification(): void{
        const id = +this.route.snapshot.paramMap.get('id');
        this.notificationService.getUserNotification(id, this.lang).subscribe(
            (data) => {
                this.noti_detail = data.notification_detail;
                this.user_list_left = data.user_all;
                this.user_list_right = data.user_notification;
                this.length_user_right = data.user_notification.length;
                if(this.noti_detail.promotion){
                    this.promotionService.getPromotionById(this.noti_detail.promotion, this.lang).subscribe(
                        (data) => {
                            this.promotion = data;
                        },
                        (error) => {
                            this.handleError.handle_error(error);;
                        }
                    );
                }
                // check promotion id exsit or current user is not system admin and exist sent date notifcation
                if(this.noti_detail.promotion || (this.user_current.role !== this.SYSTEM_ADMIN && this.noti_detail.sent_date)){
                    this.is_disable_notification = true;
                }else{
                    this.is_disable_notification = false;
                }
            }
        );

    }

    /*
        Function getNotification():
         + Get id from url path
         + Callback service function getNotification() by id
        Author: Lam
    */
    getNotification(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.notificationService.getNotification(id, this.lang).subscribe(
            (data) => {
                this.noti_detail = data;
            },
            (error) => {
                this.handleError.handle_error(error);;
            }
        );
    }

    /*
        Function isUpdateNoti(): enable/disable button Update Notification
        Author: Lam
    */
    isUpdateNoti(event){
        if(event.target.checked){
            this.is_update = true;
        }else{
            this.is_update = false;
        }
    }

    /*
        Function updateNoti(): Get notification from component popup-edit-notification
        Author: Lam
    */
    updateNoti(event){
        this.noti_detail = event;
    }

    /*
        Function update_user_noti(): Callback service function updateUserNoti() to update user selected/no selected
        Author: Lam
    */
    update_user_noti(event){
        if(!this.noti_detail.sent_date || (this.user_current.role === this.SYSTEM_ADMIN && this.noti_detail.sent_date)){
            const id = +this.route.snapshot.paramMap.get('id');
            this.notificationService.updateUserNoti(id, event, this.lang).subscribe(
                (data) => {
                    this.toastr.success(`Lưu thành công`);
                    // get length user right
                    this.notificationService.getUserNotification(id, this.lang).subscribe(
                        (data_user) => {
                            this.getNotification();
                            this.length_user_right = data_user.user_notification.length;
                        }
                    );
                },
                (error) => {
                    this.handleError.handle_error(error);;
                }
            );
        }else{
            this.toastr.warning(`Chức năng này chỉ dành cho System Admin`);
        }
        
        
    }

    /*
        Function checkSendNotification(): confirm delete
        @author: Lam
    */
    checkSendNotification(){
        let that = this;
        if(!(this.noti_detail.is_public) && this.length_user_right < 1){
            this.toastr.warning(`Vui lòng chọn khách hàng nhận thông báo`);
        }else{
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn có muốn gửi Thông Báo này không?",
                buttons: {
                    cancel: {
                        label: "HỦY"
                    },
                    confirm: {
                        label: "ĐỒNG Ý"
                    }
                },
                callback: function (result) {
                    if(result) {
                        that.sendNotification();
                    }
                }
            });
        }
    }

    /*
        Function sendNotification(): call service function sendNotification() send notification by notification_id
        @author: Lam
    */
    sendNotification(){
        const id = this.noti_detail.id;
        this.notificationService.sendNotification(id, this.lang).subscribe(
            (data) => {
                this.getNotification();
                this.toastr.success(`${data.message}`);
            },
            (error) => {
                this.toastr.error(`${error.json().message}`);
            }
        );
    }

}
