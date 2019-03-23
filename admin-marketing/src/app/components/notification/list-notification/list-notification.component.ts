import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { Notification } from '../../../shared/class/notification';
import { NotificationService } from '../../../shared/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { VariableGlobals } from './../../../shared/commons/variable_globals';
import { User } from '../../../shared/class/user';
import 'rxjs/add/observable/throw';
import * as datatable_config from '../../../shared/commons/datatable_config';
import * as CONSTANT from './../../../shared/commons/constant';
import { HandleError } from '../../../shared/commons/handle_error';
declare var bootbox:any;

@Component({
    selector: 'app-list-notification',
    templateUrl: './list-notification.component.html',
    styleUrls: ['./list-notification.component.css'],
    providers: [NotificationService]
})
export class ListNotificationComponent implements OnInit {

    /*
        Author: Lam
    */

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: any = {};

    length_all: Number = 0;
    length_selected: Number = 0;

    notifications: Notification[];
    user_current: User;

    lang: string = 'vi';
    SYSTEM_ADMIN: number;

    constructor(
        private notificationService: NotificationService, 
        private router: Router,
        private variable_globals: VariableGlobals,
        private toastr: ToastrService,
        private handleError:HandleError
    ) { }

    ngOnInit() {
        this.dtOptions = datatable_config.data_config('Thông Báo');
        // custom datatable option
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            columnDefs: [
                { 
                    orderable: false, 
                    targets: 0 
                }
            ]
        };
        // create new object from 2 object use operator spread es6
        this.dtOptions = {...this.dtOptions, ...dt_options_custom };

        this.SYSTEM_ADMIN = CONSTANT.SYSTEM_ADMIN;
        this.getNotifications();
        // get current user
        this.user_current = this.variable_globals.user_current;
    }

    /*
        Function getNotifications(): Callback service function getNotifications() get all Notification
        Author: Lam
    */
    getNotifications(){
        this.notificationService.getNotifications(this.lang).subscribe(
            (data) => {
                this.notifications = data;
                this.length_all = this.notifications.length;
            },
            (error) => {
                this.handleError.handle_error(error);;
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
            $('#select-all').prop('checked', $("#table_id tr.row-data:not(.selected)").not("#table_id .disabled_checkbox").length == 0);
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
            if($("#table_id tr").hasClass('disabled_checkbox')){
                $("#table_id .disabled_checkbox").removeClass('selected');
            }
        } else {
            $("#table_id tr").removeClass('selected');
        }
        $("#table_id tr input:checkbox").not("#table_id .disabled_checkbox input:checkbox").prop('checked', event.target.checked);
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
        Function deleteNotificationEvent(): confirm delete
        @author: Lam
    */
    deleteNotificationEvent(){
        let that = this;
        if ( this.length_selected > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " Thông Báo đã chọn?",
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
                        that.onDelelteNoti();
                    }
                }
            });

        } else  {
            this.toastr.warning(`Vui lòng chọn Thông Báo cần xóa`);
        }
        
    }

    /*
        Function onDelelteNoti(): 
         + Callback service function onDelNotiSelect() delete notification by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDelelteNoti(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list promotion id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list promotion selected
            this.notificationService.onDelNotiSelect(list_id_selected, this.lang).subscribe(
                (data) => {
                    if (data.code === 204) {
                        this.toastr.success(`Xóa ${this.length_selected} Thông Báo thành công`);

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
                    this.handleError.handle_error(error);;
                });
        });
    }

    /*
        Function changeLang(): Change language and callback service getEvents()
        Author: Lam
    */
    changeLang(value){
        if(this.lang !== value){
            $('.custom_table').attr('style', 'height: 640px');
            this.notifications = null;
            this.lang = value;
            this.getNotifications();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

}
