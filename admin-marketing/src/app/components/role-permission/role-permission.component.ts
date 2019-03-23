import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from './../../shared/class/role';
import { User } from './../../shared/class/user';
import { RolePermissionService } from './../../shared/services/role-permission.service';
import { ToastrService } from 'ngx-toastr';
import { ScrollTop } from './../../shared/commons/scroll-top';
import { HandleError } from '../../shared/commons/handle_error';
import { VariableGlobals } from '../../shared/commons/variable_globals';
import * as CONSTANT from '../../shared/commons/constant';
import * as moment from 'moment';
import * as config_auth from '../../shared/auth/reset-auth-data';

@Component({
    selector: 'app-role-permission',
    templateUrl: './role-permission.component.html',
    styleUrls: ['./role-permission.component.css'],
    providers: [RolePermissionService]
})
export class RolePermissionComponent implements OnInit {

    roles: Role[];
    user_current: User;
    models = [];
    list_role_permission = [];
    SYSTEM_ADMIN: number;
    PROMOTION_TYPE: string;
    // check permission to display page
    error_permission:boolean = false;

    constructor(
        private router: Router,
        private rolePermissionService: RolePermissionService,
        private toastr: ToastrService,
        private scrollTop: ScrollTop,
        private variable_globals: VariableGlobals,
        private handleError:HandleError
    ) { }

    ngOnInit() {
        this.getRole();
        this.SYSTEM_ADMIN =  CONSTANT.SYSTEM_ADMIN;
        this.PROMOTION_TYPE = CONSTANT.PROMOTION_TYPE;
        this.user_current = this.variable_globals.user_current;
    }

    /*
        Function getRolePermission(): call service function getRolePermission() get all models
        Author: Lam
    */
    getRolePermission(){
        this.models = null;
        this.rolePermissionService.getRolePermission().subscribe(
            (data) => {
                this.models = data;
                setTimeout(() => {
                    this.initCheckedRolePermission();
                }, 500);
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        Function getRole(): call service function getRole() get all Roles
        Author: Lam
    */
    getRole(){
        this.rolePermissionService.getRole().subscribe(
            (data) => {
                this.roles = data;
                this.getRolePermission();
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

    /*
        Function changePermission()
         + Step 1: Get class and id of every input
         + Step 2: checked, unchecked input have .class, checked #id, find index and set/push data
         + Step 3: unchecked, remove object
        Author: Lam
    */
    changePermission(event, model, role, permission){
        // get class of every input
        let getClass = `permission-${model.id}-${role.id}`;
        // get index
        let index = this.list_role_permission.findIndex(item => (item.key_model === model.key && item.role === role.id));
        if(event.target.checked){
            // unchecked input except this input
            $('.'+getClass).not('#'+event.target.id).prop('checked', false);
            // not found index
            if(index == -1){
                // push object for list role permission
                this.list_role_permission.push({key_model: model.key, role: role.id, permission: permission});
            }else{
                // reset permission 
                this.list_role_permission[index].permission = permission;
            }
        }else{
            // unchecked this input
            event.target.checked = false;
            // check is exist in object of list role permission
            if(this.list_role_permission[index].id){
                // ser permission empty
                this.list_role_permission[index].permission = '';
            }else{
                // remove object in list role permission
                this.list_role_permission.splice(index, 1);
            }
        }
    }

    /*
        Function initCheckedRolePermission(): init, get all permission role and set checked for input
        Author: Lam
    */
    initCheckedRolePermission(){
        // each models
        this.models.map(model => {
            // each model permission full
            model.permission.full.map(item => {
                // push object into list_role_permission
                this.list_role_permission.push({id: item.id,key_model: model.key, role: item.role.id, permission: 'full'});
                // checked input 
                $('#full-'+model.id+'-'+item.role.id).prop('checked', true);
            });
            // each model permission change
            model.permission.change.map(item => {
                // push object into list_role_permission
                this.list_role_permission.push({id: item.id,key_model: model.key, role: item.role.id, permission: 'change'});
                // checked input 
                $('#change-'+model.id+'-'+item.role.id).prop('checked', true);
            });
            // each model permission read
            model.permission.read.map(item => {
                // push object into list_role_permission
                this.list_role_permission.push({id: item.id,key_model: model.key, role: item.role.id, permission: 'read'});
                // checked input 
                $('#read-'+model.id+'-'+item.role.id).prop('checked', true);
            });
        });
    }

    /*
        Function onSubmit(): call service saveRolePermission() create and update data
        Author: Lam
    */
    onSubmit(){
        var exp = localStorage.getItem('time');
        if (exp && moment().valueOf() > parseInt(exp)) {
            config_auth.resetAuthData();
            return this.router.navigate(['/login']);
        }

        this.list_role_permission = this.list_role_permission.filter(item => item.permission !== '');
        this.rolePermissionService.saveRolePermission(this.list_role_permission).subscribe(
            (data) => {
                this.toastr.success("Lưu thành công");
                this.list_role_permission = [];
                this.getRolePermission();
                this.scrollTop.scrollTopFom();
            },
            (error) => {
                this.handleError.handle_error(error);
            }
        );
    }

}
