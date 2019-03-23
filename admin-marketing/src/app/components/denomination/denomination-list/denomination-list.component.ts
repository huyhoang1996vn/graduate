import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';

import { Denomination } from '../../../shared/class/denomination';
import { ToastrService } from 'ngx-toastr';

import { DenominationService } from '../../../shared/services/denomination.service';
import { data_config } from '../../../shared/commons/datatable_config';
import { HandleError } from '../../../shared/commons/handle_error';
declare var bootbox: any;

@Component({
    selector: 'app-denomination-list',
    templateUrl: './denomination-list.component.html',
    styleUrls: ['./denomination-list.component.css']
})
export class DenominationListComponent implements OnInit {

    dtOptions: any = {};
    denominations: Denomination[];

    length_all: Number = 0;
    length_selected: Number = 0;

    record: string = "Mệnh Giá Nạp Tiền";

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    // Using trigger becase fetching the list of denominations can be quite long
    // thus we ensure the data is fetched before rensering
    // dtTrigger: Subject<any> = new Subject();

    constructor(
        private denominationService: DenominationService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private handleError:HandleError
    ) {
       
    }

    ngOnInit() {
        // Call data_config 
        this.dtOptions = data_config(this.record);
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            columnDefs: [
                {
                    // Hidden the second column
                    targets: 1,
                    visible: false,
                    searchable: false,
                },
                {
                    // Disable ordering on the first column
                    orderable: false,
                    targets: 0
                },
            ]
        };
        this.dtOptions = { ...this.dtOptions, ...dt_options_custom };

        this.getAllDenomination();
    }
	/* 
        Get All Denomination
        Call getAllDenomination from denomination.service
        Success: Return objects denominations
        Fail: nagivate component error show error message
        @author: Trangle
    */
    getAllDenomination() {
        this.denominationService.getAllDenomination().subscribe(
            (result) => {
                this.denominations = result;
                this.length_all = this.denominations.length; // Set length_all
                // this.dtTrigger.next();
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }
	/*
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: Trangle 
    */
    selectCheckbox(event) {
        $(event.target).closest("tr").toggleClass("selected");
        this.getLengthSelected();
        this.checkSelectAllCheckbox();
    }

    // input checkall checked/unchecked
    checkSelectAllCheckbox() {
        if ($('#table_id tbody tr').hasClass('selected')) {
            $('#select-all').prop('checked', $("#table_id tr.row-data:not(.selected)").length == 0);
        } else {
            $('#select-all').prop('checked', false);
        }
        this.getLengthSelected();
    }
    /*
        Event select All Button on header table
        @author: Trangle 
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
        Function getLengthSelected(): draw length selected
        @author: Trangle
    */
    getLengthSelected() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            this.length_selected = dtInstance.rows('.selected').count();
        })
    }

    /*
        Show message confirm before delete
        Using library bootbox to show 
        @author: Trangle
     */
    confirmDelete() {
        /* Check deno_selected not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if (this.length_selected > 0) {
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " Mệnh Giá Nạp Tiền đã chọn?",
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
                        // Check result = true. call function
                        this.deleteDenominationCheckbox()
                    }
                }
            });
        } else {
            this.toastr.warning(`Vui lòng chọn Mệnh Giá Nạp Tiền để xóa`);
        }
    }

	/* 
        Delete All select checkbox
        Get list id selected=> convert to number
        Call deleteAllDenosSelected from denomintion.service
        Success: 
            + Show success message
            + Remove all denomination which selected
            + Reset length_all and length_selected
        Fail: nagivate component error show error message
        @author: Trangle
    */
    deleteDenominationCheckbox() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list denomination id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list denomination selected
            this.denominationService.deleteAllDenosSelected(list_id_selected).subscribe(
                (data) => {
                    this.toastr.success(`Xóa ${this.length_selected} Mệnh Giá Nạp Tiền thành công`);

                    // Remove all denomination selected on UI
                    dtInstance.rows('.selected').remove().draw();
                    // Reset count denomination
                    this.length_all = dtInstance.rows().count();
                    this.length_selected = 0;
                },
                (error) => {
                    this.handleError.handle_error(error);
                });
        });
    }
}
