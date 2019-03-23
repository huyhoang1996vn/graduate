import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Post } from '../../../shared/class/post';
import { PostService } from '../../../shared/services/post.service';
import { PostType } from './../../../shared/class/post-type';
import { PostTypeService } from '../../../shared/services/post-type.service';
import { PostImage } from './../../../shared/class/post-image';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ImageValidators } from './../../../shared/validators/image-validators';
import { ToastrService } from 'ngx-toastr';
import { env } from '../../../../environments/environment';
import * as ckeditor_config from './../../../shared/commons/ckeditor_config';
import { ScrollTop } from './../../../shared/commons/scroll-top';
import { HandleError } from '../../../shared/commons/handle_error';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'form-post',
    templateUrl: './form-post.component.html',
    styleUrls: ['./form-post.component.css'],
    providers: [PostService, PostTypeService]
})
export class FormPostComponent implements OnInit {

    /*
        author: Lam
    */
    // post_type fo carrer
    post_type_carrer:number = 2;
    post: Post;

    formPost: FormGroup;
    post_types: PostType[];

    errorMessage: any; // Messages error
    msg_clear_image = '';
    api_domain: string = '';
    lang = 'vi';
    title_page = '';

    ckEditorConfig:any;
    list_multi_image_id = [];
    // check post is for career
    is_post_career:boolean = false;

    input_multi_image = [{index: 0, image: null}, {index: 1, image: null}];
    select_input_multi_image = [];
    index_multi_image: number = 1;
    get_all_image = [];

    input_edit_multi_image = [];
    id_edit_multi_image = [];
    msg_clear_multi_image: string = '';

    post_type:string = '';

