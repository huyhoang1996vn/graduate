# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-09-30 11:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_auto_20180930_1143'),
    ]

    operations = [
        migrations.AddField(
            model_name='userbases',
            name='is_staff',
            field=models.BooleanField(default=False, verbose_name='staff status'),
        ),
    ]
