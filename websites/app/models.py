# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, Permission, PermissionsMixin, PermissionManager
from django.utils.translation import ugettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.base_user import BaseUserManager
from django.utils.encoding import python_2_unicode_compatible

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


@python_2_unicode_compatible
class GroupUsers(models.Model):
    CUSTOMER = 'customer'
    STORE = 'store'
    OWNER = 'owner'

    group_type = (
        (CUSTOMER, 'customer'),
        (STORE, 'store'),
        (OWNER, 'owner'),
    )
    name = models.CharField(_('name'), choices=group_type,
                            default="customer_group", max_length=250, unique=True)

    class Meta:
        verbose_name = _('GroupUser')
        verbose_name_plural = _('GroupUser')

    def __str__(self):
        return "%s" % (self.name)


class UserBases(AbstractBaseUser, PermissionsMixin):
    groupUser = models.ForeignKey(
        'GroupUsers', on_delete=models.SET_NULL, null=True, blank=True)
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

    def __str__(self):
        return "%s" % (self.email)


@python_2_unicode_compatible
class GroupUserPermissions(models.Model):
    groupUser = models.ForeignKey(
        'GroupUsers', on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(_('name'), max_length=255)
    codename = models.CharField(_('codename'), max_length=100)

    class Meta:
        verbose_name = _('GroupUserPermission')
        verbose_name_plural = _('GroupUserPermission')

    def __str__(self):
        return "%s" % (self.name)


@python_2_unicode_compatible
class Owners(models.Model):
    user = models.OneToOneField(UserBases, on_delete=models.CASCADE)

    def __str__(self):
        return "%s" % (self.user)


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


@python_2_unicode_compatible
class Categories(DateTimeModel):
    name = models.CharField(_('name'), max_length=250, null=False, blank=False)
    detail = models.CharField(
        _('detail'), max_length=250, null=True, blank=True)
    is_active = models.BooleanField(_('active'), default=True)

    def __str__(self):
        return "%s" % (self.name)


@python_2_unicode_compatible
class Stores(DateTimeModel):
    owners = models.ForeignKey(Owners, null=True, blank=True)
    user = models.OneToOneField(UserBases, on_delete=models.CASCADE)
    name = models.CharField(_('name'), max_length=250, blank=False, null=False)
    phone = models.CharField(_('phone'), max_length=250, blank=False)
    image = models.ImageField(
        max_length=1000, null=True, blank=True, upload_to="image")
    is_active = models.BooleanField(_('active'), default=True)
    soft_delete = models.DateTimeField(
        _('soft delete'), editable=False, null=True, blank=True)
    address = models.CharField(_('address'), max_length=250, blank=True, null=True)
    location = models.CharField(_('location'), max_length=250, blank=True, null=True)

    def __str__(self):
        return "%s" % (self.name)


@python_2_unicode_compatible
class Pictures(DateTimeModel):
    image = models.ImageField(max_length=1000, null=True,
                              blank=True, upload_to="Picture")
    product = models.ForeignKey(
        'Products', related_name='picture', on_delete=models.CASCADE)

    def __str__(self):
        return "%s" % (self.product)


@python_2_unicode_compatible
class Products(DateTimeModel):
    category = models.ManyToManyField(Categories)
    stores = models.ForeignKey(Stores)
    supplier = models.ForeignKey(
        'Suppliers', on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(_('name'), max_length=250, blank=False, null=False)
    detail = models.TextField(_('detail'), blank=True)
    price = models.IntegerField(_('price'))
    tax = models.IntegerField(_('tax'), null=True, blank=True)
    hit_count = models.IntegerField(_('hit_count'), null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(_('active'), default=True)
    count_in_stock = models.IntegerField(_('count in stock'))

    def __str__(self):
        return "%s" % (self.name)


@python_2_unicode_compatible
class CartDetail(DateTimeModel):
    product = models.ForeignKey('Products', on_delete=models.CASCADE)
    cart = models.ForeignKey('Carts', on_delete=models.CASCADE)
    quantity = models.IntegerField(_('quantity'))

    def __str__(self):
        return "%s" % (self.product)


@python_2_unicode_compatible
class Carts(DateTimeModel):
    products = models.ManyToManyField(
        Products, through=CartDetail, related_name='cart_product_rel', blank=True)
    product_code = models.CharField(
        _("Product code"), max_length=255, null=True, blank=True)

    def __str__(self):
        return "%s" % (self.products)


@python_2_unicode_compatible
class Customers(models.Model):
    user = models.OneToOneField(
        UserBases, related_name="cus_user_rel", on_delete=models.CASCADE)
    cart = models.OneToOneField(
        Carts, related_name="cus_cart_rel", on_delete=models.CASCADE)

    # def __unicode__(self):
    #     return unicode(self.user)

    def __str__(self):
        return "%s" % (self.user)

    # add cart for customer
    def save(self, *args, **kwargs):
        if not hasattr(self, 'cart'):
            cart = Carts.objects.create(cus_cart_rel=(self))
            self.cart = cart
        super(Customers, self).save(*args, **kwargs)


@python_2_unicode_compatible
class OrderDetails(DateTimeModel):
    orderInfomation = models.ForeignKey(
        'OrderInfomations', on_delete=models.CASCADE)
    product = models.ForeignKey('Products', on_delete=models.PROTECT)
    quantity = models.IntegerField(_('quantity'))

    def __str__(self):
        return "%s" % (self.orderInfomation)
    
    def save(self, *args, **kwargs):
        if not self.pk:
            product = self.product
            product.count_in_stock -= self.quantity
            product.save()
        super(OrderDetails, self).save(*args, **kwargs) 


@python_2_unicode_compatible
class OrderInfomations(DateTimeModel):
    STATUS_ORDER = (
        ('canceled', 'Canceled'),
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('shipping', 'Shipping'),
        ('completed', 'Completed')
    )

    STATUS_PAYMENT = (
        ('payment_error', 'Payment Error'),
        ('pending', 'Pending'),
        ('completed', 'Completed')
    )
    PAYMENT_METHOD = (
        ('ship_code', 'Ship code'),
        ('paypal', 'Paypal')
    )
    customer = models.ForeignKey(
        'Customers', on_delete=models.SET_NULL, null=True, blank=True)
    store = models.ForeignKey('Stores', on_delete=models.CASCADE)
    products = models.ManyToManyField(
        Products, through=OrderDetails, related_name='order_product_rel')
    order_code = models.CharField(_('order_code'), max_length=250, blank=True)
    money = models.IntegerField(_('money'), null=True, blank=True)
    status_payment = models.CharField(
        _('status_payment'), max_length=250, choices=STATUS_PAYMENT, default="pending")
    payment_method = models.CharField(
        _('payment_method'), max_length=250, choices=PAYMENT_METHOD, default="ship_code")
    status_order = models.CharField(
        max_length=255, choices=STATUS_ORDER, default="pending")
    transaction_id = models.CharField(
        _('transaction_id'), max_length=250, null=True, blank=True)
    payer_id = models.CharField(
        _('payer_id'), max_length=250, null=True, blank=True)

    def __str__(self):
        return "%s" % (self.id)

    @property
    def detail_order(instance):
        # Get price from TimePackagePrice
        products = instance.products.all()
        return OrderDetails.objects.filter(product__in=products, orderInfomation=instance)\
            .values('product_id', 'quantity', 'product__name')

@python_2_unicode_compatible
class Feedbacks(DateTimeModel):
    STAR_FEEDBACK = (
        (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)
    )
    customer = models.ForeignKey('Customers', on_delete=models.CASCADE)
    store = models.ForeignKey('Stores', on_delete=models.CASCADE)
    product = models.ForeignKey('Products', on_delete=models.CASCADE)
    detail = models.CharField(max_length=255, null=True, blank=True)
    star = models.IntegerField(choices=STAR_FEEDBACK)

    def __str__(self):
        return "%s" % (self.customer)


@python_2_unicode_compatible
class Suppliers(DateTimeModel):
    name = models.CharField(_('name'), max_length=250, null=False, blank=False)
    phone = models.CharField(
        _('phone'), max_length=250, null=False, blank=False)
    address = models.CharField(
        _('address'), max_length=250, null=False, blank=False)
    is_active = models.BooleanField(_('active'), default=True)
    soft_delete = models.DateTimeField(
        _('soft delete'), editable=False, null=True, blank=True)

    def __str__(self):
        return "%s" % (self.name)


@python_2_unicode_compatible
class ShipInfomations(DateTimeModel):
    orderInfomation = models.OneToOneField(
        'OrderInfomations', on_delete=models.CASCADE)
    phone = models.CharField(_('phone'), max_length=250, blank=True)
    email = models.EmailField(_('email'), max_length=250, blank=True)
    address = models.CharField(_('address'), max_length=250, blank=False)
    first_name = models.CharField(_('first name'), max_length=250, blank=True)
    last_name = models.CharField(_('last name'), max_length=250, blank=True)

    def __str__(self):
        return "%s" % (self.email)
