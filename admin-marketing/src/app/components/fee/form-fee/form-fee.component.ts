import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeeService } from '../../../shared/services/fee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NumberValidators } from './../../../shared/validators/number-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { Fee } from '../../../shared/class/fee';
import { HandleError } from '../../../shared/commons/handle_error';

// Using bootbox 
declare var bootbox: any;

@Component({
    selector: 'app-form-fee',
    templateUrl: './form-fee.component.html',
    styleUrls: ['./form-fee.component.css']
})
export class FormFeeComponent implements OnInit {

    constructor(
        private formBuilder: FormBuilder,
        private feeService: FeeService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private handleError:HandleError) {

    }

    feeAddForm: FormGroup;
    messageResult: String;
    errorMessage: String;
    title: String;
    data: String;
    fee: Fee;

    ngOnInit() {
        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title = "Chỉnh Sửa Phí Giao Dịch";
            this.getFee();
        } else {
            // Add new Form
            this.title = "Thêm Phí Giao Dịch";
            this.fee = new Fee()
            this.createForm();
        }
    }

    /*
      Event create fee
      @author: hoangnguyen 
    */
    createFee(value: any) {
        
        if (this.feeAddForm.invalid) {
            ValidateSubmit.validateAllFormFields(this.feeAddForm);
        } else {
            let feeValue = this.convert_format_currency(this.data);
            value.fee = feeValue;
            if(this.fee.id){
                this.feeService.updateFee(value, this.fee.id).subscribe(
                    (result) => {
                        this.router.navigate(['/fee/list']);
                        this.toastr.success(`Chỉnh sửa "${this.data} ${this.upCaseFeeType(this.feeAddForm.value.fee_type)}" thành công`);
                    },
                    (error) => {
                        if (error.status === 400) {
                            this.errorMessage = error.json().message;
                        } else {
                            this.handleError.handle_error(error);
                        }

                    }
                )
            }else{
                this.feeService.createFee(value).subscribe(
                    result => {
                        this.messageResult = "success";
                        this.router.navigate(['/fee/list']);
                        this.toastr.success(`Thêm mới "${this.data} ${this.upCaseFeeType(this.feeAddForm.value.fee_type)}" thành công`);
                    },
                    (error) => {
                        if (error.status === 400) {
                            this.errorMessage = error.json().message;
                        } else {
                            this.handleError.handle_error(error);
                        }
                    }
                );
            }   
        }
    }
    

    createForm() {
        if(this.fee.fee !== null) {
            this.data = this.numberWithCommas(this.fee.fee);
        }

        this.feeAddForm = this.formBuilder.group({
            fee: [this.data, [Validators.required, Validators.maxLength(13), NumberValidators.validateFee]],
            position: [this.fee.position, Validators.required],
            fee_type: [this.fee.fee_type ? this.fee.fee_type : 'vnd', Validators.required],
            is_apply: [this.fee.is_apply === true ? true : false],
        });
    }

    getFee() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.feeService.getFee(id).subscribe(
            (result) => {
                this.fee = result;
                this.createForm();
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        )
    }

    /*
        Confirm Delete Detail Fee
        @author: Trangle
     */
    confirmDelete(fee: Fee) {
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Phí Giao Dịch này?",
            buttons: {
                cancel: {
                    label: "HỦY"
                },
                confirm: {
                    label: "XÓA"
                }
            },
            callback: (result) => {
                if (result) {
                    // Check result = true. call function callback
                    this.deleteFeeById(fee)
                }
            }
        });
    }

    /*
        DELETE fee By Id
        @author: Trangle
     */
    deleteFeeById(fee: Fee) {
        this.feeService.deleteFeeById(fee.id).subscribe(
            () => {
                this.toastr.success(`Xóa "${fee.fee}" thành công`);
                this.router.navigate(['/fee/list']);
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        )
    }
    /*
        format fee
        @author: Trangle
    */
    format_currency(nStr) {
        this.errorMessage='';
        // Convert number to format currency
        this.data = nStr.replace(/,/g, "").toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    /*
        Convert format denominatio before send server
        @author: Trangle
     */
    convert_format_currency(number) {
        // Conver format currency from form to number. Save databse
        return number ? number.replace(/,/g, ''): number;
    }

    /*
        Function: Number format with comma
     */
    numberWithCommas(x) {
        return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
    }

    /*
        remove message from server
     */
    removeMessage() {
        this.errorMessage = '';
    }

    /*
        Change value fee_type from vnd to VNĐ
     */
    upCaseFeeType(fee_type) {
        if (fee_type == 'vnd') {
            return 'VNĐ'
        } else {
            return fee_type
        }
    }
}
