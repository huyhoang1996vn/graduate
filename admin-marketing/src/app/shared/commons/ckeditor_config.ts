import { env } from './../../../environments/environment';

export let config = {
    language: 'vi',
    filebrowserUploadUrl: env.api_domain_root+'/admin/ckeditor/upload/',
    extraPlugins:'youtube',
    tabSpaces:4
}