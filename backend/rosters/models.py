from django.db import models
from leagues.models import Team, League, Week

class Position(models.Model):
    POSITION_CHOICES = [
        ('QB', 'Quarterback'),
        ('RB', 'Running Back'),
        ('WR', 'Wide Receiver'),
        ('TE', 'Tight End'),
        ('T', 'Tackle'),
        ('G', 'Guard'),
        ('C', 'Center'),
        ('DT', 'Defensive Tackle'),
        ('DE', 'Defensive End'),
        ('LB', 'Linebacker'),
        ('CB', 'Cornerback'),
        ('S', 'Safety'),
        ('K', 'Kicker'),
        ('P', 'Punter'),
    ]
    name = models.CharField(max_length=5, choices=POSITION_CHOICES, unique=True)
    is_skill_position = models.BooleanField(default=False, null=True) #will need to set in CSV file for each player
    is_punt_returner = models.BooleanField(default=False, null=True)
    is_kick_returner = models.BooleanField(default=False, null=True)
    offensive = models.BooleanField(default=False, null=True)
    defensive = models.BooleanField(default=False, null=True)  
    special_teams = models.BooleanField(default=False, null=True)

    def __str__(self):
        return self.get_name_display()

class Player(models.Model):
    name = models.CharField(max_length=100)
    jersey_number = models.IntegerField(null=True, blank=True)
    position = models.ForeignKey(Position, on_delete=models.CASCADE)  # Could also be a ForeignKey to a Position model
    height = models.CharField(max_length=10) 
    weight = models.IntegerField()  
    experience= models.IntegerField(null=True, blank=True)  # Nullable if not applicable
    college = models.CharField(max_length=100, null=True, blank=True)  # Nullable if not applicable
    nfl_team = models.CharField(max_length=100, null=True, blank=True)  

    def __str__(self):
        return f"{self.name} ({self.position})"


class RosterSpot(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='roster_spots')
    player = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='roster_spots')
    position = models.ForeignKey(Position, on_delete=models.CASCADE, null=True, blank=True)
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Bench', 'Bench'),
        ('Injured', 'Injured')
    ]
    status = models.CharField(max_length=50, choices=[('Active', 'Active'), ('Bench', 'Bench')])
    week = models.ForeignKey(Week, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        unique_together = ('team', 'player', 'week')

    def __str__(self):
        return f"{self.team.name} - {self.position.name if self.position else 'No Position'} - {self.player.name if self.player else 'Vacant'} ({self.status}) - Week {self.week.week_number}"


