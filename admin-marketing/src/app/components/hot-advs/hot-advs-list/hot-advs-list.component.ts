import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HotAdvs } from '../../../shared/class/hot-advs';
import { HotAdvsService } from '../../../shared/services/hot-advs.service';

import { data_config } from '../../../shared/commons/datatable_config';
import { HandleError } from '../../../shared/commons/handle_error';

declare var bootbox: any;

@Component({
    selector: 'app-hot-advs-list',
    templateUrl: './hot-advs-list.component.html',
    styleUrls: ['./hot-advs-list.component.css'],
    providers: [HotAdvsService],
})
export class HotAdvsListComponent implements OnInit {

    dtOptions: any = {};

    hot_advs: HotAdvs[];

    length_all: Number = 0;
    length_selected: Number = 0;

    record: String = "Hot Ads";
    lang: string = 'vi';

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    // Using trigger becase fetching the list of feedbacks can be quite long
    // thus we ensure the data is fetched before rensering
    // dtTrigger: Subject<any> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private hotAdvsSerice: HotAdvsService,
        private router: Router,
        private toastr: ToastrService,
        private handleError:HandleError
    ) {
    }

    ngOnInit() {
        this.dtOptions = data_config(this.record);
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            columnDefs: [
                {
                    // Hide the second colum
                    targets: 1,
                    visible: false,
                    searchable: false,
                },
                {
                    // Disable ordering the first colum
                    orderable: false,
                    targets: 0
                },
            ]
        };
        this.dtOptions = { ...this.dtOptions, ...dt_options_custom };
        this.getHotAdvs();
    }
    /*
        Get Hot Ads
        Call getAllHotAdvs from hot_advs.service
        success: Return objects hot_advs
        Fail: nagivate componet error show error message
        @author: Trangle
     */
    getHotAdvs() {
        this.hotAdvsSerice.getAllHotAdvs(this.lang).subscribe(
            (result) => {
                this.hot_advs = result;
                this.length_all = this.hot_advs.length; // Set length_all
                // this.dtTrigger.next();
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        )
    }
    /*
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: TrangLe 
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
        @author: TrangLe 
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
        @author: TrangLe
    */
    getLengthSelected() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            this.length_selected = dtInstance.rows('.selected').count();
        })
    }

    confirmDelete() {
        /* Check hot_adv_selected not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if (this.length_selected > 0) {
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " Hot Ads đã chọn?",
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
                        this.deleteHotAdvsCheckbox()
                    }
                }
            });
        } else {
            this.toastr.warning(`Vui lòng chọn Hot Ads để xóa`);
        }
    }
    /*
        Delete hot ads selected
        List array hot ads selected then convert number
        Call deleteHotAdvsSelected from hot_advs.service 
        Success: 
            + Remove hot advs selected UI
            + Reset length_all, length_selected
            + Show message success 
        Fail: nagivate component error show error message
        
     */
    deleteHotAdvsCheckbox() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list hot ads id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list hot ads selected
            this.hotAdvsSerice.deleteHotAdvsSelected(list_id_selected, this.lang).subscribe(
                (data) => {
                    this.toastr.success(`Xóa ${this.length_selected} Hot Ads thành công`);

                    // Remove all hot ads selected on UI
                    dtInstance.rows('.selected').remove().draw();
                    // Reset count hot ads
                    this.length_all = dtInstance.rows().count();
                    this.length_selected = 0;
                },
                (error) => {
                    this.handleError.handle_error(error);
                });
        });
    }

    /*
        Function changeLangVI(): Change language and callback service getEvents()
        Check language (!lang) ->  add style class custom_table
        Set objects banners = null -> call getAllBanners() to show
        Author: Trangle
    */
    changeLang(value) {
        if (this.lang !== value) {
            $('.custom_table').attr('style', 'height: 640px');
            this.hot_advs = null;
            this.lang = value;
            this.getHotAdvs();
            setTimeout(() => {
                $('.custom_table').attr('style', 'height: auto');
            }, 100);
        }
    }

}
