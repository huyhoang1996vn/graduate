import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Advertisement } from '../../../shared/class/advertisement';

import { AdvertisementService } from '../../../shared/services/advertisement.service';
import { data_config } from '../../../shared/commons/datatable_config';
import { HandleError } from '../../../shared/commons/handle_error';

// Using bootbox plugin
declare var bootbox: any;

@Component({
    selector: 'app-advertisement-list',
    templateUrl: './advertisement-list.component.html',
    styleUrls: ['./advertisement-list.component.css']
})
export class AdvertisementListComponent implements OnInit {

    dtOptions: any = {};

    advs: Advertisement[];

    length_all: Number = 0;
    length_selected: Number = 0;

    record: string = "Quảng Cáo";
    lang: string = 'vi';

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    /*
        Using trigger becase fetching the list of feedbacks can be quite long
        thus we ensure the data is fetched before rensering
    */
    // dtTrigger: Subject<any> = new Subject();

    constructor(
        private advertisementService: AdvertisementService,
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
            columnDefs: [
                {
                    // Hiden column the second and search false
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

        // Call function get all adv
        this.getAllAdvertisement();
    }
    /*
    GET: Get All Advertiment To Show
    Call method form advertiment service
    True: Return objects value
    Fasle: handle Error
    @author: TrangLe 
*/
    getAllAdvertisement() {
        this.advs = null;
        this.advertisementService.getAllAdvertisement(this.lang).subscribe(
            (result) => {
                this.advs = result;
                this.length_all = this.advs.length; // Set length_all
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

    /*
        Confirm Delete Checkbox Selected
        Using bootbox plugin
        @author: Trangle
     */
    confirmDelete() {
        /* Check advs_delete not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if (this.length_selected > 0) {
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " Quảng Cáo đã chọn?",
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
                        this.deleteAllCheckAdvs()
                    }
                }
            });
        } else {
            this.toastr.warning(`Vui lòng chọn Quảng Cáo cần xóa`);
        }
    }

    /*
        DELETE: Delete All Select Box Checked 
        Call service advertiment
        @author: Trangle  
     */
    deleteAllCheckAdvs() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list promotion id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list promotion selected
            this.advertisementService.deleteAllAdvsSelected(list_id_selected, this.lang).subscribe(
                (data) => {
                    this.toastr.success(`Xóa ${this.length_selected} Quảng Cáo thành công`);

                    // Remove all promotion selected on UI
                    dtInstance.rows('.selected').remove().draw();
                    // Reset count promotion
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
       Author: TrangLe
   */
    changeLang(value) {
        if (this.lang !== value) {
            $('.custom_table').attr('style', 'height: 640px');
            this.lang = value;
            this.getAllAdvertisement();
            setTimeout(() => {
                $('.custom_table').attr('style', 'height: auto');
            }, 100);
        }
    }
}
