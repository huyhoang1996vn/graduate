import { Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { VariableGlobals } from './../../shared/commons/variable_globals';
import { User } from '../../shared/class/user';
import { Notification } from './../../shared/class/notification';
import { Promotion } from './../../shared/class/promotion';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
    selector: 'app-user-multiselect',
    templateUrl: './user-multiselect.component.html',
    styleUrls: ['./user-multiselect.component.css']
})
/*
    UserMultiselectComponent
    @author: diemnguyen
*/
export class UserMultiselectComponent implements OnInit {

    @ViewChildren(DataTableDirective)
    dtElements: QueryList<DataTableDirective>;

    dtOptions_left: any = {};
    dtOptions_right: any = {};

    @Input('user_list_left') 
    user_list_left: User[];

    @Input('user_list_right') 
    user_list_right: User[] = [];

    @Input('notification') 
    notification: Notification;

    @Input('promotion') 
    promotion: Promotion;

    @Input('is_disable_notification') 
    is_disable_notification: boolean;

    @Input('is_disable_promotion') 
    is_disable_promotion: boolean;


    @Output()
    save: EventEmitter<number[]> = new EventEmitter<number[]>();

    current_user: User;

    is_button_left: boolean = false;
    is_button_rigth: boolean = false;

    constructor(
        private variableGlobals: VariableGlobals,
        private datePipe: DatePipe,
    ) { }

    ngOnInit() {
        this.dtOptions_left = {
            pagingType: "full_numbers",
            columnDefs: [
                {
                    orderable: false,
                    className: "dt-center",
                    targets: 0
                },
                {
                    targets: 1,
                    visible: false
                }
            ], 
            order: [[ 2, 'asc' ]],
            scrollY: "400px",
            scrollCollapse: true,
            language: {
                sSearch: "",
                sInfoFiltered: "",
                searchPlaceholder: "Nhập thông tin tìm kiếm",
                lengthMenu: "Hiển thị _MENU_ dòng",
                sZeroRecords:  "Không có user nào để hiển thị",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_",
                infoEmpty: "Hiển thị 0 đến 0 của 0",
                paginate: {
                    'first': "Đầu",
                    'last': "Cuối",
                    'next': "Sau",
                    'previous': "Trước"
                }
            },
            "sDom": "<'row'<'col-md-12'f><'col-md-12 info_search'><'col-md-12'l>>rt<'row'<'col-md-12'i>p>",
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                $('td', row).find('input:checkbox').off().bind('change', event => {
                    this.selectCheckboxLeft(event);
                });
                return row;
            },
            drawCallback: (setting) => {
                this.checkSelectAllCheckboxLeft(); 
            },
            initComplete: function () {
                // add html in table except user-permission page
                if(!$(".wrapper-permission").length){
                    $('.info_search').html('<i class="fa fa-exclamation-circle"></i> Để tìm kiếm ngày sinh bạn cần gõ từ khóa tìm kiếm kèm theo dấu /');
                }
            }
        }
        
