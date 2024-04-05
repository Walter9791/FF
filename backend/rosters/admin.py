from django.contrib import admin
from .models import Position, Player, RosterSpot, TeamPlayer  # Import your models

admin.site.register(Position)
admin.site.register(Player)
admin.site.register(RosterSpot)
admin.site.register(TeamPlayer)

