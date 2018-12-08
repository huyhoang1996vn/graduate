from django.core.management.base import BaseCommand, CommandError
from app.models import *
import datetime    


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    # def add_arguments(self, parser):
    #     parser.add_argument('poll_id', nargs='+', type=int)

    def handle(self, *args, **options):
        try:
            order = OrderInfomations.objects.filter( status_payment = 'pending', payment_method = 'paypal', created__lt = datetime.datetime.now() - datetime.timedelta(minutes = 15))
            print 'order ',order
            order.delete()
        except Exception, e:
            print 'Command ', e
            raise CommandError('Exception "%s" does not exist' % e)