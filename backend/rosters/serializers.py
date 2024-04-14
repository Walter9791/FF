from rest_framework import serializers
from .models import RosterSpot, RosterEntry, Position, Player
from leagues.models import Matchup, Week, NFLGame, NFLTeam
from django.db.models import Q

class RosterSpotSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True)
    position_name = serializers.CharField(source='position.name', read_only=True)
    offensive = serializers.BooleanField(source='position.offensive', read_only=True)
    status = serializers.CharField()
    week = serializers.SerializerMethodField()
    opponent = serializers.SerializerMethodField()
    opponent_game_date = serializers.SerializerMethodField()
    opponent_game_time = serializers.SerializerMethodField()  

    class Meta:
        model = RosterSpot
        fields = ['id', 'player_name', 'position_name', 'offensive','status', 'week', 'opponent', 'opponent_game_date', 'opponent_game_time']

    def get_week(self, obj):
        current_week = Week.objects.filter(is_active=True).first()
        return current_week.week_number if current_week else None

    def get_opponent(self, obj):
        game = self.get_game(obj)
        if game:
            return game.away_team.name if game.home_team == obj.player.nfl_team else game.home_team.name
        return None

    def get_opponent_game_date(self, obj):
        game = self.get_game(obj)
        return game.game_date if game else None

    def get_opponent_game_time(self, obj):
        game = self.get_game(obj)
        return game.game_time if game else None
    
    def get_game(self, obj):
        current_week = Week.objects.filter(is_active=True).first()
        if current_week and obj.player.nfl_team:
            return NFLGame.objects.filter(
                (Q(home_team=obj.player.nfl_team) | Q(away_team=obj.player.nfl_team)),
                week=current_week
            ).first()
        return None

class MyScheduleSerializer(serializers.ModelSerializer):
    home_team_name = serializers.CharField(source='home_team.name', read_only=True)
    away_team_name = serializers.CharField(source='away_team.name', read_only=True)
    week = serializers.IntegerField()

    class Meta:
        model = Matchup
        fields = ['id', 'week', 'home_team_name', 'away_team_name']


class RosterEntrySerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True)
    position_name = serializers.CharField(source='player.position.name', read_only=True)
    status = serializers.CharField()    

    class Meta:
        model = RosterEntry
        fields = ['id', 'player_name', 'position_name', 'week', 'status']