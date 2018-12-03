from rest_framework.exceptions import PermissionDenied, NotAuthenticated
from models import GroupUserPermissions
from functools import wraps

def check_user_permission(list_permission):
	def decorator(function):
	    def wrap(request, *args, **kwargs):

	        # if request.method in ['GET',]:
	        #     return function(request, *args, **kwargs)
	        print '***** Decorator check_user_permission *****', list_permission

	        if request.user.is_superuser:
	            return function(request, *args, **kwargs)
	        
	        if not(request.user and request.user.is_authenticated):
	            raise NotAuthenticated

	        group = request.user.groupUser
	        for codename in list_permission:
	            print 'codename: %s, group: %s' %(codename, group)
	            is_allow = GroupUserPermissions.objects.filter( codename = codename, groupUser = group)
	            if not is_allow:
	                raise PermissionDenied

	        return function(request, *args, **kwargs)
	        wrap.__doc__ = function.__doc__
	        wrap.__name__ = function.__name__
	    return wrap
	return decorator