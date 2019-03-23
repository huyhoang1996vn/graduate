import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Banner, positions } from '../../../shared/class/banner';
import { BannerService } from '../../../shared/services/banner.service';
import { ToastrService } from 'ngx-toastr';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { HandleError } from '../../../shared/commons/handle_error';
import { env } from '../../../../environments/environment';

// Using bootbox 
declare var bootbox: any;

@Component({
    selector: 'app-form-banner',
    templateUrl: './form-banner.component.html',
    styleUrls: ['./form-banner.component.css']
})
export class FormBannerComponent implements OnInit {

    banner: Banner;
    formBanner: FormGroup; // formBanner is type of FormControl

    positions = positions; // import class positions

    api_domain: string = "";
    errorMessage: string = "";
    title: string = "";
    msg_clear_image: string = '';

    isSelected: boolean;

    constructor(
        private bannerService: BannerService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private handleError:HandleError
    ) {
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {

        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title = "Chỉnh Sửa Banner";
            this.getBannerById();
        } else {
            // Add new Form
            this.title = "Thêm Banner";
            this.banner = new Banner();
            this.isSelected = true;
            this.createForm();
        }
    }
    /*
        Upload image
        FileReader: reading file contents
        @author: TrangLe
    */
    onFileChange(event) {
        let reader = new FileReader();
        let input_id = $(event.target).attr('id');
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formBanner.get(input_id).setValue({ filename: file.name, filetype: file.type, value: file });
        }
    }

    /*
        Get banner by id
        Call getBannerById form banner.service
        Success: Return array banner, create form to edit
        Fail: navigate component error to show error message
        @author: Trangle
     */
    getBannerById() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.bannerService.getBannerById(id).subscribe(
            (banner) => {
                this.banner = banner;
                this.createForm();
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        Create Form Banner to edit and create new banner
        @author: Trangle
     */
    createForm() {
        // The FormControl call image, sub_url, position, is_show, is_clear_image
        this.formBanner = this.fb.group({
            image: [this.banner.image],
            sub_url_web: [this.banner.sub_url_web, [Validators.required, Validators.maxLength(1000)]],
            position: [this.banner.position, [Validators.required]],
            is_show: [this.banner.is_show === true ? true : false],
            is_clear_image: [false]
        });
    }

    /*
        Function: update and create new Banner
        Step1: Check formBanner isvalid true => Show error message
        Step2: formBanner valid
            + convert BannerFormgroup to Form Data
            + Check exist banner.id => call updateBanner form banner.service to
            edit banner
            + Else ; call CreateBanner form banner.service to create new Banner
        @author: Trangle
     */
    onSubmit() {
        if (this.formBanner.invalid) {
            // Cale ValidateSubmit form ../shared/validators/validate-submit
            ValidateSubmit.validateAllFormFields(this.formBanner);
        } else {
            var self = this;
            let bannerFormGroup = this.convertFormGroupToFormData(this.formBanner);
            if (this.banner.id) {
                // Check is_clear_image
                if (this.formBanner.value.is_clear_image === true && typeof (this.formBanner.value.image) != 'string') {
                    // Set value is_clear_image
                    this.formBanner.get('is_clear_image').setValue(false);
                    // Show msg_clear_image when error file or choose both is_clear_image and file
                    this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                } else {
                    this.bannerService.updateBanner(bannerFormGroup, this.banner.id).subscribe(
                        (data) => {
                            // Navigate to promotion page where success
                            this.toastr.success(`Chỉnh sửa "${this.formBanner.value['sub_url_web']}" thành công`);
                            this.router.navigate(['/banner-list']);
                        },
                        (error) => {
                            self.handleError.handle_error(error);
                        }
                    );
                }
            } else {
                this.bannerService.CreateBanner(bannerFormGroup).subscribe(
                    (result) => {
                        self.toastr.success(`Thêm "${this.formBanner.value['sub_url_web']}" thành công`);
                        self.router.navigate(['/banner-list'])
                    },
                    (error) => {
                        self.handleError.handle_error(error);
                    }
                );
            }
        }
    }

    /*
        Delete banner by id
        Call deleteUserById from banner.service
        Success: Show success message and nagivate component error
        Fail: nagivate component error show error message
        @author: Trangle
     */
    deleteBanner() {
        const id = this.banner.id;
        this.bannerService.deleteUserById(id).subscribe(
            (data) => {
                this.toastr.success(`Xóa "${this.banner.sub_url_web}" thành công`);
                this.router.navigate(['/banner-list']);
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        Convert form group to form data to submit form
        @author: diemnguyen
    */
    private convertFormGroupToFormData(formBanner: FormGroup) {
        // Convert FormGroup to FormData
        let bannerValues = formBanner.value;
        let bannerFormData: FormData = new FormData();
        if (bannerValues) {
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(bannerValues).forEach(k => {
                if (bannerValues[k] == null) {
                    bannerFormData.append(k, '');
                } else if (k === 'image') {
                    // if image has value, form data append image
                    if (bannerValues[k].value){
                        bannerFormData.append(k, bannerValues[k].value);
                    }
                } else {
                    bannerFormData.append(k, bannerValues[k]);
                }
            });
        }
        return bannerFormData;
    }

    /*
        Confirm delete
        Using library bootbox
        @author: Trangle
     */
    confirmDelete(banner: Banner) {
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Banner này?",
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
                    // Check result = true. call function callback
                    this.deleteBanner()
                }
            }
        });
    }
}
