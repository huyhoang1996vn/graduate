from rest_framework import serializers
from models import *
from django.conf import settings
from django.utils.translation import ugettext_lazy as _


class UserBaseSerializer(serializers.ModelSerializer):
    roll = serializers.CharField( required = True, write_only = True)

    class Meta:
        model = UserBases
        fields = '__all__'

    # create userbase with customer or store or owner
    def create(self, validated_data):
        roll = validated_data.get('roll', None)
        if roll:
            del validated_data['roll']
            
        userBase = UserBases(**validated_data)
        userBase.set_password(validated_data['password'])
        userBase.save()
        
        if roll == 'customer':
            customers = Customers.objects.create(user = userBase)
        elif roll == 'store':
            store = Stores.objects.create(user = userBase)
        elif roll == 'owner':
            owner = Owners.objects.create(user = userBase)

        return userBase


class CategorySerializer(serializers.ModelSerializer):
	
    class Meta:
        model = Categories
        fields = '__all__'



class StoreSerializer(serializers.ModelSerializer):
	
    class Meta:
        model = Stores
        fields = '__all__'

class PictureSerializer(serializers.ModelSerializer):
    # image = serializers.SerializerMethodField()

    # def get_image(self, obj):
    #     return '%s%s' % (settings.MEDIA_URL, obj.image)

    class Meta:
        model = Pictures
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    picture = PictureSerializer(many = True, required = False)

    class Meta:
        model = Products
        fields = '__all__'


class OwnerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Owners
        fields = '__all__'

class StoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Stores
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Carts
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    user = UserBaseSerializer()
    # cart = serializers.PrimaryKeyRelatedField()

    class Meta:
        model = Customers
        fields = '__all__'

    # def create(self, validated_data):
    #     user_data = validated_data.pop('user')
    #     userBases = UserBases.objects.create(**user_data)
    #     customers = Customers.objects.create(user = userBases, **validated_data)
    #     return customers

# only chang name, avatar in profile
class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.CharField( read_only = True)

    class Meta:
        model = UserBases
        fields = ('first_name', 'last_name', 'avatar', 'email')


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


class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderInfomations
        fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):
    customer = serializers.CharField( required = False)

    class Meta:
        model = Feedbacks
        fields = '__all__'


