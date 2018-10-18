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
import uuid
import requests
import urlparse
from main.settings import credentials
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
            productSerializer = ProductSerializer(
                result, many=True, context={'request': request})
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
        cart_detail = CartDetail.objects.filter(cart=cart)
        serializer = CartDetailSerializer(
            cart_detail, context={'request': request}, many=True)
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
        addCartSerializer = AddCartSerializer(data=request.data)
        if addCartSerializer.is_valid():
            product_id = addCartSerializer.data['product_id']
            quanlity = addCartSerializer.data['quanlity']

            customer = request.user.cus_user_rel
            cart_detail = CartDetail.objects.filter(
                cart=customer.cart, product=product_id)
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
                product = Products.objects.get(id=product_id)
                new_prodduct = CartDetail(
                    cart=customer.cart, product=product, quanlity=quanlity)
                new_prodduct.save()

            '''
                Retrun total price after update cart 
            '''
            cart_detail = CartDetail.objects.filter(cart=customer.cart)
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
def change_passqord(request):
    try:

        passwod_serializer = PasswordSerializer(data=request.data)
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


'''
Create order for ship code
'''


@api_view(['POST'])
def create_order(request):
    try:
        data_product = request.data.pop('product', None)
        money = request.data.pop('money', None)
        customer = request.user.cus_user_rel if request.user.is_authenticated() else None

        if not data_product or not money:
            return Response({'message': _('List product and money is required.')}, status=400)

        shipSerializer = ShipSerializer(data=request.data)
        if not shipSerializer.is_valid():
            return Response(shipSerializer.errors, status=400)
        '''
        Loop dict: key = store_id, value = product object
        Create order with customer and store
        Add associattion product with order in orderdetail
        '''

        for store_id, list_product in data_product.items():
            try:
                store = Stores.objects.get(id=store_id)
                new_order = OrderInfomations(status_payment='pendding', payment_method='ship_code', status_order='waiting',
                                             money=money, store=store, customer=customer, order_code=uuid.uuid4())
                new_order.save()

                for item in list_product:
                    product = Products.objects.get(id=item['product_id'])
                    order_detail = OrderDetails(
                        product=product, orderInfomation=new_order, quanlity=item['quanlity'])
                    order_detail.save()

            except Products.DoesNotExist, e:
                return Response({"code": 400, "message": "Products not found.", "fields": ""}, status=400)
            except Stores.DoesNotExist, e:
                return Response({"code": 400, "message": "Store not found.", "fields": ""}, status=400)

            # Associate shipinfo with order
            shipSerializer.save(order=new_order.id)
            return Response({'message': _('success')})

    except Exception, e:
        print 'Error change_passqord ', e
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)



'''
    Make request paypal to get token
'''

@api_view(['GET'])
def redirect_paypal(request):
    try:
        money = request.query_params.get('money', None)
        if not money:
            return Response({'message': _('Money is required.')}, status=400)

        data = {
            'USER': credentials['USER'],
            'PWD': credentials['PWD'],
            'SIGNATURE': credentials['SIGNATURE'],
            'METHOD': 'SetExpressCheckout',
            'VERSION': 86,
            'PAYMENTREQUEST_0_PAYMENTACTION': 'SALE',
            'PAYMENTREQUEST_0_AMT': money,           
            'PAYMENTREQUEST_0_CURRENCYCODE': 'USD',
            # For use if the consumer decides not to proceed with payment
            'cancelUrl': "http://127.0.0.1:8000/api/paypal/confirm",
            # For use if the consumer proceeds with payment
            'returnUrl': "http://127.0.0.1:8000/api/paypal/confirm"
        }
        PAYPAL_URL = 'https://www.sandbox.paypal.com/webscr&cmd=_express-checkout&token='
        # gets the response and parse it.
        response = requests.post(
            'https://api-3t.sandbox.paypal.com/nvp', data=data)
        print 'Result redirect_paypal: ', response.text

        response_token = dict(urlparse.parse_qsl(response.text))['TOKEN']
        # gather the response token and redirect to paypal to authorize the
        # payment
        rurl = PAYPAL_URL+response_token
        return Response(rurl)
    except Exception, e:
        print 'Error change_passqord ', e
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)


'''
    Get detail transaction payment
'''

