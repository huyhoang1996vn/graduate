from django.contrib.auth.models import User
from models import *
from django.db.models.signals import post_save


def save_customer_group(sender, instance, **kwargs):
	print "** Acess Signal save_customer_group ***"
	try:
		groupUser = GroupUsers.objects.get(name='customer_group')
		instance.user.groupUser = groupUser
		instance.user.save()
	except Exception, e:
		print "Error: ", e
		raise Exception( "ERROR : Internal Server Error .Please contact administrator.")


post_save.connect(save_customer_group, sender=Customers)



def save_store_group(sender, instance, **kwargs):
	print "** Acess Signal save_store_group ***"
	try:
		group_store = GroupUsers.objects.get(name='store_group')
		print 'instance.user ', instance.user
		instance.user.groupUser = group_store
		instance.user.save()
	except Exception, e:
		print "Error: ", e
		raise Exception( "ERROR : Internal Server Error .Please contact administrator.")


post_save.connect(save_store_group, sender=Stores)



def save_owner_group(sender, instance, **kwargs):
	print "** Acess Signal save_owner_group ***"
	try:
		group_owner = GroupUsers.objects.get(name = 'owner_group')
		instance.user.groupUser = group_owner
		instance.user.save()
	except Exception, e:
		print "Error: ", e
		raise Exception( "ERROR : Internal Server Error .Please contact administrator.")


post_save.connect(save_owner_group, sender=Owners)

