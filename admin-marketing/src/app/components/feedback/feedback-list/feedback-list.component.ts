import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Feedback } from '../../../shared/class/feedback';
import { FeedbackService } from '../../../shared/services/feedback.service';

import { Subject } from 'rxjs/Subject';
import { data_config } from '../../../shared/commons/datatable_config';
import { HandleError } from '../../../shared/commons/handle_error';

declare var bootbox: any;

@Component({
    selector: 'app-feedback-list',
    templateUrl: './feedback-list.component.html',
    styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {

    dtOptions: any = {};
    feedbacks: Feedback[];
    // list feeadback id is readed
    feedbacks_is_read:number[];

    length_all: Number = 0;
    length_selected: Number = 0;

    errorMessage: string;
    record: string = "Phản Hồi";
    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    // Using trigger becase fetching the list of feedbacks can be quite long
    // thus we ensure the data is fetched before rensering
    // dtTrigger: Subject<any> = new Subject();
    constructor(
        private feedbackService: FeedbackService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private handleError:HandleError
    ) {
    }


    ngOnInit() {
        // Call dataTable
        this.dtOptions = data_config(this.record);

        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            // order: [[ 2, 'asc' ], [ 3, 'asc' ]],
            columnDefs: [
                {
                    // Hiden the second column
                    visible: false,
                    targets: 1,
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

        this.route.queryParams.subscribe(
            params => {
                this.feedbackService.getFeedbackFilter(params).subscribe(
                    (result) => {
                        this.feedbacks = result.feedbacks;
                        this.length_all = this.feedbacks.length;
                        this.feedbacks_is_read = result.feedbacks_is_read;
                        // this.dtTrigger.next();
                    },
                    (error) => {
                        this.handleError.handle_error(error);
                    }
                )
            });
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
        Confirm Delete Checkbox Selected
        Using bootbox plugin
        @author: Trangle
     */
    confirmDelete() {
        /* Check feedback_del not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if (this.length_selected > 0) {
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " Phản Hồi đã chọn?",
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
                        this.deleteFeedbackCheckbox()
                    }
                }
            });
        } else {
            this.toastr.warning(`Vui lòng chọn Phản Hồi cần xóa`);
        }
    }

    /*
        DELETE: Delete All Selected Checkbox
        Get list array id feedback selected, convert array to number
        Call deleteAllFeedbackChecked from feeback.service
        Success: Show success message
        @author: Trangle
     */
    deleteFeedbackCheckbox() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list feedback id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list feedback selected
            this.feedbackService.deleteAllFeedbackChecked(list_id_selected).subscribe(
                (data) => {
                    this.toastr.success(`Xóa ${this.length_selected} Phản Hồi thành công`);

                    // Remove all feedback selected on UI
                    dtInstance.rows('.selected').remove().draw();
                    // Reset count feedback
                    this.length_all = dtInstance.rows().count();
                    this.length_selected = 0;
                },
                (error) => {
                    this.handleError.handle_error(error);
                }
            );
        });
    }
}
