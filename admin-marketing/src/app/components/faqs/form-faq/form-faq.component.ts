import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Faq } from '../../../shared/class/faq';
import { FaqService } from '../../../shared/services/faq.service';
import { Category } from './../../../shared/class/category';
import { CategoryService } from './../../../shared/services/category.service';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import 'rxjs/add/observable/throw';
import { ToastrService } from 'ngx-toastr';
import { ScrollTop } from './../../../shared/commons/scroll-top';
import { HandleError } from '../../../shared/commons/handle_error';

const FAQS_CATEGORY = [1,2,3,5,6];

declare var bootbox:any;

@Component({
    selector: 'form-edit-faq',
    templateUrl: './form-faq.component.html',
    styleUrls: ['./form-faq.component.css'],
    providers: [FaqService, CategoryService]
})
export class FormFaqComponent implements OnInit {

    /*
        author: Lam
    */

    faq: Faq;
    categories: Category[];

    formFaq: FormGroup;

    errorMessage: any; // Messages error

    lang = 'vi';
    title_page = '';

    constructor(
        private faqService: FaqService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private categoryService: CategoryService,
        private toastr: ToastrService,
        private scrollTop: ScrollTop,
        private handleError:HandleError
    ) { }

    ngOnInit() {
        // get params url
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.getCategories();

        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title_page = "Chỉnh Sửa Câu Hỏi Thường Gặp";
            this.getFaq();
        } else {
            // Add new Form
            this.title_page = "Thêm Câu Hỏi Thường Gặp";
            this.faq = new Faq();
            this.creatForm();
        }
    }

    /*
        Function getFaq():
         + Get id from url path
         + Call service function getFaq() by id
         + Later, call createForm()
        Author: Lam
    */
    getFaq(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.faqService.getFaq(id, this.lang).subscribe(
            (data) => {
                this.faq = data;
                this.creatForm();
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formFaq = this.fb.group({
            question: [this.faq.question, [Validators.required, Validators.maxLength(255)]],
            answer: [this.faq.answer, Validators.required],
            category: [this.faq.category ? this.faq.category : '', Validators.required],
        });
    }

    /*
        function getCategories(): get all category
        @author: Lam
    */ 
    getCategories(): void{
        this.categoryService.getAllCategory().subscribe(
            (data) => {
                this.categories = data;
                this.categories = this.categories.filter(({id}) => FAQS_CATEGORY.includes(id));
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        Function onSubmit():
         + Call service function updateFaq use http put
         + Later, success then redirect faq/list with messsage, fail show error
        author: Lam
    */ 
    onSubmit(): void{
        // case form invalid, show error fields, scroll top
        if(this.formFaq.invalid){
            ValidateSubmit.validateAllFormFields(this.formFaq);
            this.scrollTop.scrollTopFom();
        }else{
            // parse category string to int
            this.formFaq.value.category = parseInt(this.formFaq.value.category);
            // case update
            if(this.faq.id){
                this.faqService.updateFaq(this.formFaq.value, this.faq.id, this.lang).subscribe(
                    (data) => {
                        this.toastr.success(`Chỉnh sửa "${this.formFaq.value.question}" thành công`);
                        this.router.navigate(['/faq/list']);
                    },
                    (error) => {
                        // code 400, error validate
                        if(error.status == 400){
                            this.errorMessage = error.json().message;
                            this.scrollTop.scrollTopFom();
                        }else{
                            this.handleError.handle_error(error);
                        }
                    }
                );
            }else{
                // case create new
                this.faqService.addFaq(this.formFaq.value, this.lang).subscribe(
                    (data) => {
                        this.toastr.success(`Thêm mới "${this.formFaq.value.question}" thành công`);
                        this.router.navigate(['/faq/list']);
                    },
                    (error) => {
                        // code 400, error validate
                        if(error.status == 400){
                            this.errorMessage = error.json().message;
                            this.scrollTop.scrollTopFom();
                        }else{
                            this.handleError.handle_error(error);
                        }
                    }
                );
            }
        }
    }

    /*
        Function deleteFaqEvent(): confirm delete
        @author: Lam
    */
    deleteFaqEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Câu Hỏi Thường Gặp này?",
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
         + Call service function onDelFaq() by id to delete faq
        Author: Lam
    */
    onDelete(): void {
        const id = this.faq.id;
        this.faqService.onDelFaq(id, this.lang).subscribe(
            (data) => {
                this.toastr.success(`Xóa "${this.formFaq.value.question}" thành công`);
                this.router.navigate(['/faq/list']);
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

}
