# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from models import *
from rest_framework import viewsets
from serializers import *
# from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils.translation import ugettext_lazy as _
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
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
    # permission_classes = (AllowAny, )
    # authentication_classes = ()

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
@permission_classes((IsAuthenticated, ))
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
@permission_classes((IsAuthenticated, ))
def view_cart(request):
    try:
        user = request.user
        cart = Carts.objects.get(cus_cart_rel=user.cus_user_rel)
        cart_detail = CartDetail.objects.filter(cart = cart)
        serializer = CartDetailSerializer(cart_detail, context={'request': request}, many=True)
        total_price = 0
        for item in cart_detail:
            total_price += item.product.price * item.quanlity

        # serializer.data object is a instance of ReturnList that is immutable
        new_serializer_data = serializer.data
        new_serializer_data.append({'total_price': total_price})
        return Response(new_serializer_data)
    except Exception, e:
        print 'profile_user ', e
        error = {"code": 500, "message": _(
            "Internal server error."), "fields": "", "flag": False}
        return Response(error, status=500)


@api_view(['POST', ])
@permission_classes((IsAuthenticated, ))
def modify_cart(request):
    try:
        addCartSerializer = AddCartSerializer(data = request.data)
        if addCartSerializer.is_valid():
            product_id = addCartSerializer.data['product_id']
            quanlity = addCartSerializer.data['quanlity']

            customer = request.user.cus_user_rel
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

            '''
                Retrun total price after update cart 
            '''
            cart_detail = CartDetail.objects.filter(cart = customer.cart)
            total_price = 0
            for item in cart_detail:
                total_price += item.product.price * item.quanlity
            return Response({'total_price': total_price})
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



@api_view(['PUT'])
@permission_classes((IsAuthenticated, ))
@csrf_exempt
def change_passqord(request):
    try:

        passwod_serializer = PasswordSerializer(data= request.data)
        if passwod_serializer.is_valid():
            user = request.user
            
            if not user.check_password(passwod_serializer.data.get('old_password')):
                return Response({'message': _("The old password fields did not match.")}, status=400)
            
            user.set_password(passwod_serializer.data.get("new_password"))
            user.save()
            return Response({'message': _('success')})
        return Response(passwod_serializer.errors, status=400)

    except Exception, e:
        print 'Error change_passqord ', e
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)


# @api_view(['POST'])
# def payment(request):
#     try:
#         list_product = request.data.get('product', None)
#         money = request.data.get('money', None)

#         if not list_product:
#             return Response({'message': _('List product is required.')}, status=400)
#         for item in list_product:
#             product = Products.objects.get(id = item.product_id)
#             new_order = OrderInfomations( money = money )
#             new_order.save()
#             new_order.products.add(product)
            


#     except Exception, e:
#         print 'Error change_passqord ', e
#         error = {"code": 500, "message": "%s" % e, "fields": ""}
#         return Response(error, status=500)


