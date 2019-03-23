import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Game } from '../../../shared/class/game';
import { GameService } from '../../../shared/services/game.service';
import { Type } from '../../../shared/class/type';
import { TypeService } from '../../../shared/services/type.service';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ImageValidators } from './../../../shared/validators/image-validators';
import { env } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import * as ckeditor_config from './../../../shared/commons/ckeditor_config';
import { ScrollTop } from './../../../shared/commons/scroll-top';
import { HandleError } from '../../../shared/commons/handle_error';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'form-game',
    templateUrl: './form-game.component.html',
    styleUrls: ['./form-game.component.css'],
    providers: [GameService, TypeService]
})
export class FormGameComponent implements OnInit {

    /*
        author: Lam
    */

    game: Game;

    types: Type[];

    formGame: FormGroup;

    errorMessage: any; // Messages error
    msg_clear_image = '';

    api_domain: string = '';
    lang = 'vi';
    title_page = '';
    ckEditorConfig:any;

    constructor(
        private gameService: GameService,
        private typeService: TypeService,
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
        // get params url
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.getTypes();

        this.ckEditorConfig = ckeditor_config.config;

        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title_page = "Chỉnh Sửa Trò Chơi";
            this.getGame();
        } else {
            // Add new Form
            this.title_page = "Thêm Trò Chơi";
            this.game = new Game();
            this.creatForm();
        }
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formGame = this.fb.group({
            name: [this.game.name, [Validators.required, Validators.maxLength(255)]],
            image: [this.game.image, [ImageValidators.validateFile]],
            short_description: [this.game.short_description, [Validators.required, Validators.maxLength(350)]],
            content: [this.game.content, Validators.required],
            game_type: [this.game.game_type ? this.game.game_type : '', Validators.required],
            is_draft: [this.game.is_draft],
            is_clear_image: [false]
        });
    }

    /*
        Function getGame():
         + Get id from url path
         + Callback service function getGame() by id
        Author: Lam
    */
    getGame(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.gameService.getGame(id, this.lang).subscribe(
            (data) => {
                this.game = data;
                this.creatForm();
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        function getTypes(): get all type
        @author: Lam
    */ 
    getTypes(): void{
        this.typeService.getTypes(this.lang).subscribe(
            (data) => {
                this.types = data;
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChange(event): void{
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formGame.get('image').setValue({
                filename: file.name,
                filetype: file.type,
                value: file,
            });
        }
    }


    /*
        Function onSubmit():
         + Step 1: Check game id
         + Step 2:  
            * TH1:  + Id empty then call service function addGame() to add game, 
                    + Later, redirect list game with message
            * TH2:  + Id exist then call service function updateGame() to update Event
                    + Later, redirect list game with message
        author: Lam
    */ 
    onSubmit(): void{
        // case form invalid, show error fields, scroll top
        if(this.formGame.invalid){
            ValidateSubmit.validateAllFormFields(this.formGame);
            this.scrollTop.scrollTopFom();
        }else{
            // parse game type id string to int
            this.formGame.value.game_type = parseInt(this.formGame.value.game_type);
            // convert from to form data
            let game_form_data = this.convertFormGroupToFormData(this.formGame);
            let value_form = this.formGame.value;
            //case create new
            if(!this.game.id){
                this.gameService.addGame(game_form_data, this.lang).subscribe(
                    (data) => {
                        this.toastr.success(`Thêm mới "${value_form.name}" thành công`);
                        this.router.navigate(['/game/list']);
                    },
                    (error) => {
                        // code 400, erro validate
                        if(error.status == 400){
                            this.errorMessage = JSON.parse(error.response).message;
                            this.scrollTop.scrollTopFom();
                        }else{
                            this.handleError.handle_error(error);
                        }
                    }
                );
            }else{
                // check remove image when select checkbox clear image and choose image
                if(value_form.is_clear_image === true && typeof(value_form.image) != 'string'){
                    this.formGame.get('is_clear_image').setValue(false);
                    this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                    this.scrollTop.scrollTopFom();
                }else{
                    this.gameService.updateGame(game_form_data, this.game.id, this.lang).subscribe(
                        (data) => {
                            this.game = data;
                            this.toastr.success(`Chỉnh sửa "${value_form.name}" thành công`);
                            this.router.navigate(['/game/list']);
                        },
                        (error) => {
                            // code 400, erro validate
                            if(error.status == 400){
                                this.errorMessage = JSON.parse(error.response).message;
                                this.scrollTop.scrollTopFom();
                            }else{
                                this.handleError.handle_error(error);
                            }
                        }
                    );
                }
            }
        }
        
    }

    /*
        Function deleteGameEvent(): confirm delete
        @author: Lam
    */
    deleteGameEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Trò Chơi này?",
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
         + Call service function onDelGame() by id to delete event
        Author: Lam
    */
    onDelete(): void {
        const id = this.game.id;
        this.gameService.onDelGame(id, this.lang).subscribe(
            (data) => {
                this.toastr.success(`Xóa "${this.formGame.value.name}" thành công`);
                this.router.navigate(['/game/list']);
            },
            (error) => {
                this.handleError.handle_error(error);
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
                } else {
                    promotionFormData.append(k, promotionValues[k]);
                }
            });
        }
        return promotionFormData;
    }

}
