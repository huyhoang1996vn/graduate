# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, Permission, PermissionsMixin, PermissionManager
from django.utils.translation import ugettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.base_user import BaseUserManager
# Create your models here.

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class GroupUsers(models.Model):
    name = models.CharField(_('name'), max_length=250, blank=True)

    class Meta:
        verbose_name = _('GroupUser')
        verbose_name_plural = _('GroupUser')

class UserBases(AbstractBaseUser, PermissionsMixin):
    groupUser = models.ForeignKey('GroupUsers', on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=250, blank=True)
    last_name = models.CharField(_('last name'), max_length=250, blank=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    is_active = models.BooleanField(_('active'), default=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_staff = models.BooleanField(_('staff status'), default=False)
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('UserBases')
        verbose_name_plural = _('UserBases')

    def get_full_name(self):
        '''
        Returns the first_name plus the last_name, with a space in between.
        '''
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        '''
        Returns the short name for the user.
        '''
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        '''
        Sends an email to this User.
        '''
        send_mail(subject, message, from_email, [self.email], **kwargs)

class GroupUserPermissions(models.Model):
    groupUser = models.ForeignKey('GroupUsers', on_delete=models.CASCADE)
    name = models.CharField(_('name'), max_length=255)
    content_type = models.ForeignKey(
        ContentType,
        models.CASCADE,
        verbose_name=_('content type'),
    )
    codename = models.CharField(_('codename'), max_length=100)
    objects = PermissionManager()

    class Meta:
        verbose_name = _('GroupUserPermission')
        verbose_name_plural = _('GroupUserPermission')
        unique_together = (('content_type', 'codename'),)
        ordering = ('content_type__app_label', 'content_type__model',
                    'codename')

    def __str__(self):
        return "%s | %s | %s" % (
            self.content_type.app_label,
            self.content_type,
            self.name,
        )

    def natural_key(self):
        return (self.codename,) + self.content_type.natural_key()
    natural_key.dependencies = ['contenttypes.contenttype']


class Owners(models.Model):
    user = models.OneToOneField(UserBases, on_delete=models.CASCADE)


class DateTimeModel(models.Model):
    """
    Abstract model that is used for the model using created and modified fields
    """
    created = models.DateTimeField(_('Created Date'), auto_now_add=True,
                                   editable=False)
    modified = models.DateTimeField(
        _('Modified Date'), auto_now=True, editable=False)

    def __init__(self, *args, **kwargs):
        super(DateTimeModel, self).__init__(*args, **kwargs)

    class Meta:
        abstract = True

class Categories(DateTimeModel):
	name = models.CharField(_('name'), max_length=250, blank=True)
	detail = models.CharField(_('detail'), max_length=250, null=True, blank=True)
	is_active = models.BooleanField(_('active'), default=True)


class Stores(DateTimeModel):
    owners = models.ManyToManyField(Owners)
    user = models.OneToOneField(UserBases, on_delete=models.CASCADE)
    name = models.CharField(_('name'), max_length=250, blank=True)
    phone = models.CharField(_('phone'), max_length=250, blank=True)
    image = models.ImageField(max_length=1000, null=True, blank=True, upload_to="image")
    is_active = models.BooleanField(_('active'), default=True)
    soft_delete = models.DateTimeField(_('soft delete'), editable=False)

class Pictures(DateTimeModel):
	image = models.ImageField(max_length=1000, null=True, blank=True, upload_to="Picture")
	product = models.ForeignKey('Products', on_delete=models.CASCADE)


class Products(DateTimeModel):
	product_status  = (
		('coming_soon', 'coming soon'),
		('still', 'still'),
		('oversell', 'oversell'),
	)
	products = models.ManyToManyField(Categories)
	stores = models.ManyToManyField(Stores)
	supplier = models.ForeignKey('Suppliers')
	name = models.CharField(_('name'), max_length=250, blank=True)
	detail = models.CharField(_('detail'), max_length=250, blank=True)
	price = models.IntegerField(_('price'))
	tax = models.IntegerField(_('tax'))
	hit_count = models.IntegerField(_('hit_count'))
	expire_date = models.DateTimeField()
	is_active = models.BooleanField(_('active'), default=True)
	status = models.CharField(max_length=255, choices=product_status, default="still")

class Carts(DateTimeModel):
	products = models.ManyToManyField(Products)
	product_code = models.CharField(_("Product code"),max_length=255,null=True, blank=True)


class Customers(models.Model):
    user = models.OneToOneField(UserBases, on_delete=models.CASCADE)
    cart = models.OneToOneField(Carts, on_delete=models.CASCADE)


class OrderInfomations(DateTimeModel):
	order_type = (
		('cancel', 'Cancel'),
		('payment_error', 'Payment Error'),
		('create', 'Create'),
		('shipping', 'Shipping'),
		('done', 'Done')
	)

	payment_type = (
		('payment_error', 'Payment Error'),
		('pendding', 'Pendding'),
		('done', 'Done')
	)
	customer = models.ForeignKey('Customers', on_delete=models.CASCADE)
	store = models.ForeignKey('Stores', on_delete=models.CASCADE)
	order_code = models.CharField(_('order_code'), max_length=250, blank=True)
	money = models.CharField(_('money'), max_length=250, null=True, blank=True)
	status_payment = models.CharField(_('status_payment'), max_length=250, choices=payment_type, default="Pendding")
	payment_method = models.CharField(_('payment_method'), max_length=250, null=True, blank=True)
	status_order = models.CharField(max_length=255, choices=order_type, default="Create")

class Feedbacks(DateTimeModel):
	customer = models.ForeignKey('Customers', on_delete=models.CASCADE)
	store = models.ForeignKey('Stores', on_delete=models.CASCADE)
	product = models.ForeignKey('Products', on_delete=models.CASCADE)
	detail =  models.CharField(max_length=255, null=True, blank=True)


class Suppliers(DateTimeModel):
	name = models.CharField(_('name'), max_length=250, blank=True)
	phone = models.CharField(_('phone'), max_length=250, blank=True)
	is_active = models.BooleanField(_('active'), default=True)
	soft_delete = models.DateTimeField(_('soft delete'), editable=False)

class ShipInfomations(DateTimeModel):
    orderInfomation = models.OneToOneField('OrderInfomations', on_delete=models.CASCADE)
    phone = models.CharField(_('phone'), max_length=250, blank=True)
    email = models.EmailField(_('email'), max_length=250, blank=True)
    address = models.EmailField(_('address'), max_length=250, blank=False)
    first_name = models.CharField(_('first name'), max_length=250, blank=True)
    last_name = models.CharField(_('last name'), max_length=250, blank=True)

class OrderDetails(DateTimeModel):
    orderInfomation = models.ForeignKey('OrderInfomations', on_delete=models.CASCADE)
    product = models.ForeignKey('Products', on_delete=models.CASCADE)
    price = models.CharField(_('price'), max_length=250, null=True, blank=True)
    tax = models.IntegerField(_('tax'))
    quanlity = models.IntegerField(_('quanlity'))