@api_view(['GET'])
def payment_confirm(request):
    try:
        token = request.query_params.get('token', None)
        payerID = request.query_params.get('PayerID', None)
        if not token or not payerID:
            return Response({'message': _('List token and payerID is required.')}, status=400)

        data = {
            'USER': credentials['USER'],
            'PWD': credentials['PWD'],
            'SIGNATURE': credentials['SIGNATURE'],
            'METHOD': 'GetExpressCheckoutDetails',
            'VERSION': 93,
            'TOKEN': token
        }

        response = requests.post(
            'https://api-3t.sandbox.paypal.com/nvp', data=data)
        result = dict(urlparse.parse_qsl(response.text))

        print 'Result payment_confirm: ', result
        status = result['ACK']
        if status.lower() in ('success', 'successwithwarning'):
            info_return = {}
            info_return['PAYERID'] = result['PAYERID']
            info_return['TOKEN'] = result['TOKEN']
            info_return['currency'] = result['CURRENCYCODE']
            info_return['money'] = result['PAYMENTREQUEST_0_AMT']
            return Response({'message': info_return})
        return Response({'message': result}, status=400)

    except Exception, e:
        print 'Error change_passqord ', e
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)

'''
    Make request to facilitator get amout from buyer
'''

def handle_payment(token, payerID, money):
    response_data = {}
    response_data['status'] = False
    try:

        data = {
            'USER': credentials['USER'],
            'PWD': credentials['PWD'],
            'SIGNATURE': credentials['SIGNATURE'],
            'METHOD': 'DoExpressCheckoutPayment',
            'VERSION': 93,
            'TOKEN': token,
            'PAYERID': payerID,
            'PAYMENTREQUEST_0_PAYMENTACTION': 'SALE',
            'PAYMENTREQUEST_0_AMT': money,
            'PAYMENTREQUEST_0_CURRENCYCODE': 'USD',
        }

        response = requests.post(
            'https://api-3t.sandbox.paypal.com/nvp', data=data)
        result_paypal = dict(urlparse.parse_qsl(response.text))

        print 'Result handle_payment: ', result_paypal

        status = result_paypal['ACK']
        if status.lower() in ('success', 'successwithwarning'):
            response_data['status'] = True
            info_pay = {}
            response_data['money'] = result_paypal['PAYMENTINFO_0_AMT']
            response_data['currency'] = result_paypal[
                'PAYMENTINFO_0_CURRENCYCODE']
            response_data['fee_charge'] = result_paypal['PAYMENTINFO_0_FEEAMT']
            response_data['account_given'] = result_paypal[
                'PAYMENTINFO_0_SELLERPAYPALACCOUNTID']
            response_data['payerID'] = payerID
            response_data['transaction_id'] = result_paypal[
                'PAYMENTINFO_0_TRANSACTIONID']

            return response_data
        return response_data

    except Exception, e:
        print 'Error handle_payment ', e
        return response_data



'''
    Create order after payment by paypal
'''

@api_view(['POST'])
def payment(request):
    try:
        data_product = request.data.pop('product', None)
        money = request.data.pop('money', None)
        token = request.data.get('token', None)
        payerID = request.data.get('PayerID', None)

        if not token or not payerID:
            return Response({'message': _('List token and payerID is required.')}, status=400)
        if not data_product or not money:
            return Response({'message': _('List product and money is required.')}, status=400)

        shipSerializer = ShipSerializer(data=request.data)
        if not shipSerializer.is_valid():
            return Response(shipSerializer.errors, status=400)
        '''
        Call handle payment
        '''
        customer = request.user.cus_user_rel if request.user.is_authenticated() else None
        status_payment = 'payment_error'
        response = handle_payment(token, payerID, money)
        print 'Result response ', response

        if response['status'] == True:
            status_payment = 'done'
            transaction_id = response['transaction_id']
            payer_id = response['payerID']
        '''
        Loop dict: key = store_id, value = product object
        Create order with customer and store
        Add associattion product with order in orderdetail
        '''
        for store_id, list_product in data_product.items():
            try:
                store = Stores.objects.get(id=store_id)
                new_order = OrderInfomations(status_payment=status_payment, payment_method='paypal', status_order='waiting',
                                             money=money, store=store, customer=customer, order_code=uuid.uuid4(), payer_id=payer_id, transaction_id=transaction_id)
                new_order.save()

                for item in list_product:
                    product = Products.objects.get(id=item['product_id'])
                    order_detail = OrderDetails(
                        product=product, orderInfomation=new_order, quanlity=item['quanlity'])
                    order_detail.save()

            except Products.DoesNotExist, e:
                return Response({"code": 400, "message": "Products not found.", "fields": ""}, status=400)
            except Stores.DoesNotExist, e:
                return Response({"code": 400, "message": "Store not found.", "fields": ""}, status=400)

            shipSerializer.save(order=new_order.id)
            return Response({'message': _('success')})

    except Exception, e:
        print 'Error payment ', e
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)



@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def list_order(request):
    try:
        customer = request.user.cus_user_rel
        orders = OrderInfomations.objects.filter( customer= customer )
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    except Exception, e:
        print 'Error payment ', e
        error = {"code": 500, "message": "%s" % e, "fields": ""}
        return Response(error, status=500)


