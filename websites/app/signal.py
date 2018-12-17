from django.contrib.auth.models import User
from models import *
from django.db.models.signals import post_save, post_delete


'''
	Add group to created User
'''
def save_customer_group(sender, instance, **kwargs):
	print "** Acess Signal save_customer_group ***"
	try:
		groupUser = GroupUsers.objects.get(name=GroupUsers.CUSTOMER)
		instance.user.groupUser = groupUser
		instance.user.save()
	except Exception, e:
		print "Error: ", e
		raise Exception( "ERROR : Internal Server Error .Please contact administrator.")


post_save.connect(save_customer_group, sender=Customers)



def save_store_group(sender, instance, **kwargs):
	print "** Acess Signal save_store_group ***"
	try:
		group_store = GroupUsers.objects.get(name=GroupUsers.STORE)
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
		group_owner = GroupUsers.objects.get(name = GroupUsers.OWNER)
		instance.user.groupUser = group_owner
		instance.user.save()
	except Exception, e:
		print "Error: ", e
		raise Exception( "ERROR : Internal Server Error .Please contact administrator.")


post_save.connect(save_owner_group, sender=Owners)


'''
	When delete order, return cont in product
'''

def return_count_product(sender, instance, **kwargs):
    print "** Acess Signal return_count_product ***"
    try:
        order_info = instance.orderInfomation
        if order_info.payment_method == 'paypal' and order_info.status_payment == 'pending':
            product = instance.product
            product.count_in_stock += instance.quantity
            product.save()

    except Exception, e:
        print "Error: ", e
        raise Exception( "ERROR : Internal Server Error .Please contact administrator.")


post_delete.connect(return_count_product, sender=OrderDetails)
