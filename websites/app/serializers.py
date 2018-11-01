from rest_framework import serializers
from models import *
from django.conf import settings
from django.utils.translation import ugettext_lazy as _


class UserBaseSerializer(serializers.ModelSerializer):
    roll = serializers.CharField( required = True, write_only = True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserBases
        fields = ('last_name', 'first_name', 'email', 'password', 'roll', 'avatar')

    '''
        Create userbase with customer or store or owner
        Update is update Userbase
    '''
    def create(self, validated_data):
        # validated_data = OrderedDict((k, v) for k, v in validated_data.items()  if v not in [None, [], '', {}])
        
        roll = validated_data.get('roll', None)
        if roll:
            del validated_data['roll']
        
        # Create userBase
        userBase = UserBases(**validated_data)
        userBase.set_password(validated_data['password'])
        userBase.save()
        # Create customer
        if roll == 'customer':
            customers = Customers.objects.create(user = userBase)

        # Create store by owner
        # elif roll == 'store':
        #     store = Stores.objects.create(user = userBase)
        #     user = self.context['request'].user
        #     if hasattr(user, 'owners'):
        #         store.owners.add(user.owners)

        # Doing create owner
        elif roll == 'owner':
            owner = Owners.objects.create(user = userBase)

        return userBase


class CategorySerializer(serializers.ModelSerializer):
	
    class Meta:
        model = Categories
        fields = '__all__'



class PictureSerializer(serializers.ModelSerializer):
    # image = serializers.SerializerMethodField()

    # def get_image(self, obj):
    #     return '%s%s' % (settings.MEDIA_URL, obj.image)

    class Meta:
        model = Pictures
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    picture = PictureSerializer(many = True, read_only=True)
    expire_date = serializers.DateField(format= "%d/%m/%Y", input_formats = ["%d/%m/%Y"])
    stores = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Products
        fields = '__all__'

    # nested field picture
    def create(self, validated_data):
        picture_list = self.context['request'].data.getlist('image', None)
        category = validated_data.pop('category', None)
        product = Products.objects.create(**validated_data)
        product.category.add(*category)
        if picture_list:
            for item in picture_list:
                Pictures.objects.create( product = product, image = item)
        return product

class OwnerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Owners
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Carts
        fields = '__all__'

# only chang name, avatar in profile
class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.CharField( read_only = True)
    role = serializers.SerializerMethodField()

    class Meta:
        model = UserBases
        fields = ('first_name', 'last_name', 'avatar', 'email', 'role')

    def get_role(self, obj):
        data = obj.groupUser.name.replace('_group','')
        return data

class AddCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(required = True, min_value =0)
    quantity = serializers.IntegerField(required = True, min_value =0)

    def validate_product_id(self, value):
        product = Products.objects.filter( id = value)
        if not product:
            raise serializers.ValidationError("Product not found.")
        return value


class CartDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = CartDetail
        fields = ('product', 'quantity')


# fields = ProductSerializer.Meta.fields + 'quantity'

class PasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField( required=True )
    new_password = serializers.CharField( required=True )
    new_password2 = serializers.CharField( required=True )

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError(_("The two password fields did not match."))
        return data



class ShipSerializer(serializers.Serializer):

    phone = serializers.CharField( required=True )
    email = serializers.CharField( required=False )
    address = serializers.CharField( required=True )
    first_name = serializers.CharField( required=True )
    last_name = serializers.CharField( required=True )
    orderInfomation = serializers.CharField( required=False )

    def save(self , *args, **kwargs):
        order = OrderInfomations.objects.get(id = kwargs['order'])
        ship = ShipInfomations(orderInfomation = order, **self.validated_data)
        ship.save()
        return ship

# Auto save store in order
class OrderOfStoreSerializer(serializers.ModelSerializer):
    store = serializers.CharField( required = False)
    
    class Meta:
        model = OrderInfomations
        fields = '__all__'

    def save(self):
        order = super(OrderOfStoreSerializer, self).save()
        order.store = self.context['request'].user.stores
        order.save()
        return order

class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderInfomations
        fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):
    customer = serializers.CharField( required = False)

    class Meta:
        model = Feedbacks
        fields = '__all__'


'''
No revenlant with Store, only with product
'''
class SupplierSerializer(serializers.ModelSerializer):

    class Meta:
        model = Suppliers
        fields = '__all__'


class StoreSerializer(serializers.ModelSerializer):
    
    '''
    args is instance update
    kwargs is data sent
    '''
    def __init__(self, *args, **kwargs):
        super(StoreSerializer, self).__init__(*args, **kwargs) 
        if args:
            if self.fields.get('email',None): del self.fields['email']
            if self.fields.get('password',None): del self.fields['password']
            
    email = serializers.CharField(write_only=True, required = True)
    password = serializers.CharField(write_only=True, required = True)
    user = serializers.CharField(required=False)

    class Meta:
        model = Stores
        fields = '__all__'

    def validate_email(self, value):
        email_exist = UserBases.objects.filter(email = value)
        if email_exist:
            raise serializers.ValidationError("Email is exist.")
        return value

    def create(self, validated_data):
        # Create userBase
        userBase = UserBases(email = validated_data.pop('email'))
        userBase.set_password(validated_data.pop('password'))
        userBase.save()
        # Create store
        store = Stores(user = userBase, **validated_data)
        store.save()
        # Create store by owner
        user = self.context['request'].user
        if hasattr(user, 'owners'):
            store.owners = user.owners
            store.save()
        return store





