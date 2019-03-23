import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { DatePipe } from '@angular/common';
import * as moment from 'moment';

import { FeedbackService } from '../../../shared/services/feedback.service';
import { Feedback, Status, en_Status, vi_Type, en_Type } from '../../../shared/class/feedback';
import { HandleError } from '../../../shared/commons/handle_error';

// Using bootbox 
declare var bootbox: any;

@Component({
    selector: 'app-feedback-detail',
    templateUrl: './feedback-detail.component.html',
    styleUrls: ['./feedback-detail.component.css']
})
export class FeedbackDetailComponent implements OnInit {

    feedbackForm: FormGroup; // feedbackForm is type of FormGroup

    feedback: Feedback;

    feedbacks: Feedback[];

    tus = Status; // List status with vietnames
    en_tus = en_Status; // List status with english
    vi_type = vi_Type; // List type_feedback with vietnamese
    en_type = en_Type; // List type_feedback with english

    errorMessage: string;

    constructor(
        private feedbackService: FeedbackService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private handleError:HandleError,
    ) {

    }

    ngOnInit() {
        this.getFeedback()
    }

    /*
        Function: Create Form Feedback to edit feedback
        @author: TrangLe
     */
    createFormFeedback() {
        // The FormControl call name, email, phone, subject, message,
        //  feedback_type, created, rate, status, answer
        this.feedbackForm = this.fb.group({
            name: [this.feedback.name],
            email: [this.feedback.email],
            phone: [this.feedback.phone],
            subject: [this.feedback.subject],
            message: [this.feedback.message],
            feedback_type: [this.feedback.feedback_type],
            created: [this.feedback.created],
            rate: [this.feedback.rate],
            status: [this.feedback.status],
            answer: [this.feedback.answer, [Validators.maxLength(1000)]],
        })
    }
    /*
        Function: Get Feedback By Id
        Call getFeedbackById from feedback.service
        Success: return feedback array and create to edit
        Fail: nagivate component error show error message
        @author: Trangle      
    */
    getFeedback() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.feedbackService.getFeedbackById(id).subscribe(
            feedback => {
                this.feedback = feedback,
                    this.createFormFeedback();
            },
            error => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        DELETE: Delete Feedback By Id
        Call deleteFeedbackById from feedback.service
        Success: nagivate component feedback-list and show success message
        Fail: Return error
        @author: TrangLe
    */
    deleteFeedback(feedback: Feedback) {
        this.feedbackService.deleteFeedbackById(feedback).subscribe(
            () => {
                this.toastr.success(`Xóa "${feedback.subject}" thành công`);
                this.router.navigate(['/feedback-list']);
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }
    /* 
        PUT: Update Feedback by ID
        TranslateValue form before send server
        Call updateFeedbackById form feedback.service
        Success: nagivate feedback-list and show success message
        Fail: return error
        @author: TrangLe
    */
    updateFeedback() {
        let valueForm = this.translateValueFeedbackForm(this.feedbackForm.value);
        this.feedbackService.updateFeedbackById(valueForm, this.feedback.id).subscribe(
            () => {
                this.toastr.success(`Chỉnh sửa "${this.feedback.subject}" thành công`);
                this.router.navigate(['/feedback-list']);
            },
            (error) => {
                if (error.status == 400) {
                    // Show error message in form
                    this.errorMessage = error.json();
                }else {
                    this.handleError.handle_error(error);
                }

            }
        )
    }

    /* 
        Confirm delete feedback detail
        Using: bootbox plugin
        @author: Trangle
    */
    confirmDeleteFeedback(feedback: Feedback) {
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Phản Hồi này?",
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
                    this.deleteFeedback(feedback)
                }
            }
        });
    }

    /*
        Transalte value type_feedback and status
        @author: TrangLe
    */
    translateValueFeedbackForm(value) {
        // Transalte for feedback_type before save server
        if (value.feedback_type == this.vi_type[1]) {
            value.feedback_type = this.en_type[1]
        } else if (value.feedback_type == this.vi_type[0]) {
            value.feedback_type = this.en_type[0]
        }
        // Translate for status before save server
        switch (value.status) {
            case this.tus[0]:
                value.status = this.en_tus[0]
                break;
            case this.tus[1]:
                value.status = this.en_tus[1]
                break;
            case this.tus[2]:
                value.status = this.en_tus[2]
                break;
        }
        return value;
    }
}
