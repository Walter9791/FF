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

    def __str__(self):
        return self.name
    
    def send_join_request(self, user, message=''):
        # Check if the user has already sent a request
        existing_request = JoinRequest.objects.filter(user=user, league=self).first()
        if existing_request:
            return False, "You have already sent a join request for this league."

        # Create a new join request
        JoinRequest.objects.create(user=user, league=self, message=message, status='pending')
        return True, "Join request sent successfully."
    
    
class JoinRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    league = models.ForeignKey('League', on_delete=models.CASCADE)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Join Request from {self.user.username} for {self.league.name}"
    
