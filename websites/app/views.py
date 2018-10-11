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
    ordering_fields = '__all__'

    def list(self, request):
        item = self.request.query_params.get('item', None)
        if item:
            result = Products.objects.all().order_by('created')[:item]
            productSerializer = ProductSerializer(result, many=True, context={'request': request})
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


@api_view(['GET', 'PUT'])
@login_required
def profile_user(request):
    try:
        if request.method == 'GET':
            user = request.user
            userSerializer = ProfileSerializer(user)
            return Response(userSerializer.data)
        else:
            user = request.user
            userBaseSerializer = ProfileSerializer(
                instance=user, data=request.data)
            if userBaseSerializer.is_valid():
                userBaseSerializer.save()
                return Response(userBaseSerializer.data)
            return Response(userBaseSerializer.errors, status=400)
    except Exception, e:
        print 'profile_user ', e
        error = {"code": 500, "message": _(
            "Internal server error."), "fields": "", "flag": False}
        return Response(error, status=500)


@api_view(['GET', ])
@login_required
def view_cart(request):
    try:
        user = request.user
        cart = Carts.objects.get(cus_cart_rel=user.cus_user_rel)
        return Response(CartSerializer(cart).data)
    except Exception, e:
        print 'profile_user ', e
        error = {"code": 500, "message": _(
            "Internal server error."), "fields": "", "flag": False}
        return Response(error, status=500)


@api_view(['POST', ])
@login_required
def modify_cart(request):
    try:
        addCartSerializer = AddCartSerializer(data = request.data)
        if addCartSerializer.is_valid():
            product_id = addCartSerializer.data['product_id']
            quanlity = addCartSerializer.data['quanlity']

            customer = Customers.objects.get(user = request.user)
            cart_detail = CartDetail.objects.filter( cart = customer.cart, product = product_id )
            '''
                if cart detail exist then update or delete
                if not cart detail and quanlity > 0 then create 
            '''
            if cart_detail:
                if quanlity == 0:
                    cart_detail.delete()
                else:
                    cart_detail = cart_detail.get()
                    cart_detail.quanlity = quanlity
                    cart_detail.save()
            elif quanlity > 0:
                product = Products.objects.get( id = product_id )
                new_prodduct = CartDetail(cart = customer.cart, product = product, quanlity = quanlity)
                new_prodduct.save()

            return Response({'message':"success"})
        return Response(addCartSerializer.errors, status=400)

    except Customers.DoesNotExist:
        error = {"code": 400, "message": _(
            "Not found customer."), "fields": ""}
        return Response(error, status=400)
    except Exception, e:
        print 'modify_cart ', e
        error = {"code": 500, "message": _(
            "Internal server error."), "fields": ""}
        return Response(error, status=500)
