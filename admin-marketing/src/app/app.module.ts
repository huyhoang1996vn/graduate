import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, RequestOptions, Http } from "@angular/http";
import { HttpClientModule } from '@angular/common/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { DataTablesModule } from 'angular-datatables';
import { AppRoutingModule } from './app.routing';
import { OwlDateTimeModule, OwlDateTimeIntl, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime'; // date and time
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { DatePipe } from '@angular/common';
import { MapToIterablePipe } from './shared/pipes/map-to-iterable.pipe';
import { SortStringPipe } from './shared/pipes/sort-string.pipe';
import { ToastrModule } from 'ngx-toastr'; // https://github.com/scttcper/ngx-toastr
import { FullCalendarModule } from 'ng-fullcalendar'; // https://github.com/Jamaks/ng-fullcalendar

import { AppComponent } from './app.component';
import { AddLinkCardComponent } from './components/link-card/add-link-card/add-link-card.component';
import { FormUserAppComponent } from './components/link-card/form-user-app/form-user-app.component';
import { FormUserEmbedComponent } from './components/link-card/form-user-embed/form-user-embed.component';
import { LinkCardDetailComponent } from './components/link-card/link-card-detail/link-card-detail.component';
import { ListNotificationComponent } from './components/notification/list-notification/list-notification.component';
import { UserMultiselectComponent } from './components/user-multiselect/user-multiselect.component';
import { AdvertisementListComponent } from './components/advertisement/advertisement-list/advertisement-list.component';
import { PromotionTypeListComponent } from './components/promotion-type/promotion-type-list/promotion-type-list.component';
import { DenominationListComponent } from './components/denomination/denomination-list/denomination-list.component';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { FeedbackDetailComponent } from './components/feedback/feedback-detail/feedback-detail.component';
import { NotificationDetailComponent } from './components/notification/notification-detail/notification-detail.component';
import { FormNotificationComponent } from './components/notification/form-notification/form-notification.component';
import { PopupEditNotificationComponent } from './components/notification/popup-edit-notification/popup-edit-notification.component';
import { ShowErrorValidComponent } from './components/show-error-valid/show-error-valid.component';
import { HotAdvsListComponent } from './components/hot-advs/hot-advs-list/hot-advs-list.component';

import { AdvertisementService } from './shared/services/advertisement.service';
import { PromotionTypeService } from './shared/services/promotion-type.service';
import { DenominationService } from './shared/services/denomination.service';
import { FeedbackService } from './shared/services/feedback.service';
import { CategoryService } from './shared/services/category.service';
import { BannerService } from './shared/services/banner.service';
import { ScrollTop } from './shared/commons/scroll-top';
import { AuthGuard } from './shared/auth/auth.guard';

import { StatisticsFeedbackComponent } from './components/feedback/statistics-feedback/statistics-feedback.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { LinkCardListComponent } from './components/link-card/link-card-list/link-card-list.component';
import { FeeListComponent } from './components/fee/fee-list/fee-list.component';
import { FeeService } from './shared/services/fee.service';
import { BannerListComponent } from './components/banner/banner-list/banner-list.component';

import { ListEventComponent } from './components/events/list-event/list-event.component';
import { ListFaqComponent } from './components/faqs/list-faq/list-faq.component';
import { FormFaqComponent } from './components/faqs/form-faq/form-faq.component';
import { ListGameComponent } from './components/games/list-game/list-game.component';
import { ListHotComponent } from './components/hots/list-hot/list-hot.component';
import { ListPostComponent } from './components/posts/list-post/list-post.component';
import { ListPromotionLabelComponent } from './components/promotion-labels/list-promotion-label/list-promotion-label.component';
import { FormPromotionLabelComponent } from './components/promotion-labels/form-promotion-label/form-promotion-label.component';
import { FormEventComponent } from './components/events/form-event/form-event.component';
import { FormGameComponent } from './components/games/form-game/form-game.component';
import { FormPostComponent } from './components/posts/form-post/form-post.component';
import { HomeComponent } from './components/home/home.component';
import { PromotionFormDetailComponent } from './components/promotions/promotion-form-detail/promotion-form-detail.component';
import { ListPromotionComponent } from './components/promotions/list-promotion/list-promotion.component';
import { UserPromotionComponent } from './components/promotions/user-promotion/user-promotion.component';
import { FormHotComponent } from './components/hots/form-hot/form-hot.component';
import { ErrorComponent } from './components/error/error.component';
import { UserPermissionComponent } from './components/user-permission/user-permission.component';
import { UserPermissionService } from './shared/services/user-permission.service';
import { LoginComponent } from './components/login/login.component';
import { VariableGlobals } from './shared/commons/variable_globals';
import { OpenTimeComponent } from './components/open-time/open-time.component';
import { PromotionReportComponent } from './components/promotions/promotion-report/promotion-report.component';
import { PopupEditPromotionComponent } from './components/promotions/popup-edit-promotion/popup-edit-promotion.component';
import { RolePermissionComponent } from './components/role-permission/role-permission.component';
import { FormAdvertisementComponent } from './components/advertisement/form-advertisement/form-advertisement.component';
import { FormBannerComponent } from './components/banner/form-banner/form-banner.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


import { AuthRequestOptions } from './shared/auth/auth-request';
import { FormDenominationComponent } from './components/denomination/form-denomination/form-denomination.component';
import { FormFeeComponent } from './components/fee/form-fee/form-fee.component';
import { FormHotAdvsComponent } from './components/hot-advs/form-hot-advs/form-hot-advs.component';

import { AuthHttp } from './shared/auth/auth-http';
import { HandleError } from './shared/commons/handle_error';

/*
    Translate datetime-picker
    author: Lam
*/
export const DefaultIntl = {
    /** A label for the cancel button */
    cancelBtnLabel: 'Hủy',
    /** A label for the set button */
    setBtnLabel: 'Chọn',
}

export const MY_MOMENT_FORMATS = {
    parseInput: 'DD/MM/YYYY LT',
    fullPickerInput: 'DD/MM/YYYY LT',
    datePickerInput: 'DD/MM/YYYY',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  declarations: [
    AppComponent,
    AddLinkCardComponent,
    FormUserAppComponent,
    FormUserEmbedComponent,
    LinkCardDetailComponent,
    ListNotificationComponent,
    UserMultiselectComponent,
    AdvertisementListComponent,
    PromotionTypeListComponent,
    DenominationListComponent,
    FeedbackListComponent,
    FeedbackDetailComponent,
    NotificationDetailComponent,
    FormNotificationComponent,
    PopupEditNotificationComponent,
    ShowErrorValidComponent,
    StatisticsFeedbackComponent,
    HotAdvsListComponent,
    UserListComponent,
    UserAddComponent,
    UserDetailComponent,
    LinkCardListComponent,
    FeeListComponent,
    BannerListComponent,
    ListEventComponent,
    ListFaqComponent,
    FormFaqComponent,
    ListGameComponent,
    ListHotComponent,
    ListPostComponent,
    ListPromotionLabelComponent,
    FormPromotionLabelComponent,
    FormEventComponent,
    FormGameComponent,
    FormPostComponent,
    HomeComponent,
    PromotionFormDetailComponent,
    ListPromotionComponent,
    UserPromotionComponent,
    FormHotComponent,
    ErrorComponent,
    UserPermissionComponent,
    LoginComponent,
    MapToIterablePipe,
    SortStringPipe,
    OpenTimeComponent,
    PromotionReportComponent,
    PopupEditPromotionComponent,
    RolePermissionComponent,
    FormAdvertisementComponent,
    FormBannerComponent,
    FormDenominationComponent,
    FormFeeComponent,
    FormHotAdvsComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    CKEditorModule,
    ReactiveFormsModule,
    DataTablesModule,
    AppRoutingModule,
    OwlDateTimeModule, 
    OwlMomentDateTimeModule,
    RecaptchaModule.forRoot(), // Keep in mind the "forRoot"-magic nuances!
    RecaptchaFormsModule,
    FullCalendarModule,
    ToastrModule.forRoot({
        positionClass: 'toast-top-full-width',
        maxOpened: 1,
        autoDismiss: true
    }), // ToastrModule added
    Ng4LoadingSpinnerModule.forRoot() //Ng Loading data
  ],
  providers: [
    AdvertisementService,
    PromotionTypeService,
    DenominationService,
    FeedbackService,
    FeeService,
    BannerService,
    CategoryService,
    AuthGuard,
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'vi'},
    {
        provide: OWL_DATE_TIME_FORMATS,
        useValue: MY_MOMENT_FORMATS
    },
    {provide: OwlDateTimeIntl, useValue: DefaultIntl},
    DatePipe,
    {provide: RECAPTCHA_LANGUAGE, useValue: 'vi'},
    UserPermissionService,
    VariableGlobals,
    ScrollTop,
    {
        provide: RequestOptions, 
        useClass: AuthRequestOptions
    },
    { provide: Http, useClass: AuthHttp },
    HandleError,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
