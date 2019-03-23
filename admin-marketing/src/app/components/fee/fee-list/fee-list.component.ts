import { Component, OnInit, ViewChild } from '@angular/core';
import { Fee } from '../../../shared/class/fee';
import { FeeService } from '../../../shared/services/fee.service';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import * as datatable_config from '../../../shared/commons/datatable_config';
import { ToastrService } from 'ngx-toastr';
import { HandleError } from '../../../shared/commons/handle_error';
declare var bootbox: any;

@Component({
    selector: 'app-fee-list',
    templateUrl: './fee-list.component.html',
    styleUrls: ['./fee-list.component.css']
})
export class FeeListComponent implements OnInit {

    constructor(
        private feeService: FeeService, 
        private router: Router, 
        private toastr: ToastrService,
        private handleError:HandleError
        ) {

    }

    // author: Hoangnguyen

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    // data for datatable render
    fees: Fee[];
    record: string = "Phí Giao Dịch";
    length_selected: number;
    length_all: number;

    // action when hover
    hoverIn(fee) {
        fee.isHover = true;
    }
    hoverOut(fee) {
        fee.isHover = false;
    }

    // when get data, set value for fees, trigger data table
    getFees() {
        return this.feeService.getFees().subscribe(
            success => {
                this.fees = success;
                this.length_all = success.length;
            },
            error => {
                this.handleError.handle_error(error);
            });
    }
    /*
     Event select checbox on row
         Case1: all row are checked then checkbox all on header is checked
         Case1: any row is not checked then checkbox all on header is not checked
     @author: hoangnguyen 
   */
    selectCheckbox(event) {
        $(event.target).closest("tr").toggleClass("selected");
        this.getLengthSelected();
        this.checkSelectAllCheckbox();
    }
    /*
      event auto checked/unchecked checkall
      @author: hoangnguyen 
    */
    checkSelectAllCheckbox() {
        if($('#table_id tbody tr').hasClass('selected')){
            $('#select-all').prop('checked', $("#table_id tr.row-data:not(.selected)").length == 0);
        }else{
            $('#select-all').prop('checked', false);
        }
        this.getLengthSelected();
    }
    /*
      Event select All Button on header table
      @author: hoangnguyen 
    */
    selectAllEvent(event) {
        if (event.target.checked) {
            $("#table_id tr").addClass('selected');
        } else {
            $("#table_id tr").removeClass('selected');
        }
        $("#table_id tr input:checkbox").prop('checked', event.target.checked);
        this.getLengthSelected();
    }
    /*
      Event select All Button on header table
      @author: hoangnguyen 
    */
    getLengthSelected() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            this.length_selected = dtInstance.rows('.selected').count();
        })
    }
    /*
      confirm_delete FUNCTION
      if length_selected exist show popup confirm
      else show popup alert
      author: Hoangnguyen
    */
    confirm_delete() {
        let self = this;
        if (this.length_selected > 0) {
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " Phí Giao Dịch đã chọn?",
                buttons: {
                    cancel: {
                        label: "HỦY"
                    },
                    confirm: {
                        label: "XÓA"
                    }
                },
                callback: function(result) {
                    /* result is a boolean; true = OK, false = Cancel*/
                    if (result) {
                        self.deleteFee();
                    }
                }
            })
        } else {
            this.toastr.warning(`Vui lòng chọn Phí Giao Dịch cần xóa`);
        }
    }
    /*
      deleteFee FUNCTION
      author: Hoangnguyen
    */
    deleteFee() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list promotion id selected
            let list_id_selected = dtInstance.cells('.selected', 1).data().toArray();
            this.feeService.deleteListFee(list_id_selected).subscribe(
                (data) => {
                    // Remove all promotion selected on UI
                    dtInstance.rows('.selected').remove().draw();
                    // Reset count promotion
                    this.length_all = dtInstance.rows().count();
                    this.toastr.success(`Xóa ${this.length_selected} Phí Giao Dịch thành công`);
                    this.length_selected = 0;
                },
                (error) => {
                    this.handleError.handle_error(error);
                }
            );
        });

    }

    /*
       apply_fee FUNCTION
       find fee which clicked
       for item in fees
       if item is apply and same position with found fee, cancel apply
       set found fee is apply
       author: Hoangnguyen
    
    */
    apply_fee(id: number) {
        this.feeService.applyFee(id).subscribe(
            success => {
                var fee = this.fees.find(fee => fee.id == id);
                this.fees.filter(item => {
                    if (item.is_apply == true && item.position == fee.position)
                        item.is_apply = false;
                });
                fee.is_apply = true;
            },
            error => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
       cancel_apply_fee FUNCTION
       cancel appply fee
       author: Hoangnguyen
    */
    cancel_apply_fee(id: number) {
        this.feeService.applyFee(id).subscribe(
            success => {
                var fee = this.fees.find(fee => fee.id == id);
                if (fee.is_apply) {
                    fee.is_apply = false;
                }
            },
            error => {
                this.handleError.handle_error(error);
            }
        );
    }


    ngOnInit() {
        this.getFees();
        this.dtOptions = datatable_config.data_config('Phí Giao Dịch');
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            columnDefs: [
                {
                    targets: 1,
                    visible: false,
                    searchable: false
                },
                {   
                    targets: 0,
                    orderable: false,
                    searchable: false
                }
            ]
        };
        this.dtOptions = { ...this.dtOptions, ...dt_options_custom };
    }

}
