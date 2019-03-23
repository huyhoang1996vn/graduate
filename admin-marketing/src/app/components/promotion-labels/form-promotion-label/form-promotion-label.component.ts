import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PromotionLabel } from '../../../shared/class/promotion-label';
import { PromotionLabelService } from '../../../shared/services/promotion-label.service';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';
import { HandleError } from '../../../shared/commons/handle_error';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'form-promotion-label',
    templateUrl: './form-promotion-label.component.html',
    styleUrls: ['./form-promotion-label.component.css'],
    providers: [PromotionLabelService]
})
export class FormPromotionLabelComponent implements OnInit {

    /*
        author: Lam
    */

    promotion_label: PromotionLabel;

    formPromotionLabel: FormGroup;

    errorMessage :any; // Messages error

    lang = 'vi';
    title_page = '';

    constructor(
        private promotionLabelService: PromotionLabelService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
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

        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title_page = "Chỉnh Sửa Nhãn Khuyến Mãi";
            this.getPromotionLabel();
        } else {
            // Add new Form
            this.title_page = "Thêm Nhãn Khuyến Mãi";
            this.promotion_label = new PromotionLabel();
            this.creatForm();
        }
    }

    /*
        Function getFaq():
         + Get id from url path
         + Call service function getPromotionLabel() by id
         + Later, call createForm()
        Author: Lam
    */
    getPromotionLabel(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.promotionLabelService.getPromotionLabel(id, this.lang).subscribe(
            (data) => {
                this.promotion_label = data;
                this.creatForm();
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
        this.formPromotionLabel = this.fb.group({
            name: [this.promotion_label.name, [Validators.required, Validators.maxLength(255)]]
        });
    }

    /*
        Function onSubmit():
         + Call service function updatePromotionLabel use http put
         + Later, success then redirect faq/list with messsage, fail show error
        author: Lam
    */ 
    onSubmit(): void{
        // case form invalid, show error fields, scroll top
         if(this.formPromotionLabel.invalid){
            ValidateSubmit.validateAllFormFields(this.formPromotionLabel);
        }else{
            // case update
            if(this.promotion_label.id){
                this.promotionLabelService.updatePromotionLabel(this.formPromotionLabel.value, this.promotion_label.id, this.lang)
                .subscribe(
                    (data) => {
                        this.toastr.success(`Chỉnh sửa "${this.formPromotionLabel.value.name}" thành công`);
                        this.router.navigate(['/promotion-label/list']);
                    },
                    (error) => {
                        // code 400, error validate
                        if(error.status == 400){
                            this.errorMessage = error.json().message;
                        }else{
                            this.handleError.handle_error(error);;
                        }
                    }
                );
            }else{
                this.promotionLabelService.addPromotionLabel(this.formPromotionLabel.value, this.lang).subscribe(
                    (data) => {
                        this.toastr.success(`Thêm mới "${this.formPromotionLabel.value.name}" thành công`);
                        this.router.navigate(['/promotion-label/list']);
                    },
                    (error) => {
                        // code 400, error validate
                        if(error.status == 400){
                            this.errorMessage = error.json().message;
                        }else{
                            this.handleError.handle_error(error);;
                        }
                    }
                );
            }
        }            
    }

    /*
        Function deleteNotificationEvent(): confirm delete
        @author: Lam
    */
    deletePromotionLabelEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Nhãn Khuyến Mãi này?",
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
        const id = this.promotion_label.id;
        this.promotionLabelService.onDelPromotionLabel(id, this.lang).subscribe(
            (data) => {
                this.toastr.success(`Xóa "${this.formPromotionLabel.value.name}" thành công`);
                this.router.navigate(['/promotion-label/list']);
            },
            (error) => {
                this.handleError.handle_error(error);;
            }
        );
    }

}
