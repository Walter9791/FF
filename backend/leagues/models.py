from django.db import models
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password


class League(models.Model):
    name = models.CharField(max_length=100)
    owners_count= models.IntegerField()
    description = models.TextField(blank = True, null = True)
    commissioner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='league_commissioner', on_delete=models.CASCADE)
    member = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='league_member')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=True)  # New field to indicate if the league is public
    league_password = models.CharField(max_length=128, blank=True, null=True)  # New field for storing league password
    

    def __str__(self):
        return self.name
    
    def set_password(self, raw_password):
        self.league_password = make_password(raw_password)
        self.save()

    def check_password(self, raw_password):
        return check_password(raw_password, self.league_password)
    
    
# class JoinRequest(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     league = models.ForeignKey('League', on_delete=models.CASCADE)
#     message = models.TextField(blank=True)
#     status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')])
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Join Request from {self.user.username} for {self.league.name}"
    