        this.dtOptions_right = {
            pagingType: "full_numbers",
            columnDefs: [
                {
                    orderable: false,
                    className: "dt-center",
                    targets: 0
                },
                {
                    targets: 1,
                    visible: false
                }
            ], 
            order: [[ 2, 'asc' ]],
            scrollY: "400px",
            scrollCollapse: true,
            fixedHeader: true,
            language: {
                sSearch: "",
                sInfoFiltered: "",
                searchPlaceholder: "Nhập thông tin tìm kiếm",
                lengthMenu: "Hiển thị _MENU_ dòng",
                sZeroRecords:  "Không có user nào để hiển thị",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_",
                infoEmpty: "Hiển thị 0 đến 0 của 0",
                paginate: {
                    'first': "Đầu",
                    'last': "Cuối",
                    'next': "Sau",
                    'previous': "Trước"
                }
            },
            "sDom": "<'row'<'col-md-12'f><'col-md-12 info_search'><'col-md-12'l>>rt<'row'<'col-md-12'i>p>",
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                $('td', row).find('input:checkbox').off().bind('change', event => {
                    this.selectCheckboxRight(event);
                });
                return row;
            },
            drawCallback: (setting) => {
                this.checkSelectAllCheckboxRight();
            },
            initComplete: function () {
                // add html in table except user-permission page
                if(!$(".wrapper-permission").length){
                    $('.info_search').html('<i class="fa fa-exclamation-circle"></i> Để tìm kiếm ngày sinh bạn cần gõ từ khóa tìm kiếm kèm theo dấu /');
                }
            }
        }
        // get current user
        this.current_user = this.variableGlobals.user_current;
        
        setTimeout(() => {
            // get current user
            this.disableAllTable();
        },300);
    }

    /*
        Function disableAllTable(): Check condition, disable all button, checkbox
        @author: Lam 
    */
    disableAllTable(){
        //  check is disable notification or promotion from ref component parent
        if(this.is_disable_notification || this.is_disable_promotion){
            // disable all input table user left
            this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.rows().every( function () {
                    let row = this.node();
                    $(row).find('input:checkbox').prop('disabled', 'disabled');
                });
            });
            // disable all input table user right
            this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.rows().every( function () {
                    let row = this.node();
                    $(row).find('input:checkbox').prop('disabled', 'disabled');
                });
            });
            // disable button
            $(".multiselect_user button, .multiselect_footer button, #select-all-left, #select-all-right").prop('disabled', 'disabled');
        }
    }

    /*
        Event Button "Chon Tat Ca" select all user left
        @author: Lam 
    */
    selectAllEventLeft(event) {
        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows().every( function () {
                let row = this.node();
                $(row).addClass('selected');
                $(row).find('input:checkbox').prop('checked', true);
            });
            this.is_button_left = true;
            $('#select-all-left').prop('checked', true);
        });
    }

    /*
        Event Button "Bo Chon Tat Ca" select all user left
        @author: Lam 
    */
    cancelSelectAllEventLeft(event){
        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows().every( function () {
                let row = this.node();
                $(row).removeClass('selected');
                $(row).find('input:checkbox').prop('checked', false);
            });
            this.is_button_left = false;
            $('#select-all-left').prop('checked', false);
        });
    }

    /*
        Event Button "Chon Tat Ca" select all user right
        @author: Lam 
    */
    selectAllEventRight(event) {
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows().every( function () {
                let row = this.node();
                $(row).addClass('selected');
                $(row).find('input:checkbox').prop('checked', true);
            });
            this.is_button_rigth = true;
            if($('#table_id_2 tr').hasClass('selected')){
                $('#select-all-right').prop('checked', true);
            }
        });
    }

    /*
        Event Button "Bo Chon Tat Ca" select all user right
        @author: Lam 
    */
    cancelSelectAllEventRight(event){
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows().every( function () {
                let row = this.node();
                $(row).removeClass('selected');
                $(row).find('input:checkbox').prop('checked', false);
            });
            this.is_button_rigth = false;
            $('#select-all-right').prop('checked', false);
        });
    }

    /*
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: diemnguyen 
    */
    selectCheckboxLeft(event) {   
        $(event.target).closest( "tr" ).toggleClass( "selected" );
        // Any row not selected then checked all button is not checked
        $('#select-all-left').prop('checked', $("#table_id_1 tbody").find('tr:not(.selected)').length < 1);
    }

    /*
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: diemnguyen 
    */
    selectCheckboxRight(event) {   
        $(event.target).closest( "tr" ).toggleClass( "selected" );
        // Any row not selected then checked all button is not checked
        $('#select-all-right').prop('checked', $("#table_id_2 tbody").find('tr:not(.selected)').length < 1);
    }
    /*
        Move all row is checked to right tatble
        @author: diemnguyen
    */
    move_right(): void {
        let selected_temp: any;
        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            selected_temp = dtInstance.rows( '.selected' ).data();
            dtInstance.rows('.selected').remove().draw();
        });

        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
             dtInstance.rows.add(selected_temp).draw();
        });
        $("#table_id_2 tr input:checkbox").prop('checked', false);
        this.cancelSelectAllEventRight('');
        this.is_button_left = false;
        this.is_button_rigth = false;

    }
    /*
        Move all row is checked to left tatble
        @author: diemnguyen
    */
    move_left(): void {
        let selected_temp: any;
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            selected_temp = dtInstance.rows( '.selected' ).data();
            dtInstance.rows('.selected').remove().draw();
        });

        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
             dtInstance.rows.add(selected_temp).draw();
        });
        $("#table_id_1 tr input:checkbox").prop('checked', false);
        this.cancelSelectAllEventLeft('');
        this.is_button_left = false;
        this.is_button_rigth = false;
    }

    /*
        Event select All Button on header table
        @author: Lam 
    */
    selectAllPageLeft(event) {
        if( event.target.checked ) {
            $("#table_id_1 tr").addClass('selected');
        } else {
            $("#table_id_1 tr").removeClass('selected');
        }
        $("#table_id_1 tr input:checkbox").prop('checked', event.target.checked);
    }

    /*
        Event select All Button on header table
        @author: Lam 
    */
    selectAllPageRight(event) {
        if( event.target.checked ) {
            $("#table_id_2 tr").addClass('selected');
        } else {
            $("#table_id_2 tr").removeClass('selected');
        }
        $("#table_id_2 tr input:checkbox").prop('checked', event.target.checked);
    }

    // input checkall checked/unchecked
    checkSelectAllCheckboxLeft() {
        $('#select-all-left').prop('checked', $("#table_id_1 tbody tr:not(.selected)").length === 0);
    }

    // input checkall checked/unchecked
    checkSelectAllCheckboxRight() {
        if(this.user_list_right){
            $('#select-all-right').prop('checked', $("#table_id_2 tbody tr:not(.selected)").length === 0);
        }
    }


    /*
        @author: diemnguyen
    */
    onSave(): void {
        $('#select-all-left').prop('checked', false);
        $('#select-all-right').prop('checked', false);
        this.is_button_left = false;
        this.is_button_rigth = false;

        if(this.dtElements.last){
            this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            this.save.emit(dtInstance.column(1).data().toArray());
            });
        }
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
