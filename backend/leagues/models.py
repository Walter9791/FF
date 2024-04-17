from django.db import models
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password

############################# League Model ###############################################

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
    
    


############################# Team Model ###############################################


class Team(models.Model):
    name = models.CharField(max_length=100, unique=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='teams')
    league = models.ForeignKey('League', on_delete=models.CASCADE, related_name='teams')

    def __str__(self):
        return self.name


    ############################# Weeks Model ###############################################
class Week(models.Model):
    week_number = models.IntegerField(help_text="Week number in the season")
    start_date = models.DateField(help_text="Start date of the fantasy week", null=True, blank=True)
    end_date = models.DateField(help_text="End date of the fantasy week", null=True, blank=True)
    lock_time = models.DateTimeField(help_text="Deadline after which no roster changes can be made", null=True, blank=True)
    is_active = models.BooleanField(default=False, help_text="Whether this week is currently active")

    def __str__(self):
        return f"Week {self.week_number}: {self.start_date} to {self.end_date}"

    class Meta:
        ordering = ['week_number']
        verbose_name_plural = "Weeks"


class NFLTeam(models.Model):
    name = models.CharField(max_length=100, unique=True) 
    abbreviation = models.CharField(max_length=3, unique=True)  

    def __str__(self):
        return self.name
    

class NFLGame(models.Model):
    week = models.ForeignKey(Week, on_delete=models.CASCADE, related_name='games')
    home_team = models.ForeignKey(NFLTeam, on_delete=models.CASCADE, related_name='home_games')
    away_team = models.ForeignKey(NFLTeam, on_delete=models.CASCADE, related_name='away_games')
    game_date = models.CharField(max_length=50, null=True, blank=True)
    game_time = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return f"{self.away_team} at {self.home_team} on {self.game_date} at {self.game_time}"
    


class Matchup(models.Model):
    week = models.ForeignKey(Week, on_delete=models.CASCADE, related_name='matchups')
    league = models.ForeignKey('League', on_delete=models.CASCADE, related_name='matchups')
    home_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='home_matchups', null=True, blank=True)
    away_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='away_matchups', null=True, blank=True)
    home_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    away_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    date = models.DateField(null=True, blank=True)

    def calculate_team_score(self, team):
        # Calculate the total score for a team by summing active players' scores
        return team.roster_spots.filter(week=self.week, status='Active').aggregate(
            total_score=models.Sum('score')
        )['total_score'] or 0

    def update_scores(self):
        # Update scores for both teams
        self.home_score = self.calculate_team_score(self.home_team)
        self.away_score = self.calculate_team_score(self.away_team)
        self.save()


    def __str__(self):
        home = self.home_team.name if self.home_team else "TBD"
        away = self.away_team.name if self.away_team else "TBD"
        return f"Week {self.week.week_number}: {home} vs. {away}"