#!/bin/bash
/bin/echo "cron works"
source /home/huyhoang/Documents/project_django_env/bin/activate
python /home/huyhoang/Documents/school_software/websites/manage.py cronjob_paypal
