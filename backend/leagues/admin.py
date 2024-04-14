from django.contrib import admin
from .models import League, Team, Matchup, NFLTeam, NFLGame
from .models import Week

admin.site.register(League)
admin.site.register(Team)
admin.site.register(Matchup)
admin.site.register(NFLTeam)
admin.site.register(NFLGame)

@admin.register(Week)
class WeekAdmin(admin.ModelAdmin):
    list_display = ('week_number', 'start_date', 'end_date', 'lock_time', 'is_active')
    list_filter = ('is_active',)
    ordering = ('week_number',)