import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../../../shared/class/post';
import { PostType } from '../../../shared/class/post-type';
import { PostService } from '../../../shared/services/post.service';
import { PostTypeService } from '../../../shared/services/post-type.service';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/observable/throw';
import * as datatable_config from '../../../shared/commons/datatable_config';
import { HandleError } from '../../../shared/commons/handle_error';
declare var bootbox:any;

@Component({
    selector: 'app-list-post',
    templateUrl: './list-post.component.html',
    styleUrls: ['./list-post.component.css'],
    providers: [PostService, PostTypeService]
})
export class ListPostComponent implements OnInit {

    /*
        Author: Lam
    */

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: any = {};

    length_all: Number = 0;
    length_selected: Number = 0;

    posts: Post[];
    postTypes: PostType[];

    post_type:string = null;
    lang: string = 'vi';

    constructor(
        private postService: PostService, 
        private postTypeService: PostTypeService,
        private router: Router,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private handleError:HandleError
    ) { }

    ngOnInit() {
        // get params url
        this.route.params.subscribe(params => {
            if(params.post_type && params.post_type !== 'null'){
                this.post_type = params.post_type;
            }
        });

        // config datatable to filter follow post_type
        $.fn['dataTable'].ext.search.push((settings, data, dataIndex) => {
            const post_type_data = data[3] || null; // use data for the id column
            if (!this.post_type){
                return true;
            }
            if (post_type_data === this.post_type) {
                return true;
            }
            return false;
        });

        this.dtOptions = datatable_config.data_config('Bài Viết');
        // custom datatable option
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            initComplete: function () {
                $('.dataTables_filter input[type="search"]').css(
                     {'width':'160px','display':'inline-block'}
                );
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
        this.getPosts();
        this.getPostTypes();
    }
    /*
        Function getPostTypes(): Callback service function getPostTypes() get all Post
        Author: Hoang
    */
    getPostTypes(){
        this.postTypeService.getPostTypes(this.lang).subscribe(
            (data) => {
                this.postTypes = data;
                
            },
            (error) => {
                this.handleError.handle_error(error);;
            }
        );
    }
    /*
        Function reloadDatatable(): 
            reload datatable after filter
        Author: Hoang
    */
    reloadDatatable(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

    /*
        Function getPosts(): Callback service function getPosts() get all Post
        Author: Lam
    */
    getPosts(){
        this.postService.getPosts(this.lang).subscribe(
            (data) => {
                this.posts = data;
                this.length_all = this.posts.length;
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
        Function deletePostEvent(): confirm delete
        @author: Lam
    */
    deletePostEvent(){
        let that = this;
        if ( this.length_selected > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " Bài Viết đã chọn?",
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
                        that.onDeletePost();
                    }
                }
            });

        } else  {
            this.toastr.warning(`Vui lòng chọn Bài Viết cần xóa`);
        }
        
    }

    /*
        Function onDeletePost(): 
         + Callback service function onDeletePost() delete post by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDeletePost(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list promotion id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list promotion selected
            this.postService.onDelPostSelect(list_id_selected, this.lang).subscribe(
                (data) => {
                    if (data.code === 204) {
                        this.toastr.success(`Xóa ${this.length_selected} Bài Viết thành công`);

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
            this.posts = null;
            this.lang = value;
            this.getPosts();
            this.getPostTypes();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }
    ngOnDestroy(): void {
        // config datatable to filter follow post_type
        $.fn['dataTable'].ext.search.pop();
    }

}
