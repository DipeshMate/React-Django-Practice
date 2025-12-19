from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import CustomUser

# this forms.py is to adding and delete fields as this are in model in admin Page.

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ["email","first_name","last_name","phone_number"]
        error_class = "error"

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = CustomUser
        fields = ["email","first_name","last_name","phone_number"]
        error_class = "error"