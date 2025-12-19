from django.db import models

# Create your models here.

class Todo(models.Model):
    task = models.CharField(max_length=100,blank=True)
    description = models.TextField(blank=True)
    completed = models.BooleanField(blank=True,default=False)
    created = models.DateField(auto_now_add=True)
    updated = models.DateField(auto_now=True)
    
    def __str__(self):
        return f"Task: {self.task}"