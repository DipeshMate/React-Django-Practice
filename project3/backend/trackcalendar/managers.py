from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):

    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError(_("You must provide a valid email"))
        
    def create_user(self, first_name, last_name, phone_number, email, password=None, **extra_fields):

        if not first_name:
            raise ValueError(_("Users must submit a first name"))
        
        if not last_name:
            raise ValueError(_("Users must submit a last name"))
        
        if not phone_number:
            raise ValueError(_("Users must submit a phone number"))
        

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Base User: and email address is required"))
        
        
        user = self.model(
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            email=email,
            **extra_fields
        )

        user.set_password(password)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        # extra_fields.setdefault("is_superuser", True)

        user.save()

        return user
    
    
    def create_superuser(self, first_name, last_name, phone_number, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        if extra_fields.get("is_active") is not True:
            raise ValueError("Superuser must have is_active=True.")
        
        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError("Admin User: and email Address is required")
        
        user = self.create_user(first_name, last_name, phone_number, email, password, **extra_fields)
        user.save()
        return user
        
# from django.contrib.auth.base_user import BaseUserManager


# class CustomUserManager(BaseUserManager): 
#     use_in_migrations = True
#     def create_user(self, phone_number, password=None, **extra_fields ): 
#         if not phone_number:
#             raise ValueError('phone number is a required field')
      
#         email = extra_fields.get('email')
#         if email:
#             extra_fields['email'] = self.normalize_email(email)   
              
#         user = self.model(
#             phone_number=phone_number, 
#             **extra_fields)
#         user.set_password(password)
#         user.is_staff = True
#         user.save(using =self.db)
#         return user

#     def create_superuser(self, phone_number, password=None, **extra_fields): 
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
#         extra_fields.setdefault('is_active', True)

#         if not extra_fields.get('is_staff'):
#            raise ValueError("Superuser must have is_staff=True.")
#         if not extra_fields.get('is_superuser'):
#            raise ValueError("Superuser must have is_superuser=True.")
#         if not extra_fields.get('is_active'):
#             raise ValueError("Superuser must have is_active=True.")

#         return self.create_user(phone_number, password, **extra_fields)