import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../shared/class/user';
import { LinkCardService } from '../../../shared/services/link-card.service';
import { FormUserAppComponent } from '../form-user-app/form-user-app.component';
import { FormUserEmbedComponent } from '../form-user-embed/form-user-embed.component';
import { ToastrService } from 'ngx-toastr';
import { HandleError } from '../../../shared/commons/handle_error';

@Component({
    selector: 'app-add-link-card',
    templateUrl: './add-link-card.component.html',
    styleUrls: ['./add-link-card.component.css'],
    providers: [LinkCardService]
})
export class AddLinkCardComponent implements OnInit {

    /*
        Author: Lam
    */

    // Inject the FormUserApp component into the private userappComponent property
    @ViewChild(FormUserAppComponent)
    private userappComponent: FormUserAppComponent;

    // Inject the FormUserEmbed component into the private userembedComponent property
    @ViewChild(FormUserEmbedComponent)
    private userembedComponent: FormUserEmbedComponent;

    // Check input fields 2 form
    status_error = {full_name: false, email: false, phone: false, birth_date: false, personal_id: false, address: false};

    is_btn_embed: boolean = true;
    is_btn_app: boolean = true;
    is_btn_linkcard: boolean = true;

    constructor(
        private linkCardService: LinkCardService, 
        private router: Router,
        private toastr: ToastrService,
        private handleError:HandleError
    ) { }

    ngOnInit() {
    }

    /*
        Function btnEmbed(): get data from form user embed, set disbale/undisable button link card
        Author: Lam
    */
    btnEmbed(event){
        this.is_btn_embed = event;
        if(this.is_btn_embed === false && this.is_btn_app === false){
            this.is_btn_linkcard = false;
        }else{
            this.is_btn_linkcard = true;
        }
    }

    /*
        Function btnApp(): get data from form user app, set disbale/undisable button link card
        Author: Lam
    */
    btnApp(event){
        this.is_btn_app = event;
        if(this.is_btn_embed === false && this.is_btn_app === false){
            this.is_btn_linkcard = false;
        }else{
            this.is_btn_linkcard = true;
        }
    }

    /*
        Function checkSubmitApp(): get data from form user app, set object status_error 
        Author: Lam
    */
    checkSubmitApp(event){
        if(event === true){
            this.status_error = {full_name: false, email: false, phone: false, birth_date: false, 
                personal_id: false, address: false};
        }
    }

    /*
        Function checkSubmitEmbed(): get data from form user embed, set object status_error 
        Author: Lam
    */
    checkSubmitEmbed(event){
        if(event === true){
            this.status_error = {full_name: false, email: false, phone: false, birth_date: false, 
                personal_id: false, address: false};
        }
    }

    /*
        Function onCardLink():
         + Step 1: get user_app and user_embed from component child through @ViewChild
         + Step 2: Foreach and equal field to check and show error
         + Step 3: If not error, call service function Relate to create link card
         + Create success redirect to  link-card/detail with params query email and barcode
        Author: Lam
    */
    onCardLink(): void{
        // get user app from user app component
        let user_app = this.userappComponent.user_app;
        // get user app from user embed component
        let user_embed = this.userembedComponent.user_embed;
        let isValid = false;
        // fields compare between user app and user embed
        let field_compare = {'full_name': '', 'email': '', 'phone': '', 'birth_date': '', 
            'personal_id': '', 'address': ''};

        // compare fields 
        Object.entries(user_app).forEach(([key, val]) => {
            if(key in field_compare){
                if(user_app[key] !== user_embed[key]){
                    this.status_error[key] = true;
                    isValid = true;
                }else{
                    this.status_error[key] = false;
                }
            }
        });
        
        // check isValid show error
        if(isValid){
            this.toastr.error(`Lỗi, yêu cầu các trường thông tin tài khoản và thẻ phải trùng nhau`);
        }else{
            this.linkCardService.relate(user_app.email, user_embed.barcode).subscribe(
                (data) => {
                    this.toastr.success(`Bạn đã thực hiện liên kết thẻ với tài khoản Helio thành công.`);
                    this.router.navigate(['/link-card/detail/', user_app.id,{ email: user_app.email, barcode: user_embed.barcode}]);
                },
                (error) => {
                    // code 400, error validate
                    this.handleError.handle_error(error);
                }
            );
        }
        
    }

}
