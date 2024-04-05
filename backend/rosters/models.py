from django.db import models
from leagues.models import Team

class Position(models.Model):
    POSITION_CHOICES = [
        ('QB', 'Quarterback'),
        ('RB', 'Running Back'),
        ('WR', 'Wide Receiver'),
        ('TE', 'Tight End'),
        ('LT', 'Left Tackle'),
        ('LG', 'Left Guard'),
        ('C', 'Center'),
        ('RG', 'Right Guard'),
        ('RT', 'Right Tackle'),
        ('DT', 'Defensive Tackle'),
        ('EDGE', 'Edge'),
        ('LB', 'Line Backer'),
        ('CB', 'Corner Back'),
        ('S', 'Safety'),
        ('KR', 'Kick Returner'),
        ('PR', 'Punt Returner'),
        ('K', 'Kicker'),
        ('P', 'Punter'),
        ('BENCH', 'Bench'),
    ]
    name = models.CharField(max_length=5, choices=POSITION_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()

class Player(models.Model):
    name = models.CharField(max_length=100)
    position = models.ForeignKey(Position, on_delete=models.CASCADE)  # Could also be a ForeignKey to a Position model
    # team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='players')

    def __str__(self):
        return f"{self.name} ({self.position})"


class TeamPlayer(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    date_added = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('team', 'player')

class RosterSpot(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='roster_spots')
    player = models.OneToOneField(Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='roster_spot')
    position = models.ForeignKey(Position, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=[('Active', 'Active'), ('Bench', 'Bench')])

    class Meta:
        unique_together = ('team', 'position', 'player')

    def __str__(self):
        return f"{self.team.name} - {self.position.name} - {self.player.name if self.player else 'Vacant'}"

