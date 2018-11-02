from django.core.management.base import BaseCommand, CommandError
from app.models import *


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    # def add_arguments(self, parser):
    #     parser.add_argument('poll_id', nargs='+', type=int)

    def handle(self, *args, **options):
        try:
            GroupUsers.objects.all().delete()
            models = [GroupUsers(name='customer', id=1), GroupUsers(
                name='store', id=2), GroupUsers(name='owner', id=3)]
            GroupUsers.objects.bulk_create(models)
        except Exception, e:
            print 'Command ', e
            raise CommandError('Exception "%s" does not exist' % e)
