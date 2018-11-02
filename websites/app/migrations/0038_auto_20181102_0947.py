# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-11-02 09:47
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0037_auto_20181102_0456'),
    ]

    operations = [
        migrations.AlterField(
            model_name='groupuserpermissions',
            name='groupUser',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.GroupUsers'),
        ),
        migrations.AlterField(
            model_name='orderinfomations',
            name='customer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.Customers'),
        ),
        migrations.AlterField(
            model_name='products',
            name='supplier',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.Suppliers'),
        ),
        migrations.AlterField(
            model_name='userbases',
            name='groupUser',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.GroupUsers'),
        ),
    ]
