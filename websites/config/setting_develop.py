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
returnUrl = "http://52.14.71.211/checkout-confirm"

# Detail account in https://developer.paypal.com/developer/accounts/ and find API Credential in profile each account
credentials ={
    'USER' : 'huyhoang1996ha_api1.gmail.com', # Edit this to your API user name
    'PWD' : 'CURAGKL6V65X779C', # Edit this to your API password
    'SIGNATURE' : 'A6Se6BKM-0-Ibix7u0SeowrpNEY7A.1oJIvSsDWL9bWeQB6B1FNSyIwA', 
    # 'SUBJECT': credentials['FACILITATOR_EMAIL'],
}