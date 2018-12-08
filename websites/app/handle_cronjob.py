from django_cron import CronJobBase, Schedule
from models import *
import datetime    

class MyCronJob(CronJobBase):
    RUN_EVERY_MINS = 1 # every 2 hours

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'app.handle_cronjob.MyCronJob'    # a unique code

    def do(self):
    	print 'hoang', datetime.datetime.now()
        order = OrderInfomations.objects.filter( status_payment = 'pending', payment_method = 'paypal', created__lt = datetime.datetime.now() - datetime.timedelta(minutes = 15))
        print 'order ',order
        order.delete()
