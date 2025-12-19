from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers  import CustomUserManager
# AbstractUser used to extend the current Django model. and 
# AbstractBaseUser used to create a completely new Model. '''
from django.utils.timezone import now
# from django_rest_passwordreset.signals import reset_password_token_created
# from django.dispatch import receiver 
# from django.urls import reverse 
# from django.template.loader import render_to_string
# from django.core.mail import EmailMultiAlternatives
# from django.utils.html import strip_tags

#from django.contrib.auth.models import User
# from django.contrib.auth import get_user_model

# User = get_user_model()  # Get the current user model

# Create your models here.
class Track(models.Model):
    task = models.CharField(max_length=100)
    streak = models.IntegerField(default=0)  # Tracks the current streak
    completed = models.BooleanField(default=False)
    last_completed_date = models.DateField(null=True, blank=True)  # Tracks the last completed date
    date = models.DateField(default=now, blank=True)  # Defaults to today's date
    tasktime = models.TimeField(default=now)  # Updates time whenever the object is saved
    created_date = models.DateTimeField(auto_now_add=True)  # Tracks the datetime when created
    updated_date = models.DateTimeField(auto_now=True)  # Tracks the last modification datetime

    def save(self, *args, **kwargs):
        # Automatically correct the date if invalid or not provided
        if not self.date or self.date > now().date():
            self.date = now().date()
            
         # Update streak logic only if completed
        if self.completed:
            today = now().date()
            if self.last_completed_date:
                delta = (today - self.last_completed_date).days
                if delta == 1:  # Increment streak for consecutive day
                    self.streak += 1
                elif delta > 1:  # Reset streak if not consecutive
                    self.streak = 1
            else:
                self.streak = 1  # Start streak if first-time completion

            self.last_completed_date = today  # Update last completed date

        
        # Update time only if the 'task' field is being changed
        if self.pk:  # Check if the instance already exists
            original_task = Track.objects.get(pk=self.pk).task
            if self.task != original_task:
                self.time = now().time()
                
        # # Update the tasktime field to the current time whenever the model is saved
        # self.tasktime = now().time()  
        super().save(*args, **kwargs)  # Call the parent class's save method
    

    def __str__(self):
        return f"Task: {self.task}, Streak: {self.streak}"




class CustomUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_('First name'), max_length=100)
    last_name = models.CharField(_('Last name'), max_length=100)
    phone_number = models.CharField(max_length=12, unique=True)
    email = models.EmailField(max_length=200, unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=now)

    
    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ["first_name","last_name","phone_number"]
    
    objects = CustomUserManager()
    
    class Meta:
        verbose_name = _('CustomUser')
        verbose_name_plural = ("CustomUsers")
        
        
    def __str__(self):
        return f"{self.email}"
    
    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

# @receiver(reset_password_token_created)
# def password_reset_token_created(reset_password_token, *args, **kwargs):
#     sitelink = "http://localhost:5173/"
#     token = "{}".format(reset_password_token.key)
#     full_link = str(sitelink)+str("password-reset/")+str(token)

#     print(token)
#     print(full_link)

#     context = {
#         'full_link': full_link,
#         'email_adress': reset_password_token.user.email
#     }

#     html_message = render_to_string("backend/email.html", context=context)
#     plain_message = strip_tags(html_message)

#     msg = EmailMultiAlternatives(
#         subject = "Request for resetting password for {title}".format(title=reset_password_token.user.email), 
#         body=plain_message,
#         from_email = "sender@example.com", 
#         to=[reset_password_token.user.email]
#     )

#     msg.attach_alternative(html_message, "text/html")
#     msg.send()