from django.core.management.base import BaseCommand, CommandError
from app.models import *
import datetime    
from django.utils import timezone

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        try:
            now_sub_15_munite = timezone.localtime(timezone.now()) - datetime.timedelta(minutes = 15)
            order = OrderInfomations.objects.filter(created__lte = (now_sub_15_munite), status_payment = 'pending', payment_method = 'paypal')
            print 'Order ',order
            print 'Time ', timezone.localtime(timezone.now()).strftime('%H:%M:%S - %d/%m/%Y')
            order.delete()
        except Exception, e:
            print 'Command ', e
            raise CommandError('Exception "%s" does not exist' % e)