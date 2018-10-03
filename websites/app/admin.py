# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from models import *
from django import forms
from django.contrib.admin.widgets import AdminDateWidget


class PictureInline(admin.TabularInline):
    model = Pictures
    extra = 3

class ProductForm(forms.ModelForm):
    expire_date = forms.DateField(widget=AdminDateWidget())

    class Meta:
    	model = Products
    	fields = "__all__"

class CategoryAdmin(admin.ModelAdmin):
    pass
admin.site.register(Categories, CategoryAdmin)

class StoreAdmin(admin.ModelAdmin):
    pass
admin.site.register(Stores, StoreAdmin)

class ProductAdmin(admin.ModelAdmin):
    form = ProductForm
    inlines = [ PictureInline, ]
admin.site.register(Products, ProductAdmin)

class OwnerAdmin(admin.ModelAdmin):
    pass
admin.site.register(Owners, OwnerAdmin)

class UserBaseAdmin(admin.ModelAdmin):
    pass
admin.site.register(UserBases, UserBaseAdmin)

class CustomerAdmin(admin.ModelAdmin):
    pass
admin.site.register(Customers, CustomerAdmin)



# class AuthorAdmin(admin.ModelAdmin):
#     pass
# admin.site.register(Categories, AuthorAdmin)



# class AuthorAdmin(admin.ModelAdmin):
#     pass
# admin.site.register(Categories, AuthorAdmin)