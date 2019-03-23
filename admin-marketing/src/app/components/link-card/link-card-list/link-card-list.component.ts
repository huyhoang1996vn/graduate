import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { LinkCardService } from '../../../shared/services/link-card.service';
import { User } from '../../../shared/class/user';
import { ToastrService } from 'ngx-toastr';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { data_config } from '../../../shared/commons/datatable_config';
import { HandleError } from '../../../shared/commons/handle_error';
declare var bootbox: any;
declare var $: any;

@Component({
    selector: 'app-link-card-list',
    templateUrl: './link-card-list.component.html',
    styleUrls: ['./link-card-list.component.css'],
    providers: [LinkCardService]
})
export class LinkCardListComponent implements OnInit {

    dtOptions: any = {};
    link_cards: User[];

    length_all: Number = 0;
    length_selected: Number = 0;

    errorMessage: string;
    record: string = "Thẻ Liên Kết";

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    // Using trigger becase fetching the list of link_cards can be quite long
    // thus we ensure the data is fetched before rensering
    // dtTrigger: Subject<any> = new Subject();
    constructor(
        private route: ActivatedRoute,
        private linkCardService: LinkCardService,
        private router: Router,
        private toastr: ToastrService,
        private handleError:HandleError
    ) {
    }

    ngOnInit() {
        // Customize DataTable
        this.dtOptions = data_config(this.record);
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            order: [7, 'desc'],
            columnDefs: [
                {
                    // Hidden the second column
                    targets: 1,
                    visible: false,
                    searchable: false,
                },
                {
                    // Disable ordering the first column
                    orderable: false,
                    targets: 0
                },
            ]
        };
        this.dtOptions = { ...this.dtOptions, ...dt_options_custom };
        this.getAllLinkCards();
    }

    /*
        GET: get all link_card
        Call api service link.card
        @author: TrangLe
     */
    getAllLinkCards() {
        this.linkCardService.getAllLinkedUsers().subscribe(
            (result) => {
                this.link_cards = result;
                this.length_all = this.link_cards.length;
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        )
    }


    /*
        Confirm Delete Checkbox Selected
        Using bootbox plugin
        @author: Trangle
     */
    confirmDelete() {
        /* Check link_card_del not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if (this.length_selected > 0) {
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " Thẻ Liên Kết đã chọn?",
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
                        this.deleteLinkCardCheckbox()
                    }
                }
            });
        } else {
            this.toastr.warning(`Vui lòng chọn Thẻ Liên Kết để xóa`);
        }
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
        Function: Delete all selected
        Get list id link_card selected, convert array to number
        Call deleteAllUserLinkedSelected from link_card.service
        Sucess:
            + Show success message
            + Remove link_card selected UI
            + Reset length_all, length_selected
        Fail: Return error
        @author: TrangLe
     */

    deleteLinkCardCheckbox() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list link_card id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list link_card selected
            this.linkCardService.deleteAllUserLinkedSelected(list_id_selected).subscribe(
                (data) => {
                    this.toastr.success(`Xóa ${this.length_selected} Thẻ Liên Kết thành công`);

                    // Remove all link_card selected on UI
                    dtInstance.rows('.selected').remove().draw();
                    // Reset count link_card
                    this.length_all = dtInstance.rows().count();
                    this.length_selected = 0;
                },
                (error) => {
                    this.handleError.handle_error(error);
                });
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
