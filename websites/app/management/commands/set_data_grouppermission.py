from django.core.management.base import BaseCommand, CommandError
from app.models import *
from django.contrib.auth.models import Permission

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    # def add_arguments(self, parser):
    #     parser.add_argument('poll_id', nargs='+', type=int)

    def handle(self, *args, **options):
        try:

            list_permissions = Permission.objects.all()
            models = [ GroupUserPermissions(
                name = item.name,
                codename = item.codename
                ) for item in list_permissions]

            GroupUserPermissions.objects.bulk_create( models )
        except Exception, e:
            print 'Command ', e
            raise CommandError( 'Exception "%s" does not exist' % e )