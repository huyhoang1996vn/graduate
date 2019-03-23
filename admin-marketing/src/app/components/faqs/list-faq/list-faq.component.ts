import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { Faq } from '../../../shared/class/faq';
import { FaqService } from '../../../shared/services/faq.service';
import 'rxjs/add/observable/throw';
import { ToastrService } from 'ngx-toastr';
import * as datatable_config from '../../../shared/commons/datatable_config';
import { HandleError } from '../../../shared/commons/handle_error';

declare var bootbox:any;

@Component({
    selector: 'app-list-faq',
    templateUrl: './list-faq.component.html',
    styleUrls: ['./list-faq.component.css'],
    providers: [FaqService]
})
export class ListFaqComponent implements OnInit {

    /*
        Author: Lam
    */

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: any = {};

    length_all: Number = 0;
    length_selected: Number = 0;

    faqs: Faq[];

    lang: string = 'vi';

    constructor(
        private faqService: FaqService, 
        private router: Router,
        private toastr: ToastrService,
        private handleError:HandleError
    ) { }

    ngOnInit() {
        this.dtOptions = datatable_config.data_config('Câu Hỏi Thường Gặp');
        // custom datatable option
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            columnDefs: [
                {
                    targets: 1,
                    visible: false,
                    searchable: false,
                },
                { 
                    orderable: false, 
                    targets: 0 
                }
            ]
        };
        // create new object from 2 object use operator spread es6
        this.dtOptions = {...this.dtOptions, ...dt_options_custom };

        this.getFaqs();
    }

    /*
        Function getFaqs(): Callback service function getFaqs() get all Faq
        Author: Lam
    */
    getFaqs(){
        this.faqService.getFaqs(this.lang).subscribe(
            (data) => {
                this.faqs = data;
                this.length_all = this.faqs.length;
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
        @author: Lam 
    */
    selectCheckbox(event) {   
        $(event.target).closest( "tr" ).toggleClass( "selected" );
        this.getLengthSelected();
        this.checkSelectAllCheckbox();
    }

    // input checkall checked/unchecked
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
        @author: Lam 
    */
    selectAllEvent(event) {
        if( event.target.checked ) {
            $("#table_id tr").addClass('selected');
        } else {
            $("#table_id tr").removeClass('selected');
        }
        $("#table_id tr input:checkbox").prop('checked', event.target.checked);
        this.getLengthSelected();
    }

    /*
        Function getLengthSelected(): draw length selected
        @author: Lam
    */
    getLengthSelected(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            this.length_selected = dtInstance.rows('.selected').count();
        })
    }

    /*
        Function deleteFaqEvent(): confirm delete
        @author: Lam
    */
    deleteFaqEvent(){
        let that = this;
        if ( this.length_selected > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " Câu Hỏi Thường Gặp đã chọn?",
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
                        that.onDelelteFaq();
                    }
                }
            });

        } else  {
            this.toastr.warning(`Vui lòng chọn Câu Hỏi Thường Gặp cần xóa`);
        }
        
    }

    /*
        Function onDelelteFaq(): 
         + Callback service function onDelelteFaq() delete faq by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDelelteFaq(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list promotion id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list promotion selected
            this.faqService.onDelFaqSelect(list_id_selected, this.lang).subscribe(
                (data) => {
                    if (data.code === 204) {
                        this.toastr.success(`Xóa ${this.length_selected} Câu Hỏi Thường Gặp thành công`);

                        // Remove all promotion selected on UI
                        dtInstance.rows('.selected').remove().draw();
                        // Reset count promotion
                        this.length_all =  dtInstance.rows().count();
                        this.length_selected = 0;
                    } else {
                        this.handleError.handle_error(data);
                    }
                }, 
                (error) => {
                    this.handleError.handle_error(error);
                });
        });
    }

    /*
        Function changeLang(): Change language and callback service getFaqs()
        Author: Lam
    */
    changeLang(value){
        if(this.lang !== value){
            $('.custom_table').attr('style', 'height: 640px');
            this.faqs = null;
            this.lang = value;
            this.getFaqs();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

}
