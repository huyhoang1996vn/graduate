from rest_framework import serializers
from models import *

class UserBaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserBases
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
	
    class Meta:
        model = Categories
        fields = '__all__'



class StoreSerializer(serializers.ModelSerializer):
	
    class Meta:
        model = Stores
        fields = '__all__'

class PictureSerializer(serializers.ModelSerializer):
	
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

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        userBases = UserBases.objects.create(**user_data)
        customers = Customers.objects.create(user = userBases, **validated_data)
        return customers






