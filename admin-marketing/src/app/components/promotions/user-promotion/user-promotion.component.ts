import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PromotionService } from '../../../shared/services/promotion.service';
import { User } from '../../../shared/class/user';
import { Promotion } from '../../../shared/class/promotion'
import { Notification } from './../../../shared/class/notification';
import { env } from '../../../../environments/environment';
import { VariableGlobals } from './../../../shared/commons/variable_globals';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as CONSTANT from './../../../shared/commons/constant';
import { HandleError } from '../../../shared/commons/handle_error';
declare var bootbox:any;
declare var $: any;


@Component({
  	selector: 'app-user-promotion',
  	templateUrl: './user-promotion.component.html',
  	styleUrls: ['./user-promotion.component.css'],
    providers: [
        PromotionService
    ]
})
export class UserPromotionComponent implements OnInit {

    promotion: Promotion;
	user_list_left: User[];
    user_list_right: User[];

    user_current: User;

    api_domain:string = "";
    is_update: boolean = false; // Check input checkbox Update Promotion
    is_disable_promotion: boolean;

    notification: Notification;

    lang = 'vi';
    date_now: any;
    ID_TYPE_PROMOTION_DAI_TRA: number;
    SYSTEM_ADMIN: number;
    is_show_popup: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute, 
        private promotionService: PromotionService,
        private variable_globals: VariableGlobals,
        private toastr: ToastrService,
        private datePipe: DatePipe,
        private handleError:HandleError
    ) { 
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });

        this.ID_TYPE_PROMOTION_DAI_TRA = CONSTANT.ID_TYPE_PROMOTION_DAI_TRA;
        this.SYSTEM_ADMIN = CONSTANT.SYSTEM_ADMIN;
    	this.getUsersPromotion();
        // ger current user
        this.user_current = this.variable_globals.user_current;
        // get current date
        this.date_now = moment(this.datePipe.transform(Date.now(), 'dd/MM/yyy'), "DD/MM/YYYY").toDate();
    }

    getUsersPromotion(){
        const promotion_id = +this.route.snapshot.paramMap.get('id');

        this.promotionService.getUsersPromotion(promotion_id, this.lang).subscribe(
            (data)=> {
                this.notification = data.notification;
                this.promotion = data.promotion_detail;
                this.user_list_left = data.user_all;
                this.user_list_right = data.user_promotion;
                let promotion_end_date = this.promotion.end_date ? moment(this.promotion.end_date, "DD/MM/YYYY").toDate() : '';
                //  current user is not system admin and (check promotion is draft or expires of pormotion)
                if((this.user_current.role !== this.SYSTEM_ADMIN && 
                    (this.promotion.is_draft === false || (promotion_end_date !== '' && promotion_end_date < this.date_now))) || 
                    (data.promotion_detail.id === CONSTANT.ID_PROMOTION_FIRST_INSTALL_APP) ||
                    (data.promotion_detail.promotion_type && data.promotion_detail.promotion_type.id === CONSTANT.ID_TYPE_PROMOTION_USER_AND_DEVICE)){
                    this.is_disable_promotion = true;
                }else{
                    this.is_disable_promotion = false;
                }
            }, 
            (error) => {
                this.handleError.handle_error(error);;
            });
    }

    /*
        Function updateUserPromotion(): check valid
        Author: Lam
    */
    updateUserPromotion(list_user_id) {
        if(this.promotion.is_draft === true){
            this.updateUser(list_user_id)
        }else{
            if(this.user_current.role === this.SYSTEM_ADMIN){
                this.updateUser(list_user_id);
            }else{
                this.toastr.warning(`Chức năng này chỉ dành cho System Admin`);
            }
        }
	}

    updateUser(list_user_id){
        const promotion_id = +this.route.snapshot.paramMap.get('id');
        this.promotionService.updateUserPromotion(promotion_id, list_user_id, this.lang).subscribe(
            (data)=> {
                if (data.status == 204) {
                    this.toastr.success(`Lưu thành công`);
                } 
            }, 
            (error) => {
                this.handleError.handle_error(error);;
            }
        );
    }

    /*
        Function isUpdateNoti(): enable/disable button Update Promotion
        Author: Lam
    */
    isUpdatePromotion(event){
        if(event.target.checked){
            this.is_update = true;
        }else{
            this.is_update = false;
        }
    }
    /*
        Function updatePromotion(): Get promotion from component popup-edit-promotion
        Author: Lam
    */
    updatePromotion(event){
        this.promotion = event;
    }

    generator_QR_code(event , id: number) {
        let element = $(event.target);
        element.button('loading');
        this.promotionService.generator_QR_code(id).subscribe(
            (data) => {
                if(data.status == 200) {
                    let body = data.json(); 
                    this.promotion.QR_code = body.qr_code_url;
                }
                element.button('reset');
            }, 
            (error) => {
                element.button('reset');
                this.handleError.handle_error(error);;
            });
    }

    /*
        Function isDisable(): Check promotion not is_draft or promotion_end_date < date now to disabled button
        Author: Lam
    */
    isDisable(promotion){
        let promotion_end_date = promotion.end_date ? moment(promotion.end_date, "DD/MM/YYYY").toDate() : '';
        if((this.promotion.is_draft === false || (promotion_end_date !== '' && promotion_end_date < this.date_now)) && this.user_current.role !== this.SYSTEM_ADMIN){
            return true;
        }
        return null;
    }

    /*
        Function isDisableQRCode(): Check promotion promotion_end_date < date now to disabled button
        Author: Lam
    */
    isDisableQRCode(promotion){
        let end_date = promotion.end_date ? moment(promotion.end_date, "DD/MM/YYYY").toDate() : '';
        if((end_date !== '' && end_date < this.date_now) && this.user_current.role !== this.SYSTEM_ADMIN){
            return true;
        }
        return null;
    }

    /*
        Function isDisable(): Check promotion not is_draft or promotion_end_date < date now to disabled button
        Author: Lam
    */
    isDisableCreateNotificaiton(promotion){
        let promotion_end_date = promotion.end_date ? moment(promotion.end_date, "DD/MM/YYYY").toDate() : '';
        if(this.user_current.role === this.SYSTEM_ADMIN){
            return false;
        }
        if(promotion_end_date !== '' && promotion_end_date < this.date_now){
            return true;
        }
        return false;
    }

    /*
        Function isDisableUpdateNotificaiton(): disable when Expires or notification sent
        Author: Lam
    */
    isDisableUpdateNotificaiton(pro, noti){
        let promotion_end_date = pro.end_date ? moment(pro.end_date, "DD/MM/YYYY").toDate() : '';
        if((noti.sent_date || (promotion_end_date !== '' && promotion_end_date < this.date_now)) && this.user_current.role !== this.SYSTEM_ADMIN){
            return true;
        }
        return null;
    }

    showPopup(){
        this.is_show_popup = true;
    }

}
