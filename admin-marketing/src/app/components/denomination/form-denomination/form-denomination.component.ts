import { Component, OnInit } from '@angular/core';

import { Denomination } from '../../../shared/class/denomination';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';

import { DenominationService } from '../../../shared/services/denomination.service';
import { Router, ActivatedRoute } from "@angular/router";
import { DenominationValidators } from './../../../shared/validators/denomination-validators';
import { HandleError } from '../../../shared/commons/handle_error';

declare var bootbox: any;
@Component({
    selector: 'app-form-denomination',
    templateUrl: './form-denomination.component.html',
    styleUrls: ['./form-denomination.component.css']
})
export class FormDenominationComponent implements OnInit {

    denominations: Denomination[] = [];
    denomination: Denomination;
    errorMessage: string;
    title: string;

    denoForm: FormGroup; // denoForm is type of FormGroup
    data: string = '';

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private denominationService: DenominationService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private handleError:HandleError

    ) { }

    ngOnInit() {
        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title = "Chỉnh Sửa Mệnh Giá Nạp Tiền";
            this.getDenomintion();
        } else {
            // Add new Form
            this.title = "Thêm Mệnh Giá Nạp Tiền";
            this.denomination = new Denomination()
            this.createForm();
        }
    }

    /*
        Create form to add new denomination
        @author: Trangle
     */
    createForm() {
        if(this.denomination.denomination){
            this.data = this.numberWithCommas(this.denomination.denomination);
        };
        this.denoForm = this.fb.group({
            // The FormControl call denomination
            denomination: [this.data, [Validators.required, Validators.maxLength(13), DenominationValidators.denominationValidators]],
        });
    }

    /*
        get denomination detal
     */
    
    getDenomintion() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.denominationService.getDenominationById(id).subscribe(
            (result) => {
                this.denomination = result;
                this.createForm();
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }
    /* 
        Add Denomination
        Step1: Check denoForm invalid true => Show error message
        Step2: Call service denomination when denoForm valid
            + Convert denomi to inter before send server
            + call createDenomination form denomination.service
            + Success: Push data, show success message and nagivate denomination_list
            + False: Show error message
        @author: Trangle
    */
    addDenomination(denomination: any) {
        if (this.denoForm.invalid) {
            ValidateSubmit.validateAllFormFields(this.denoForm);
        } else {
            let denomi = this.convert_format_currency(this.data);
            denomination.denomination = denomi
            if(this.denomination.id){
                this.denominationService.updateDenomination(denomination, this.denomination.id).subscribe(
                    (result) => {
                        this.toastr.success(`Chỉnh sửa "${this.data}" thành công`);
                        this.router.navigate(['/denomination-list'])
                    },
                    (error) => {
                        if (error.status == 400) {
                            this.errorMessage = error.json()
                        }else {
                            this.handleError.handle_error(error);
                        }
                    }      
                )
            }else{
                this.denominationService.createDenomination(denomination).subscribe(
                    (denomination) => {
                        this.denominations.push(denomination);
                        this.toastr.success(`Thêm "${this.data}" thành công`);
                        this.router.navigate(['/denomination-list'])
                    },
                    (error) => {
                        if (error.status == 400) {
                            this.errorMessage = error.json()
                        }else {
                            this.handleError.handle_error(error);
                        }
                    }
                )
            }
            
        }
    }

    /*
        Confirm Delete 
        Using libary: bootbox
        @author: TrangLe
    */

    confirmDelete(denomination: Denomination) {
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Mệnh Giá Nạp Tiền này?",
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
                    this.deleteDenomiById(denomination)
                }
            }
        });
    }

    /*
        DELETE: Delete Denomination By Id
        @author: Trangle
     */
    deleteDenomiById(denomi: Denomination) {
        this.denominationService.deleteDenominationByid(denomi.id).subscribe(
            () => {
                this.toastr.success(`Xóa "${denomi.denomination}" thành công`);
                this.router.navigate(['/denomination-list']);
            },
            error => {
                this.handleError.handle_error(error);
            }
        );
    }
    /* 
        Return errorMessage = '', when click input tag 
        @author: Trangle
    */
    removeMessage() {
        this.errorMessage = '';
    }

    /*
        format denomination
        @author: Trangle
     */
    format_currency(nStr) {
        this.errorMessage = '';
        // Convert number to format currency
        this.data = nStr.replace(/,/g, "").toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    /*
        Convert format denominatio before send server
        @author: Trangle
     */
    convert_format_currency(number) {
        // Conver format currency from form to number. Save databse
        var denomi = number.replace(/,/g, '');
        return denomi;
    }

    /*
        Function: Number format with comma
     */
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