    constructor(
        private postService: PostService,
        private postTypeService: PostTypeService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private scrollTop: ScrollTop,
        private handleError:HandleError
    ) { 
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        this.getPostTypes();
        // get params url
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
            if(params.post_type){
                this.post_type = params.post_type;
            }
        });

        this.ckEditorConfig = ckeditor_config.config;

        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title_page = "Chỉnh Sửa Bài Viết";
            this.getPost();
        } else {
            // Add new Form
            this.title_page = "Thêm Bài Viết";
            this.post = new Post();
            this.creatForm();
        }
    }
    /*
        function check_post_career():
            if post is in post_type_carrer, enable and set value for pin_to_top
            else disable and uncheck pin_to_top
        author: HOang
    */ 
    check_post_career(post_type){
        if (post_type == this.post_type_carrer){
            this.is_post_career = true;
            this.formPost.controls.pin_to_top.setValue(this.post.id ? this.post.pin_to_top : false);
        }else{
            this.is_post_career = false;
            this.formPost.controls.pin_to_top.setValue(false);
        }
    }


    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formPost = this.fb.group({
            name: [this.post.name, [Validators.required, Validators.maxLength(255)]],
            image: [this.post.image, [ImageValidators.validateFile]],
            short_description: [this.post.short_description, [Validators.required, Validators.maxLength(350)]],
            content: [this.post.content, Validators.required],
            post_type: [this.post.post_type ? this.post.post_type : null],
            pin_to_top: [this.post.pin_to_top ? this.post.pin_to_top : false],
            key_query: [this.post.key_query, [Validators.required, Validators.maxLength(255)]],
            is_draft: [this.post.is_draft],
            is_clear_image: [false],
            posts_image: [[], [ImageValidators.validateMultiFile]]
        });
    }

    /*
        Function getPost():
         + Get id from url path
         + Callback service function getPost() by id
        Author: Lam
    */
    getPost(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.postService.getPost(id, this.lang).subscribe(
            (data) => {
                this.post = data;
                for(let i=0; i<this.post.posts_image.length; i++){
                    this.input_edit_multi_image.push({id: this.post.posts_image[i].id, image: null});
                }
                this.creatForm();
                this.check_post_career(data.post_type);
            },
            (error) => {
                this.handleError.handle_error(error);;
            }
        );
    }

    /*
        Function getPostTypes():
         + Get list post types
         + Callback service function getPostTypes()
        Author: Lam
    */
    getPostTypes(){
        this.postTypeService.getPostTypes(this.lang).subscribe(
            (data) => {
                this.post_types = data;
            } 
        );
    }

    /*
        Function editFileImage(): Input file image when edit image current
        author: Lam
    */ 
    editFileImage(event, post_image){
        let obj_image: any;
        // get object file from input, set obj_image
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            obj_image = {
                filename: file.name,
                filetype: file.type,
                value: file,
            }
        } 
        // check id for search possition array, add obj_image into input edit multi image
        for(let i=0; i<this.input_edit_multi_image.length; i++){
            if(this.input_edit_multi_image[i].id === post_image.id){
                this.input_edit_multi_image[i].image = obj_image;
            }
        }
        // create new array include select input multi and input multi image
        this.get_all_image = [...this.get_all_image, ...this.input_edit_multi_image];
        // set all image slected into posts_image form for validate
        this.formPost.get('posts_image').setValue(this.get_all_image);
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChange(event): void{
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formPost.get('image').setValue({
                filename: file.name,
                filetype: file.type,
                value: file,
            });
        }
    }

    /*
        Function onFileMultipleChange(): Input file image into input multi image
        author: Lam
    */ 
    onFileMultipleChange(event, number): void{
        let obj_image: any;
        if(event.target.files && event.target.files.length > 0) {
            if(number === -1){ // multil upload image
                this.select_input_multi_image = [];
                // get object file from input, set obj_image
                for(let i = 0; i < event.target.files.length; i++){
                    let file = event.target.files[i];
                    obj_image = {
                        filename: file.name,
                        filetype: file.type,
                        value: file,
                    }
                    this.select_input_multi_image.push({index: null, image: obj_image});
                }
            }else{ // upload image single
                let file = event.target.files[0];
                obj_image = {
                    filename: file.name,
                    filetype: file.type,
                    value: file,
                }
                // find location array have index = number, set image of array have location = obj_image
                for(let i=0; i< this.input_multi_image.length; i++){
                    if(this.input_multi_image[i].index === number){
                        this.input_multi_image[i].image = obj_image;
                    }
                }
            }
            // create new array include select input multi and input multi image
            this.get_all_image = [...this.select_input_multi_image, ...this.input_multi_image];
            // set all image slected into posts_image form for validate
            this.formPost.get('posts_image').setValue(this.get_all_image);
        }
    }

    /*
        Function delsMutilImage(): get list id del image
        author: Lam
    */ 
    delsMutilImage(event, post_image){
        if(event.target.checked){
            this.list_multi_image_id.push(post_image.id);
        }else{
            this.list_multi_image_id = this.list_multi_image_id.filter(k => k !== post_image.id);
        }
    }

    /*
        Function addImagePost(): click button add input image, push 1 object into list input multi image 
        author: Lam
    */ 
    addImagePost(){
        this.index_multi_image += 1;
        this.input_multi_image.push({index: this.index_multi_image, image: null});
    }

    /*
        Function subImagePost(): remove input image 
        author: Lam
    */
    subImagePost(number){
        this.input_multi_image = this.input_multi_image.filter(x => x.index !== number);
    }

    /*
        Function areArrsMatch(): compare element arr1 have in arr2 not
        author: Lam
    */
    areArrsMatch(arr1, arr2){
        return arr1.some(a => arr2.some(m => a === m));
    }

    /*
        Function onSubmit():
         + Step 1: Check post id
         + Step 2:  
            * TH1:  + Id empty then call service function addHPost() to add Post, 
                    + Later, redirect list post with message
            * TH2:  + Id exist then call service function updatePost() to update Post
                    + Later, redirect list post with message
        author: Lam
    */
    onSubmit(): void{
        // case form invalid, show error fields, scroll top
        if(this.formPost.invalid){
            ValidateSubmit.validateAllFormFields(this.formPost);
            this.scrollTop.scrollTopFom();
        }else{

            /* upload image */
            let multi_image = []; // create multi image empty
            // create new array include two arr select input multi and input multi image
            let get_all_create_image = [...this.select_input_multi_image, ...this.input_multi_image];
            // push image exist into multi image
            get_all_create_image.forEach(function(element){
                if(element.image){
                    multi_image.push(element.image);
                }
            });
            /* End upload image */

            // set mutil image for posts image of form
            this.formPost.value.posts_image = multi_image;

            // push list_clearimage into form post value
            this.formPost.value.list_clear_image = this.list_multi_image_id;

            // parse post_type id string to int
            if(this.formPost.value.post_type){
                this.formPost.value.post_type = parseInt(this.formPost.value.post_type);
            }else{
                this.formPost.value.post_type = null;
            }

            // case create new
            if(!this.post.id){
                // convert Form Group to formData
                let post_form_data = this.convertFormGroupToFormData(this.formPost);
                let value_form = this.formPost.value;
                this.postService.addPost(post_form_data, this.lang).subscribe(
                    (data) => {
                        this.toastr.success(`Thêm mới "${value_form.name}" thành công`);
                        this.router.navigate(['/post/list']);
                    },
                    (error) => {
                        // code 400, error validate
                        if(error.status == 400){
                            this.errorMessage = JSON.parse(error.response).message;
                            this.scrollTop.scrollTopFom();
                        }else{
                            this.handleError.handle_error(error);;
                        }
                    }
                );
            }else {
                /* Edit upload image */
                let edit_posts_image = []; // list image changed
                let id_edit_post_image = [];// list id image changed
                // get image != null
                for(let i=0; i<this.input_edit_multi_image.length;i++){
                    if(this.input_edit_multi_image[i].image){
                        edit_posts_image.push(this.input_edit_multi_image[i].image);
                        id_edit_post_image.push(this.input_edit_multi_image[i].id)
                    }
                }
                // check id image changed have in list image dels
                let is_edit_clear_multi_image = this.areArrsMatch(id_edit_post_image, this.list_multi_image_id);

                // set image and id edit into form post
                this.formPost.value.edit_posts_image = edit_posts_image;
                this.formPost.value.id_edit_post_image = id_edit_post_image.length > 0 ? id_edit_post_image: null;
                /* End Edit upload image */

                // convert Form Group to formData
                let post_form_data = this.convertFormGroupToFormData(this.formPost);
                let value_form = this.formPost.value;

                // check remove image when select checkbox clear image and choose image
                if(is_edit_clear_multi_image || (value_form.is_clear_image === true && typeof(value_form.image) != 'string')){
                    // edit, multi upload imagge
                    if(is_edit_clear_multi_image){
                        this.msg_clear_multi_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                        $('.image-current li input').prop('checked', false);
                        this.list_multi_image_id = [];
                        $('html,body').animate({ scrollTop: $('.image-current').offset().top }, 'slow');
                    }
                    // upload imamge single
                    if(value_form.is_clear_image === true && typeof(value_form.image) != 'string'){
                        this.formPost.get('is_clear_image').setValue(false);
                        this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                        this.scrollTop.scrollTopFom();
                    }
                }else{
                    this.postService.updatePost(post_form_data, this.post.id, this.lang).subscribe(
                        (data) => {
                            this.post = data;
                            this.toastr.success(`Chỉnh sửa "${value_form.name}" thành công`);
                            this.router.navigate(['/post/list', {post_type: this.post_type}]);
                        },
                        (error) => {
                            // code 400, error validate
                            if(error.status == 400){
                                this.errorMessage = JSON.parse(error.response).message;
                                this.scrollTop.scrollTopFom();
                            }else{
                                this.handleError.handle_error(error);;
                            }
                        }
                    );
                }
            }
        }
    }

    /*
        Function deletePostEvent(): confirm delete
        @author: Lam
    */
    deletePostEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Bài Viết này?",
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
                    that.onDelete();
                }
            }
        });
    }

    /*
        Function onDelete():
         + Get id from url path
         + Call service function onDelPost() by id to delete event
        Author: Lam
    */
    onDelete(): void {
        const id = this.post.id;
        this.postService.onDelPost(id, this.lang).subscribe(
            (data) => {
                this.toastr.success(`Xóa "${this.formPost.value.name}" thành công`);
                this.router.navigate(['/post/list']);
            },
            (error) => {
                this.handleError.handle_error(error);;
            }
        );
    }

    /*
        Convert form group to form data to submit form
        @author: lam
    */
    private convertFormGroupToFormData(promotionForm: FormGroup) {
        // Convert FormGroup to FormData
        let promotionValues = promotionForm.value;
        let promotionFormData:FormData = new FormData(); 
        if (promotionValues){
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(promotionValues).forEach(k => { 
                if(promotionValues[k] == null) {
                    promotionFormData.append(k, '');
                } else if (k === 'image') {
                    // if image has value, form data append image
                    if (promotionValues[k].value){
                        promotionFormData.append(k, promotionValues[k].value);
                    }
                 } else if(k === 'posts_image'){
                    Object.keys(promotionValues[k]).forEach(l => { 
                        promotionFormData.append('posts_image', promotionValues[k][l].value);
                    });
                } else if(k === 'edit_posts_image'){
                    Object.keys(promotionValues[k]).forEach(l => { 
                        promotionFormData.append('edit_posts_image', promotionValues[k][l].value);
                    });
                }else {
                    promotionFormData.append(k, promotionValues[k]);
                }
            });
        }
        return promotionFormData;
    }

}
