from django.db import models
from leagues.models import Matchup
from rosters.models import Player



class PlayerPerformance(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    week = models.ForeignKey(Matchup, on_delete=models.CASCADE)
    
    # Global stats
    touchdowns = models.IntegerField(default=0)
    fumble_lost = models.IntegerField(default=0)
    penalty = models.IntegerField(default=0)
    
    # QB specific
    pass_yards = models.IntegerField(default=0)
    interceptions = models.IntegerField(default=0)
    
    # WR, RB, TE shared stats
    yards = models.IntegerField(default=0) 
    receptions = models.IntegerField(default=0)
    drop = models.IntegerField(default=0)
    
    # OL specific
    sack_given = models.IntegerField(default=0)
    qb_hit = models.IntegerField(default=0)
    qb_hurry = models.IntegerField(default=0)
    
    # Defense specific
    tackle = models.IntegerField(default=0)
    tackle_assist = models.IntegerField(default=0)
    sack = models.IntegerField(default=0)
    batted_pass = models.IntegerField(default=0)
    forced_fumble = models.IntegerField(default=0)
    pass_breakup = models.IntegerField(default=0)
    missed_tackle = models.IntegerField(default=0)
    
    # Special Teams specific
    XP = models.IntegerField(default=0)
    XP_missed = models.IntegerField(default=0)
    FG = models.IntegerField(default=0)
    FG_missed = models.IntegerField(default=0)
    FG_40_49 = models.IntegerField(default=0)
    FG_50_59 = models.IntegerField(default=0)
    FG_60_plus = models.IntegerField(default=0)
    punt_inside20 = models.IntegerField(default=0)
    punt_ypa = models.IntegerField(default=0)  # Note: Consider how you'll handle yards per attempt as a stat
    punt_ypr = models.IntegerField(default=0)  # Note: As above, for return yards
    kick_return_yards = models.IntegerField(default=0)
    punt_return_yards = models.IntegerField(default=0)
    muffed = models.IntegerField(default=0)

    unique_together = [['player', 'week']]

    def __str__(self):
        return f"{self.player.name} - Matchup {self.matchup.id}"
    
