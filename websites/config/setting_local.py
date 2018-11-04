DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', 
        'NAME': 'school_sofware',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': 'localhost',   # Or an IP Address that your DB is hosted on
        'PORT': '3306',
    }
}

cancelUrl = "http://52.14.71.211/api/paypal/confirm"
returnUrl = "http://52.14.71.211/api/paypal/confirm"