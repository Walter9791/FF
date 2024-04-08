from rest_framework import serializers
from .models import RosterSpot, Player, Position
from leagues.models import Matchup

class RosterSpotSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True)
    position_name = serializers.CharField(source='position.name', read_only=True)
    # Assuming 'status' is a field on your RosterSpot model; adjust as necessary
    status = serializers.CharField()

    class Meta:
        model = RosterSpot
        fields = ['id', 'player_name', 'position_name', 'status']


class MyScheduleSerializer(serializers.ModelSerializer):
    home_team_name = serializers.CharField(source='home_team.name', read_only=True)
    away_team_name = serializers.CharField(source='away_team.name', read_only=True)
    week = serializers.IntegerField()

    class Meta:
        model = Matchup
        fields = ['id', 'week', 'home_team_name', 'away_team_name']