# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from push_notifications.models import WebPushDevice
from django.shortcuts import render, redirect
from django.utils.translation import ugettext_lazy as _
from rest_framework import viewsets, mixins
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework import status

def paypal_interact(request):
    print "***START Power Card Introduction PAGE***"
    return render(request, 'websites/paypal_interact.html')

def push_notification(request):
    print "***START push_notification PAGE***"
    return render(request, 'websites/push_notification.html')



@api_view(['POST'])
# @permission_classes((IsAuthenticated, ))
def connect_notification(request):
    try:
        data = request.data
        check_exist_user = WebPushDevice.objects.filter(
            user=request.user,
            registration_id=data["registration_id"],
        )
        print'check_exist_user', check_exist_user
        if not check_exist_user:
            device = WebPushDevice(
                name=request.user.email,
                user=request.user,
                registration_id=data["registration_id"],
                p256dh=data["p256dh"],
                auth=data["auth"],
                browser=data["browser"],
            )
            device.save()

        return Response({'message': _('Thành công.')})
    except Exception, e:
        print 'connect_notification ', e
        return Response({"code": 500, "message": _("Lỗi hệ thống"), "fields": ""}, status=500)


@api_view(['POST'])
def send_notification(request):
    try:
        device = WebPushDevice.objects.filter(name = 'tri@gmail.com')
        print(device)
        
        device.send_message("hello")
        return Response({'message': _('Thành công.')})
    except Exception, e:
        print 'connect_notification ', e
        return Response({"code": 500, "message": _("Lỗi hệ thống"), "fields": ""}, status=500)




    