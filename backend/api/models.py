from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
# Create your models here.


class User(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255) 
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def profile (self):
        profile = Profile.objects.get(user=self)
        return self.profile

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    bio = models.TextField()
    avatar = models.ImageField(upload_to='avatars/', default='avatars/default.png')
    verified = models.BooleanField(default=False)
    pass

def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_profile, sender=User)

post_save.connect(save_profile, sender=User)