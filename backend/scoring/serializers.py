from rest_framework import serializers
from leagues.models import Matchup, Team
from rosters.models import RosterSpot
from rosters.serializers import RosterSpotSerializer
from django.db.models import Q, Prefetch
from django.db import models  
from rest_framework.views import APIView
from rest_framework.response import Response


class TeamDetailSerializer(serializers.ModelSerializer):
    active_roster_spots = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'active_roster_spots']

    def get_active_roster_spots(self, obj):
        active_spots = RosterSpot.objects.filter(team=obj, status='Active')
        return RosterSpotSerializer(active_spots, many=True).data
    

class MatchupSerializer(serializers.ModelSerializer):
    home_team = TeamDetailSerializer()
    away_team = TeamDetailSerializer()

    class Meta:
        model = Matchup
        fields = ['week', 'home_team', 'away_team', 'home_score', 'away_score']    


