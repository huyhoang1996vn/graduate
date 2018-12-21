# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from models import *
from django import forms
from django.contrib.admin.widgets import AdminDateWidget
from django.forms import ModelForm, PasswordInput
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, ReadOnlyPasswordHashField
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _


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
    filter_horizontal = ('category',)
    form = ProductForm
    inlines = [ PictureInline, ]
    list_display = ['id', 'name', 'count_in_stock', 'stores', 'price']
admin.site.register(Products, ProductAdmin)

class OwnerAdmin(admin.ModelAdmin):
    pass
admin.site.register(Owners, OwnerAdmin)


class UserBaseForm(UserChangeForm):
    password = ReadOnlyPasswordHashField(label= ("Password"),
        help_text= ("Change password using <a href=\"../password/\">this form</a>."))
    class Meta(UserChangeForm.Meta):
        pass

class CustomUserAdmin(UserAdmin):
    add_form = UserCreationForm
    form = UserBaseForm
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'avatar')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groupUser',)}),
        # (_('Important dates'), {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'is_active', 'groupUser', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

admin.site.register(UserBases, CustomUserAdmin)


class CustomerForm(forms.ModelForm):
    # cart = forms.forms.ModelChoiceField(queryset=Carts.objects.all(), required)

    class Meta:
        model = Customers
        fields = ("user", )

class CustomerAdmin(admin.ModelAdmin):
    form = CustomerForm
admin.site.register(Customers, CustomerAdmin)


class SupplierAdmin(admin.ModelAdmin):
    pass
admin.site.register(Suppliers, SupplierAdmin)

class ProductInline(admin.TabularInline):

    model = OrderInfomations.products.through
    verbose_name = u"products"
    verbose_name_plural = u"products"

class OrderAdmin(admin.ModelAdmin):
    exclude = ("products", )
    inlines = (
       ProductInline,
    )
    # filter_horizontal = ('products',)
admin.site.register(OrderInfomations, OrderAdmin)

class OrderDetailsAdmin(admin.ModelAdmin):
    pass
admin.site.register(OrderDetails, OrderDetailsAdmin)

class GroupUserPermissionAdmin(admin.ModelAdmin):
    pass
admin.site.register(GroupUserPermissions, GroupUserPermissionAdmin)

class GroupUserAdmin(admin.ModelAdmin):
    pass
admin.site.register(GroupUsers, GroupUserAdmin)


class FeedbacksAdmin(admin.ModelAdmin):
    pass
admin.site.register(Feedbacks, FeedbacksAdmin)
