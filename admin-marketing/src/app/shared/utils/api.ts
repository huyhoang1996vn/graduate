import { env } from '../../../environments/environment';

export const api = {
    /* URL Promotion Detail Page*/
    promotion: 'promotion_detail/',
    /* URL Promotion List ( GET, DELETE list promotion )*/
    promotion_list: 'promotion_list/',
    /* URL User Promotion ( GET, PUT list promotion )*/
    user_promotion: 'user_promotion/',

    notification: 'notification_detail/',
    user_notification: 'user_notification/',
    notification_list: 'notification_list/',

    user: env.api_domain + 'user/',
    user_embed: env.api_domain + 'user_embed/',
    relate: env.api_domain + 'relate/',
    delete_relate: env.api_domain + 'delete_relate/',
    summary: env.api_domain + 'summary/',

    user_link_card: env.api_domain + 'user_link_card/',

    feedback: env.api_domain + 'feedback/',

    advertisement:'advertisement/',

    denomination: env.api_domain + 'denomination/',

    hot_advs: 'hot_advs/',

    promotion_label: 'promotion_label_detail/',
    promotion_label_list: 'promotion_label_list/',

    promotion_type: env.api_domain + 'promotion-type/',


    banner: env.api_domain + 'banner/',
    fee: env.api_domain + 'fee/',
    fee_list: env.api_domain + 'fee_list/',
    fee_apply: env.api_domain + 'apply_fee/',

    category_notifications: 'category_notifications/',

    hot: 'hot_detail/',
    hot_list: 'hot_list/',

    post: 'post_detail/',
    post_list: 'post_list/',


    event: 'event_detail/',
    event_list: 'event_list/',

    /* URL generator QR Code from Promotion ID ( POST )*/
    generator_QR_code: env.api_domain + 'generator_QR_code/',
    /* Get All Category */
    category_list: env.api_domain + 'category_list/',
    post_type_list: 'post_type_list/',
    login: env.api_domain +'accounts/login/',

    role_list: env.api_domain + 'role_list/',
    users_role: env.api_domain + 'users_role/',
    set_role: env.api_domain + 'set_role/',

    users: env.api_domain + 'users/',

    role: env.api_domain + 'role/',

    faq: 'faq_detail/',
    faq_list: 'faq_list/',

    game: 'game_detail/',

    game_list: 'game_list/',

    type_list: 'type_list/',

    account_users: env.api_domain + 'accounts/users/',

    notification_push: 'notification/push/',

    promotion_statistic: 'promotion_statistic/',

    opentime: env.api_domain + 'opentime/',

    user_role: env.api_domain + 'user_role/'

};
