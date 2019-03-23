import { PostImage } from './post-image';

export class Post {
    id: number;
    name: string;
    image: string;
    short_description: string;
    content: string;
    key_query: string;
    post_type: number;
    pin_to_top: boolean;
    is_draft: boolean;
    is_clear_image: boolean;
    posts_image: PostImage[];
}