#!/bin/bash
/bin/echo "cron works"
source /home/ubuntu/project_env/bin/activate
python /home/ubuntu/school_software/websites/manage.py cronjob_paypal
