import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';

import { Advertisement } from '../../../shared/class/advertisement';
import { AdvertisementService } from '../../../shared/services/advertisement.service';
import { HandleError } from '../../../shared/commons/handle_error';
// Using bootbox 
declare var bootbox: any;

@Component({
	selector: 'app-form-advertisement',
	templateUrl: './form-advertisement.component.html',
	styleUrls: ['./form-advertisement.component.css']
})
export class FormAdvertisementComponent implements OnInit {

	adv: Advertisement;

	errorMessage: string = "";
	advForm: FormGroup; // advsForm is of type FormGroup

	lang: string = 'vi';
	title: string = "";

	constructor(
		private advertisementService: AdvertisementService,
		private route: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder, // inject FormBuilder
		private toastr: ToastrService,
		private handleError:HandleError
	) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params.lang) {
				this.lang = params.lang;
			}
		});
		if (this.route.snapshot.paramMap.get('id')) {
			// Update Init Form
			this.title = "Chỉnh Sửa Quảng Cáo";
			this.getAdv();
		} else {
			// Add new Form
			this.title = "Thêm Quảng Cáo";
			this.adv = new Advertisement()
			this.createForm();
		}
	}

	/* Create Form Advertisement
		@author: TrangLe
	*/
	createForm() {
		this.advForm = this.fb.group({
			//the FormControl called name, is_show
			name: [this.adv.name, [Validators.required, Validators.maxLength(255)]],
			is_show: [this.adv.is_show === true ? true : false],
		});
	}
    /*
    	Get adv by ID
		Success: Return array, create form with id to edit
		Fail: Show error
    	@author: TrangLe
     */
	getAdv() {
		const id = +this.route.snapshot.paramMap.get('id');
		this.advertisementService.getAdvertisement(id, this.lang).subscribe(
			(result) => {
				this.adv = result;
				this.createForm();
			},
			(error) => {
				this.handleError.handle_error(error);
			}
		);
	}

	/*
		PUT: Update Advertiment Detail
		+ Step1: Check advForm invalid when submit -> Show error
		Call service advertiment
		+ Step2: if exist adv.id => call updateAdv(Edit advertiment) 
			else call addAdvertiment (Add new Advertiment)
		@author: TrangLe
	 */
	onSubmit() {
		if (this.advForm.invalid) {
			// import Validate submit form shared/validators/validate-submit
			ValidateSubmit.validateAllFormFields(this.advForm);
		} else {
			if (this.adv.id) {
				this.advertisementService.updateAdv(this.advForm.value, this.adv.id, this.lang).subscribe(
					() => {
						this.toastr.success(`Chỉnh sửa "${this.advForm.value['name']}" thành công`);
						this.router.navigate(['/advertisement-list']);
					},
					(error) => {
						if (error.status == 400) {
							this.errorMessage = error.json()
						}else {
							this.handleError.handle_error(error);
						}
					}
				);
			} else {
				this.advertisementService.addAdvertisement(this.advForm.value, this.lang).subscribe(
					(resultAdv) => {
						// this.advs.push(resultAdv);
						this.toastr.success(`Thêm "${this.advForm.value['name']}" thành công`);
						this.router.navigate(['/advertisement-list'])
					},
					(error) => {
						if (error.status == 400) {
							this.errorMessage = error.json()
						}else {
							this.handleError.handle_error(error);
						}
					}
				);
			}

		}
	}
	/*
		Delete Advertiment by id
		Call service deleteAdvById form advertiment.service
		Sucess: navigate component advertiment-list, show success message
		Fail: navigate component error with error message
		@author: Trangle
	 */
	deleteAdv(adv: Advertisement) {
		this.advertisementService.deleteAdvById(adv.id, this.lang)
			.subscribe(
				() => {
					this.toastr.success(`Xóa "${adv.name}" thành công`);
					this.router.navigate(['/advertisement-list']);
				},
				error => {
					this.handleError.handle_error(error);
				}
			);
	}
    /*
    	Confirm Delete 
    	Using libary: bootbox
    	@author: TrangLe
    */

	confirmDelete(adv: Advertisement) {
		bootbox.confirm({
			title: "Bạn có chắc chắn?",
			message: "Bạn muốn xóa Quảng Cáo này?",
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
					this.deleteAdv(adv)
				}
			}
		});
	}
    /*
    	Remove message from server when click input form
    	@author:Trangle
     */
	removeMessage() {
		this.errorMessage = '';
	}

}
