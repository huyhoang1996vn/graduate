from models import *
from rest_framework import permissions

class CustomCheckPermission(permissions.BasePermission):
    perms_map = {
        'GET': '',
        'OPTIONS': '',
        'HEAD': '',
        'POST': 'add_%(model_name)s',
        'PUT': 'change_%(model_name)s',
        'PATCH': 'change_%(model_name)s',
        'DELETE': 'delete_%(model_name)s',
    }

    def has_permission(self, request, view):
        print "***** check has_object_permissions ****"

        if request.method in permissions.SAFE_METHODS:
            return True
        if not(request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        kwargs = {
            # 'app_label': view.queryset.model._meta.app_label,
            'model_name': view.queryset.model._meta.model_name
        }
        codename = self.perms_map[request.method] % kwargs
        group = request.user.groupUser
        is_allow = GroupUserPermissions.objects.filter( codename = codename, groupUser = group)
        return True if is_allow else False

        

    # def has_object_permission(self, request, view, obj):
    #     print "***** check has_object_permissions ****"
    #     group = request.user.groupUser
    #     # permission = group.group_per_rel.all()
    #     model_name = obj.__class__.__name__
    #     if request.method == 'POST':
    #     	codename = 'add_%s'%(lower(model_name))
    #     	is_allow = GroupUserPermissions.objects.filter( codename = codename, groupUser = group)
    #     	return True if is_allow else False



