from django.contrib import auth
from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter
urlpatterns = [
    # path('track/streak/', update_streak, name='update_streak'),
    path('track',track_list, name='track_list'),  # List and create tasks
    path('track/<int:pk>', track_detail, name="track_detail"),  # Retrieve, update, delete task
]

router = DefaultRouter()
router.register('register', RegisterViewset, basename='register')
#router.register('login', LoginViewset, basename='login')
#router.register('users', UserViewset, basename='users')
urlpatterns = router.urls
