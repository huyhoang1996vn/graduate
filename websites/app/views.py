# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from models import *
from rest_framework import viewsets
from serializers import *
# from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from django.utils.translation import ugettext_lazy as _
from rest_framework.permissions import IsAuthenticated, AllowAny
import uuid
import requests
import urlparse
from main import settings
from rest_framework.parsers import MultiPartParser,JSONParser
from custom_permission import *
from decorators import check_user_permission
import traceback
from django.views.decorators.csrf import csrf_exempt

# Create your views here.


def home(request):
    print "***START Power Card Introduction PAGE***"
    # try:
    return render(request, 'websites/home.html')
    # except Exception, e:
    #     print "Error: ", e
    #     raise Exception( "ERROR : Internal Server Error .Please contact administrator.")

# For getister
class RegiserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = UserBases.objects.all().order_by('-date_joined')
    serializer_class = RegiserSerializer
    parser_classes = (MultiPartParser, JSONParser)


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    parser_classes = (MultiPartParser, JSONParser)
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    # filter_backends = (SearchFilter, OrderingFilter)
    filter_fields = ('category', 'stores')
    search_fields = ('name', )
    ordering_fields = '__all__'
    # permission_classes = (AllowAny, )
    # authentication_classes = ()

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    # Create store by request.user
    def perform_create(self, serializer):
        serializer.save( stores = self.request.user.stores )

    # Create store by request.user
    def perform_update(self, serializer):
        serializer.save( stores = self.request.user.stores )

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
    # permission_classes = (CustomCheckPermission, )
    
    # def get_permissions(self):
    #     """
    #     Instantiates and returns the list of permissions that this view requires.
    #     """
    #     if self.action == 'list' or self.action == 'retrieve':
    #         permission_classes = [AllowAny]
    #     else:
    #         permission_classes = [IsAuthenticated]
    #     return [permission() for permission in permission_classes]

class SupplierViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Suppliers.objects.all()
    serializer_class = SupplierSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class OrderViewSet(viewsets.ModelViewSet):
    """
    Get, Delete order of store
    Update status order of store
    """
    queryset = OrderInfomations.objects.none()
    serializer_class = OrderOfStoreSerializer
    permission_classes = (IsAuthenticated, )
    filter_fields = ('status_order',)
    
    def get_queryset(self):
        store = self.request.user.stores
        return OrderInfomations.objects.filter( store = store)

    def list(self, request):
        stores = request.user.stores
        orders = OrderInfomations.objects.filter( store= stores )
        serializer = OrderOfStoreSerializer(orders, many=True)
        return Response(serializer.data)


@api_view(['GET', 'PUT'])
@permission_classes((IsAuthenticated, ))
@parser_classes((MultiPartParser, JSONParser))
def profile_user(request):
    try:
        if request.method == 'GET':
            user = request.user
            userSerializer = ProfileSerializer(user)
            return Response(userSerializer.data)
        else:
            user = request.user
            profileSerializer = ProfileSerializer(
                instance=user, data=request.data)
            if profileSerializer.is_valid():
                profileSerializer.save()
                return Response(profileSerializer.data)
            return Response(profileSerializer.errors, status=400)
    except Exception, e:
        print 'profile_user ', e
        error = {"code": 500, "message": "%s" %traceback.format_exc(), "fields": ""}
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
        return Response(serializer.data)
    except Exception, e:
        print 'profile_user ', e
        error = {"code": 500, "message": "%s" %traceback.format_exc(), "fields": ""}
        return Response(error, status=500)


@api_view(['POST', ])
@permission_classes((IsAuthenticated, ))
# @check_user_permission(['add_carts', 'change_carts'])
def modify_cart(request):
    try:
        addCartSerializer = AddCartSerializer(data=request.data)
        if addCartSerializer.is_valid():
            product_id = addCartSerializer.data['product_id']
            quantity = addCartSerializer.data['quantity']

            customer = request.user.cus_user_rel
            cart_detail = CartDetail.objects.filter(
                cart=customer.cart, product=product_id)
            '''
                if cart detail exist then update or delete
                if not cart detail and quantity > 0 then create 
            '''
            if cart_detail:
                if quantity == 0:
                    cart_detail.delete()
                else:
                    cart_detail = cart_detail.get()
                    cart_detail.quantity = quantity
                    cart_detail.save()
            elif quantity > 0:
                product = Products.objects.get(id=product_id)
                new_prodduct = CartDetail(
                    cart=customer.cart, product=product, quantity=quantity)
                new_prodduct.save()
            return Response({'message': 'success'})
        return Response(addCartSerializer.errors, status=400)

    except Products.DoesNotExist:
        error = {"code": 400, "message": _(
            "Not found customer."), "fields": ""}
        return Response(error, status=400)
    except Exception, e:
        print 'modify_cart ', e
        error = {"code": 500, "message": "%s" %traceback.format_exc(), "fields": ""}
        return Response(error, status=500)


