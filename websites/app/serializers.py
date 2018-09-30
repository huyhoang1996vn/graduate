from rest_framework import serializers
from models import *

class UserBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBases
        fields = '__all__'