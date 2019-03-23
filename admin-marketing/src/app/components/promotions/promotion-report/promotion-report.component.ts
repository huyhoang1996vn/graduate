import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from './../../../shared/services/promotion.service';
import { Promotion } from './../../../shared/class/promotion';
import { User } from './../../../shared/class/user';
import { Subject } from 'rxjs/Subject';
import * as datatable_config from '../../../shared/commons/datatable_config';
import { HandleError } from '../../../shared/commons/handle_error'; 
@Component({
    selector: 'app-promotion-report',
    templateUrl: './promotion-report.component.html',
    styleUrls: ['./promotion-report.component.css'],
    providers: [PromotionService]
})
export class PromotionReportComponent implements OnInit {

    promotion: Promotion;
    promotion_user: User[];

    dtOptions: any = {};

    lang = 'vi';
    count_user_total: number;
    count_user_received: number;
    count_user_not_received: number;
    list_user: any;

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

  	constructor(
        private promotionService: PromotionService,
        private route: ActivatedRoute,
        private router: Router,
        private handleError:HandleError
    ) { }

  	ngOnInit() {
        // get params url
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.getPromotionReport();
        this.dtOptions = datatable_config.data_config('Khách Hàng');
        // custom datatable option
        let dt_options_custom = {
            initComplete: (setting) => {
                $('.info_search').html('<i class="fa fa-exclamation-circle"></i> Để tìm kiếm ngày sinh bạn cần gõ từ khóa tìm kiếm kèm theo dấu /');
                $('.info_search').css('text-align', 'right');
            },
            columnDefs: [
                {
                    targets: 0,
                    visible: false
                }
            ],
            order: [[ 1, 'asc' ]],
            "sDom": "<'row'<'col-md-12'f><'col-md-6'l><'col-md-6 info_search'>>rt<'row'<'col-md-12'i><'col-md-12'p>>",
        };
        // create new object from 2 object use operator spread es6
        this.dtOptions = {...this.dtOptions, ...dt_options_custom };
  	}

    /*
        Call Service get promotion report by Id
        @author: Lam 
    */
    getPromotionReport(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.promotionService.getPromotionReport(id, this.lang).subscribe(
            (data) => {
                this.promotion = data.promotion;
                this.count_user_total = data.count_user_total;
                this.count_user_received = data.count_user_received;
                this.count_user_not_received = data.count_user_not_received;
                this.list_user = data.gift_user;
            }, 
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        Convert date tye dd/MM/yyyy to string yyyyMMdd
        @author: Trangle
     */
    convertToDate(date) {
        if (date !== null) {
            let day = date.split('/');
            return String(day[2]) + String(day[1]) + String(day[0]);
        }
    }

}
