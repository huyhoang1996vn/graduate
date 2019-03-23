import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Promotion } from '../../../shared/class/promotion';
import { PromotionService } from '../../../shared/services/promotion.service';
import { HandleError } from '../../../shared/commons/handle_error';
@Component({
    selector: 'popup-edit-promotion',
    templateUrl: './popup-edit-promotion.component.html',
    styleUrls: ['./popup-edit-promotion.component.css'],
    providers: [PromotionService]
})
export class PopupEditPromotionComponent implements OnInit {

    /*
        Author: Lam
    */

    // Return 1 object to parent
    @Output() update_promotion: EventEmitter<Promotion> = new EventEmitter<Promotion>();

    promotion: Promotion;

    position = "popup"; // type http to form promotion component 

    lang = 'vi';

    constructor(
        private promotionService: PromotionService,
        private route: ActivatedRoute,
        private router: Router,
        private handleError:HandleError
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.getPromotion();
    }

    /*
        Function getPromotion():
         + Get id from url path
         + Callback service function getPromotion() by id
        Author: Lam
    */
    getPromotion(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.promotionService.getPromotionById(id, this.lang).subscribe(
            (data) => {
                this.promotion = data;
            },
            (error) => {
                this.handleError.handle_error(error);;
            }
        );
    }

    /*
        Function updatePromotion(): Get promotion from component form-promotion
        Author: Lam
    */
    updatePromotion(event){
        this.update_promotion.emit(event);
    }

}
