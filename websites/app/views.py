# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from models import *
from rest_framework import viewsets
from serializers import *
from rest_framework.filters import SearchFilter, OrderingFilter
# Create your views here.

def home(request):
    print "***START Power Card Introduction PAGE***"
    # try:
    return render(request, 'websites/home.html')
    # except Exception, e:
    #     print "Error: ", e
    #     raise Exception( "ERROR : Internal Server Error .Please contact administrator.")




class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = UserBases.objects.all().order_by('-date_joined')
    serializer_class = UserBaseSerializer



class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    filter_backends = (SearchFilter, OrderingFilter)
    filter_fields = ('category', 'stores')
    search_fields = ('name', )
    ordering_fields =  '__all__'



class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Categories.objects.all()
    serializer_class = CategorySerializer



class OwnerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Owners.objects.all()
    serializer_class = OwnerSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Customers.objects.all()
    serializer_class = CustomerSerializer



