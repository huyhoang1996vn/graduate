import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLinkCardComponent } from './components/link-card/add-link-card/add-link-card.component';
import { LinkCardDetailComponent } from './components/link-card/link-card-detail/link-card-detail.component';
import { LinkCardListComponent } from './components/link-card/link-card-list/link-card-list.component';
import { ListNotificationComponent } from './components/notification/list-notification/list-notification.component';
import { FormNotificationComponent } from './components/notification/form-notification/form-notification.component';
import { NotificationDetailComponent } from './components/notification/notification-detail/notification-detail.component';
import { AdvertisementListComponent } from './components/advertisement/advertisement-list/advertisement-list.component';
import { FormAdvertisementComponent } from './components/advertisement/form-advertisement/form-advertisement.component';
import { PromotionTypeListComponent } from './components/promotion-type/promotion-type-list/promotion-type-list.component';
import { FormDenominationComponent } from './components/denomination/form-denomination/form-denomination.component';
import { DenominationListComponent } from './components/denomination/denomination-list/denomination-list.component';
import { FeedbackDetailComponent } from './components/feedback/feedback-detail/feedback-detail.component';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { StatisticsFeedbackComponent } from './components/feedback/statistics-feedback/statistics-feedback.component';
import { FormHotAdvsComponent } from './components/hot-advs/form-hot-advs/form-hot-advs.component';
import { HotAdvsListComponent } from './components/hot-advs/hot-advs-list/hot-advs-list.component';
import { UserAddComponent } from './components/user/user-add/user-add.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserDetailComponent } from './components/user/user-detail/user-detail.component';
import { FeeListComponent } from './components/fee/fee-list/fee-list.component';
import { FormFeeComponent } from './components/fee/form-fee/form-fee.component';
import { BannerListComponent } from './components/banner/banner-list/banner-list.component';
import { FormBannerComponent } from './components/banner/form-banner/form-banner.component';

import { ListEventComponent } from './components/events/list-event/list-event.component';
import { FormEventComponent } from './components/events/form-event/form-event.component';
import { ListFaqComponent } from './components/faqs/list-faq/list-faq.component';
import { FormFaqComponent } from './components/faqs/form-faq/form-faq.component';
import { ListGameComponent } from './components/games/list-game/list-game.component';
import { FormGameComponent } from './components/games/form-game/form-game.component';
import { ListHotComponent } from './components/hots/list-hot/list-hot.component';
import { FormHotComponent } from './components/hots/form-hot/form-hot.component';
import { ListPostComponent } from './components/posts/list-post/list-post.component';
import { FormPostComponent } from './components/posts/form-post/form-post.component';
import { ListPromotionLabelComponent } from './components/promotion-labels/list-promotion-label/list-promotion-label.component';
import { FormPromotionLabelComponent } from './components/promotion-labels/form-promotion-label/form-promotion-label.component';

import { HomeComponent } from './components/home/home.component';
import { PromotionFormDetailComponent } from './components/promotions/promotion-form-detail/promotion-form-detail.component';
import { ListPromotionComponent } from './components/promotions/list-promotion/list-promotion.component';
import { UserPromotionComponent } from './components/promotions/user-promotion/user-promotion.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { AuthGuard } from './shared/auth/auth.guard';

import { UserPermissionComponent } from './components/user-permission/user-permission.component';
import { OpenTimeComponent } from './components/open-time/open-time.component'
import { PromotionReportComponent } from './components/promotions/promotion-report/promotion-report.component';
import { RolePermissionComponent } from './components/role-permission/role-permission.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


const routes: Routes = [{
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'promotions',
        component: ListPromotionComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'users-promotions/:id',
        component: UserPromotionComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'promotions/:id/change',
        component: PromotionFormDetailComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'promotions/add',
        component: PromotionFormDetailComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'advertisement-list',
        component: AdvertisementListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'advertisement-detail/:id',
        component: FormAdvertisementComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'advertisement-add',
        component: FormAdvertisementComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'promotion-type-list',
        component: PromotionTypeListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'denomination-add',
        component: FormDenominationComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'denomination-detail/:id',
        component: FormDenominationComponent,
        canActivate: [AuthGuard]
    },{
        path: 'denomination-list',
        component: DenominationListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'feedback-list',
        component: FeedbackListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'feedback-detail/:id',
        component: FeedbackDetailComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'hot-advs-add',
        component: FormHotAdvsComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'hot-advs-detail/:id',
        component: FormHotAdvsComponent,
        canActivate: [AuthGuard]
    },{
        path: 'hot-advs-list',
        component: HotAdvsListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'user-add',
        component: UserAddComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'user-list',
        component: UserListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'user-detail/:id',
        component: UserDetailComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'link-card-list',
        component: LinkCardListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'banner-add',
        component: FormBannerComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'banner-list',
        component: BannerListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'banner-detail/:id',
        component: FormBannerComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'feedback/statistics',
        component: StatisticsFeedbackComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'link-card/add',
        component: AddLinkCardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'link-card/detail/:id',
        component: LinkCardDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'notification/list',
        component: ListNotificationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'notification/add',
        component: FormNotificationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'notification/edit/:id',
        component: FormNotificationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'notification/detail/:id',
        component: NotificationDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'fee/list',
        component: FeeListComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'fee/detail/:id',
        component: FormFeeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'fee/add',
        component: FormFeeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'event/list',
        component: ListEventComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'event/add',
        component: FormEventComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'event/edit/:id',
        component: FormEventComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'faq/list',
        component: ListFaqComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'faq/add',
        component: FormFaqComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'faq/edit/:id',
        component: FormFaqComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'game/list',
        component: ListGameComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'game/add',
        component: FormGameComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'game/edit/:id',
        component: FormGameComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'hot/list',
        component: ListHotComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'hot/add',
        component: FormHotComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'hot/edit/:id',
        component: FormHotComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'post/list',
        component: ListPostComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'post/add',
        component: FormPostComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'post/edit/:id',
        component: FormPostComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'promotion-label/list',
        component: ListPromotionLabelComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'promotion-label/add',
        component: FormPromotionLabelComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'promotion-label/edit/:id',
        component: FormPromotionLabelComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'user-permission',
        component: UserPermissionComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'open-time',
        component: OpenTimeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'promotions/report/:id',
        component: PromotionReportComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'role-permission',
        component: RolePermissionComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'error',
        component: ErrorComponent
    },
    {
        path: '404',
        component: NotFoundComponent
    },
    {path: '**', redirectTo: '/404'},

];
// imports: [ RouterModule.forRoot(routes, { useHash: true })],
@NgModule({
    imports: [ RouterModule.forRoot(routes)],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
