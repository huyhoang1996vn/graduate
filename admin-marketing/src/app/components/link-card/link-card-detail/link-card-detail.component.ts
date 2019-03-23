import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/class/user';
import { Customer } from '../../../shared/class/customer';
import { LinkCardService } from '../../../shared/services/link-card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HandleError } from '../../../shared/commons/handle_error';
declare var bootbox:any;

@Component({
    selector: 'app-link-card-detail',
    templateUrl: './link-card-detail.component.html',
    styleUrls: ['./link-card-detail.component.css'],
    providers: [LinkCardService]
})
export class LinkCardDetailComponent implements OnInit {

    user_app = new User();
    user_embed = new Customer();

    constructor(
        private linkCardService: LinkCardService, 
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private handleError:HandleError
    ) { }

    ngOnInit() {
        this.getUser();
    }

    /*
        Function getUser(): 
         + Get email user app and barcode user emebed  from param query
         + Call service function getEmail() by email and function getBarcode() by barcode
        Author: Lam
    */
    getUser(): void{
        let email;
        let barcode;
        this.route.params.subscribe(params => {
            email = params.email;
            barcode = params.barcode;
        });

        this.linkCardService.getEmail(email).subscribe(
            (data_app) => {
                this.user_app = data_app;
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
        this.linkCardService.getBarcode(barcode).subscribe(
            (data_embed) => {
                this.user_embed = data_embed;
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        Function deleteLinkCardEvent(): confirm delete
        @author: Lam
    */
    deleteLinkCardEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Thẻ Liên Kết này?",
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
         + Get id user app
         + Call service function onDelete() by id to delete link card
        Author: Lam
    */
    onDelete(): void{
        const id = this.user_app.id;
        this.linkCardService.delLinkCard(id).subscribe(
            (data) => {
                this.toastr.success(`Xóa thẻ liên kết thành công.`);
                this.router.navigate(['/link-card-list']); // redirect list link card
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

}
