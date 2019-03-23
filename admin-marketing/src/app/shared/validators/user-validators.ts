import { FormControl, FormBuilder, FormArray, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export class UserValidators {

	static passwordValidators(c: FormControl): ValidationErrors {
		let passRegx = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
		let passVal = String($('#password').val());
		let passValues = passVal.match(passRegx);
		if(passValues === null && passVal !== '' && passVal.length < 32) {
			return {
                'passwordValidate': {
                    'message': 'Mật khẩu hợp lệ phải có ít nhất 6 ký tự bao gồm cả chữ và số.'
                }
            };
		}
        return null;	
	}

	static phoneValidators(fc: FormControl):ValidationErrors {
		// Allows only numerals betwen 
		let phoneRegx = /^[0-9].{9,10}$/;
		let phone = String($('#phone').val());
		let phoneValues = phone.match(phoneRegx);

		if(phoneValues === null && phone !== '') {
			return {
				'phoneValidate': {
					'message': 'Vui lòng nhập số điện thoại hợp lệ.'
				}
			};
		}
		return null;	
	}

	static emailValidators(fc: FormControl):ValidationErrors {
		let emailRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		let email = fc.value;
		let emailValue = email ? email.match(emailRegx): '';

		if(emailValue === null && email !== '') {
			return {
				'emailValidate': {
					'message': 'Vui lòng nhập địa chỉ email hợp lệ.'
				}
			}
		}
		return null;
	}

    birtdateValidators(message_error, date){
        const message = {
            'birtdateValidate': {
                'message': message_error
            }
        };
        // get today
        let today = new Date();
        // get day, month, year
        let formatDate = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
	    let date_now = moment(formatDate, "DD/MM/YYYY").toDate();
        // Get date by #id
        let getValdate = $('#'+date).val() ? moment($('#'+date).val(),"DD/MM/YYYY").toDate() : '';
        if(getValdate < date_now){
            return null;
        }
        return message;
    }

    static birtdateValidators(): ValidationErrors {
        let message = "Vui lòng nhập ngày sinh nhỏ hơn ngày hiện tại";
        let userValidators = new UserValidators();
        return userValidators.birtdateValidators(message, 'birth_date');
    }

	static formatBirtday(c: FormControl): ValidationErrors {
        if(c.dirty){
            let validatePattern = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/;
            let getValDate = String($('#birth_date').val());
            let dateValues = getValDate.match(validatePattern);
            if(getValDate === ''){
                return null;
            } else if (!getValDate.match(validatePattern)) {
            	return {
            		'birtdateValidate': {
                        'message': 'Định dạng ngày sai. Vui lòng chọn lại ngày dd/mm/yyyy'
                    }
            	}
            } else {
            	let splitArr = getValDate.split("/");
            	var dd=Number(splitArr[0]);
				var mm=Number(splitArr[1]);
				var yyyy=Number(splitArr[2]);
				var date = new Date(yyyy, mm-1, dd);
				if (((date.getDate()!=dd) || date.getMonth()+1!=mm)||(date.getFullYear()!=yyyy)) 
				{
					return {
						'birtdateValidate': {
							'message': 'Vui lòng nhập vào ngày hợp lệ'
						}
					}
				} else if (yyyy < 1900) {
					return {
						'birtdateValidate': {
							'message': 'Vui lòng chọn năm sinh lớn hơn 1900'
						}
					}
				}
            }
            return null;
        }
    }

    static validateSelectRole(c: FormControl): ValidationErrors {
    	let role = c.value;
    	if(role === 0 || role === null) {
    		return {
				'requiredSelectedRole': {
					'message': 'Trường này không được bỏ trống'
				}
			}
    	}
    	return null;
    }
	
}