@api_view(['PUT'])
@permission_classes((IsAuthenticated, ))
# @csrf_exempt
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
        error = {"code": 500, "message": "%s" %traceback.format_exc(), "fields": ""}
        return Response(error, status=500)


'''
Create order for ship code, Money will set in server
'''


@api_view(['POST'])
def create_order(request):
    try:
        data_product = request.data.pop('product', None)
        customer = request.user.cus_user_rel if request.user.is_authenticated() else None

        if not data_product:
            return Response({'message': _('List product is required.')}, status=400)

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
            except Stores.DoesNotExist, e:
                return Response({"code": 400, "message": "Store not found.", "fields": ""}, status=400)

            new_order = OrderInfomations(status_payment='pending', payment_method='ship_code', status_order='pending',
                                         money=0, store=store, customer=customer, order_code=uuid.uuid4())
            amount = 0
            for item in list_product:
                try:
                    product = Products.objects.get(id=item['product_id'])
                except Products.DoesNotExist, e:
                    return Response({"code": 400, "message": "Products not found.", "fields": ""}, status=400)
                
                amount += product.price * item['quantity']

                if not new_order.pk:
                    new_order.save()
                order_detail = OrderDetails(
                    product=product, orderInfomation=new_order, quantity=item['quantity']).save()
                # remove cart when order
                if request.user.is_authenticated():
                    CartDetail.objects.filter(product=product, cart=customer.cart ).delete()
            
            new_order.money = amount
            new_order.save()
        
            # Associate shipinfo with order
            shipSerializer.save(order=new_order.id)
        return Response({'message': _('success')})

    except Exception, e:
        print 'Error change_passqord ', e
        error = {"code": 500, "message": "%s" %traceback.format_exc(), "fields": ""}
        return Response(error, status=500)



'''
    Make request paypal to get token
'''

