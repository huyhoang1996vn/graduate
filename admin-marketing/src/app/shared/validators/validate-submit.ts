import { FormControl, FormGroup } from '@angular/forms';

export class ValidateSubmit {

    /*
        Function validateAllFormFields(): show error fields when submit form
        Author: Lam
    */
    static validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }
}

