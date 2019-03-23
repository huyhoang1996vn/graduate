import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Notification } from '../../../shared/class/notification';

@Component({
    selector: 'popup-edit-notification',
    templateUrl: './popup-edit-notification.component.html',
    styleUrls: ['./popup-edit-notification.component.css']
})
export class PopupEditNotificationComponent implements OnInit {

    /*
        Author: Lam
    */

    // Return 1 object to parent
    @Output() update_noti: EventEmitter<Notification> = new EventEmitter<Notification>();

    position = "popup"; // type http to form notification component 


    constructor() { }

    ngOnInit() { }

    /*
        Function updateNoti(): Get notification from component form-notification
        Author: Lam
    */
    updateNoti(event){
        this.update_noti.emit(event);
    }

}