@api_view(['GET'])
# @check_user_permission(['add_orderinfomations', 'change_orderinfomations','delete_orderinfomations'])
def redirect_paypal(request):
    try:
        money = request.query_params.get('money', None)
        if not money:
            return Response({'message': _('Money is required.')}, status=400)

        data = {
            'USER': settings.credentials['USER'],
            'PWD': settings.credentials['PWD'],
            'SIGNATURE': settings.credentials['SIGNATURE'],
            'METHOD': 'SetExpressCheckout',
            'VERSION': 86,
            'PAYMENTREQUEST_0_PAYMENTACTION': 'SALE',
            'PAYMENTREQUEST_0_AMT': money,           
            'PAYMENTREQUEST_0_CURRENCYCODE': 'USD',
            'cancelUrl': settings.cancelUrl,
            'returnUrl': settings.returnUrl
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
        error = {"code": 500, "message": "%s" %traceback.format_exc(), "fields": ""}
        return Response(error, status=500)


'''
    Get detail transaction payment
'''

@api_view(['GET'])
# @check_user_permission(['add_orderinfomations', 'change_orderinfomations','delete_orderinfomations'])
def payment_confirm(request):
    try:
        token = request.query_params.get('token', None)
        payerID = request.query_params.get('PayerID', None)
        if not token or not payerID:
            return Response({'message': _('List token and payerID is required.')}, status=400)

        data = {
            'USER': settings.credentials['USER'],
            'PWD': settings.credentials['PWD'],
            'SIGNATURE': settings.credentials['SIGNATURE'],
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
        error = {"code": 500, "message": "%s" %traceback.format_exc(), "fields": ""}
        return Response(error, status=500)

'''
    Make request to facilitator get amout from buyer
'''

def handle_payment(token, payerID, money):
    response_data = {}
    response_data['status'] = False
    try:

        data = {
            'USER': settings.credentials['USER'],
            'PWD': settings.credentials['PWD'],
            'SIGNATURE': settings.credentials['SIGNATURE'],
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
# @check_user_permission(['add_orderinfomations', 'change_orderinfomations','delete_orderinfomations'])
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
            status_payment = 'completed'
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
                new_order = OrderInfomations(status_payment=status_payment, payment_method='paypal', status_order='pending',
                                             money=money, store=store, customer=customer, order_code=uuid.uuid4(), payer_id=payer_id, transaction_id=transaction_id)
                new_order.save()

                for item in list_product:
                    product = Products.objects.get(id=item['product_id'])
                    order_detail = OrderDetails(
                        product=product, orderInfomation=new_order, quantity=item['quantity'])
                    order_detail.save()
                    # remove cart when order
                    if request.user.is_authenticated() and response['status'] == True:
                        CartDetail.objects.filter(product=product, cart=customer.cart ).delete()

            except Products.DoesNotExist, e:
                return Response({"code": 400, "message": "Products not found.", "fields": ""}, status=400)
            except Stores.DoesNotExist, e:
                return Response({"code": 400, "message": "Store not found.", "fields": ""}, status=400)

            shipSerializer.save(order=new_order.id)
            return Response({'message': _('success')})

    except Exception, e:
        print 'Error payment ', e
        error = {"code": 500, "message": "%s" %traceback.format_exc(), "fields": ""}
        return Response(error, status=500)



@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def list_order(request):
    try:
        customer = request.user.cus_user_rel
        orders = OrderInfomations.objects.filter( customer= customer )
        serializer = OrderCustomerSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)

    except Exception, e:
        print 'Error payment ', e
        error = {"code": 500, "message": "%s" %traceback.format_exc(), "fields": ""}
        return Response(error, status=500)



class FeedbackViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Feedbacks.objects.all()
    serializer_class = FeedbackSerializer
    filter_fields = ('product', 'store')

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save( customer = self.request.user.cus_user_rel )

    def perform_update(self, serializer):
        serializer.save( customer = self.request.user.cus_user_rel )

'''
Show information for STORE, not User
'''
class StoreViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    # Fix CustomCheckPermission dont hace attr queryset from doc.
    queryset = Stores.objects.none()
    serializer_class = StoreSerializer
    parser_classes = (MultiPartParser, JSONParser)

    def get_queryset(self):
        owner = self.request.user.owners
        return Stores.objects.filter( owners = owner)

# Only get order by admin
class OrderAdminViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = OrderInfomations.objects.all()
    serializer_class = OrderSerializer
    filter_fields = ('status_order', 'store')
    search_fields = ('order_code', 'status_order', 'store')
    ordering_fields = '__all__'




class UserByAdminViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = UserBases.objects.all()
    serializer_class = UserByAdminSerializer
    parser_classes = (MultiPartParser, JSONParser)



@api_view(['GET',])
@permission_classes((IsAuthenticated, ))
def get_group_user(request):
    try:
        group = GroupUsers.objects.all()
        groupSerializer = GroupUserSerializer(group, many=True)
        return Response(groupSerializer.data)
    except Exception, e:
        print 'profile_user ', e
        error = {"code": 500, "message": "%s" %traceback.format_exc(), "fields": ""}
        return Response(error, status=500)




@api_view(['PUT',])
@permission_classes((IsAuthenticated, ))
def cancel_order(request):
    try:
        order_code = request.data.get('order_code', None)
        
        if not order_code:
            return Response({"message": 'Order code is required.'}, status = 400)

        try:
            order = OrderInfomations.objects.get( order_code = order_code, customer = request.user.cus_user_rel )
        except OrderInfomations.DoesNotExist, e:
            return Response({"message": 'Not found order.'}, status = 400)

        if order.status_order == 'pending':
            order.delete()
            return Response({'message': 'success'})
        return Response({'message': 'Only cancel pending order, status current is %s' %order.status_order}, status = 400)

    except Exception, e:
        print 'profile_user ', e
        error = {"code": 500, "message": "%s" %traceback.format_exc(), "fields": ""}
        return Response(error, status=500)


@api_view(['GET',])
@permission_classes((IsAuthenticated, ))
def report_admin(request):
    try:
        product = Products.objects.count()
        cus = Customers.objects.count()
        store = Stores.objects.count()
        owner = Owners.objects.count()
        order = OrderInfomations.objects.count()
        return Response({'product': product, 'customer': cus, 'store': store, 'owner': owner, 'order': order})
    except Exception, e:
        print 'profile_user ', e
        error = {"code": 500, "message": "%s" %traceback.format_exc(), "fields": ""}
        return Response(error, status=500)










