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
    picture = PictureSerializer(many = True)

    class Meta:
        model = Products
        fields = '__all__'


