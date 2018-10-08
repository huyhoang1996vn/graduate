# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from models import *
from rest_framework import viewsets
from serializers import *
# from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.decorators import login_required
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
    # filter_backends = (SearchFilter, OrderingFilter)
    filter_fields = ('category', 'stores')
    search_fields = ('name', )
    ordering_fields =  '__all__'

    def list(self, request):
        item = self.request.query_params.get('item', None)
        if item:
            result = Products.objects.all().order_by('created')[:item]
            productSerializer =  ProductSerializer(result, many=True)
            return Response(productSerializer.data)
        return super(ProductViewSet, self).list(request) 


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


@api_view(['GET',])
@login_required
def profile_user(request):
    try:
        user = request.user
        userSerializer = UserBaseSerializer(user)
        return Response(userSerializer.data)

    except Exception, e:
        print 'profile_user ', e
        error = {"code": 500, "message": _("Internal server error."), "fields": "", "flag": False}
        return Response(error, status=500)

