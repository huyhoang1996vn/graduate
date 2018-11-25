""" Deployment of your django project.
"""
from __future__ import with_statement
from fabric.api import *
 # sudo gedit /usr/lib/python2.7/dist-packages/paramiko/transport.py


env.hosts = ['52.14.71.211']
env.user = "ubuntu"
env.key_filename = '~/.ssh/aws_tinh.pem'

def update_django_project():
    """ Updates the remote django project.
    """
    with cd('/home/ubuntu/school_software'):
        run('git pull origin master')
        with prefix('source /home/ubuntu/project_env/bin/activate'):
            run('pip install -r websites/requirement.txt')
        #     # run('python manage.py syncdb')
            run('websites/manage.py migrate') # if you use south
        #     run('python manage.py collectstatic --noinput')

def restart_webserver():
    """ Restarts remote nginx and uwsgi.
    """
    sudo("service nginx configtest")
    sudo("service nginx restart")
    sudo("service uwsgi restart")


def hello(name="world"):
    print("Hello %s!" % name)

def deploy():
    """ Deploy Django Project.
    """
    hello()
    update_django_project()
    restart_webserver()
    # local("git pull origin master")