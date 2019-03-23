import { FormControl } from '@angular/forms';


export class ImageValidators {

    /*
        Function validateFile(): validate iamge accept jpg, jpeg, png, ico, bmp
        Author: Lam
    */
    static validateFile(c: FormControl) {
        if(c.value){
            // get name image, set "default.jpg" in case update
            // Case Update: data is a string 'media/abc/xyz.jpg', when choose image is a object {filename, value,...}
            let name = c.value.filename ? c.value.filename : 'default.jpg';
            let extension = {'jpg': true, 'jpeg': true, 'png': true, 'ico': true, 'bmp': true, 'gif': true};
            // get imgae format
            let ext = name.substring(name.lastIndexOf('.') + 1);
            // check image format
            if (ext.toLowerCase() in extension) {
                return null;
            }
            return {
                'fomatFile': {
                    'message': 'Vui lòng tải tệp lên với các định dạng này (jpg, jpeg, png, ico, bmp)'
                }
            };
        }
    }

    /*
        Function validateMultiFile(): validate iamge accept jpg, jpeg, png, ico, bmp
        Author: Lam
    */
    static validateMultiFile(c: FormControl) {
        if(c.value){
            let is_valid = true; 
            // check image of list mutil image 
            c.value.forEach(function(element){
                if(element.image){
                    // get name image, set "default.jpg" in case update
                    // Case Update: data is a string 'media/abc/xyz.jpg', when choose image is a object {filename, value,...}
                    let name = element.image.filename ? element.image.filename : 'default.jpg';
                    let extension = {'jpg': true, 'jpeg': true, 'png': true, 'ico': true, 'bmp': true, 'gif': true};
                    // get imgae format
                    let ext = name.substring(name.lastIndexOf('.') + 1);
                    // check image format
                    if (!(ext.toLowerCase() in extension)) {
                        is_valid = false;
                    }
                }
                
            })
            if(is_valid === true){
                return null;
            }
            return {
                'fomatMultiFile': {
                    'message': 'Vui lòng tải tệp lên với các định dạng này (jpg, jpeg, png, ico, bmp)'
                }
            };
        }
    }
}