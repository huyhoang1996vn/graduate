import { FormControl, FormBuilder, FormArray, ValidationErrors } from '@angular/forms';

export class DenominationValidators {

	static denominationValidators(c: FormControl): ValidationErrors {
		let denomiVal = c.value;
		let val_num = denomiVal ? denomiVal.replace(/,/g, '') : denomiVal;

		if (!denomiVal) {
			return;
		} else
		if (isNaN(val_num)) {
			return {
            	'denominationValidate': {
                	'message': 'Vui lòng nhập mệnh giá tiền hợp lệ.'
            	}
        	};
		} else if (Number(val_num) == 0) {
			return {
            	'denominationValidate': {
                	'message': 'Vui lòng nhập mệnh giá tiền lớn hơn 0.'
            	}
        	};
		}
    	return null; 

	}
}