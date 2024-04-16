from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from leagues.models import Matchup, Team, League
from rosters.models import RosterSpot
from .serializers import MatchupSerializer, TeamDetailSerializer
from django.db import models
from django.db.models import Prefetch, Q


class CurrentMatchupView(APIView):
    def get(self, request, league_id, team_id, week_number):
        active_spots_prefetch_home = Prefetch(
            'home_team__rosterspots',
            queryset=RosterSpot.objects.filter(status='Active'),
            to_attr='active_roster_spots'
        )
        active_spots_prefetch_away = Prefetch(
            'away_team__rosterspots',
            queryset=RosterSpot.objects.filter(status='Active'),
            to_attr='active_roster_spots'
        )
        matchup = Matchup.objects.filter(
            league_id=league_id, 
            week__week_number=week_number
        ).filter(
            models.Q(home_team_id=team_id) | models.Q(away_team_id=team_id)
        ).prefetch_related(
            active_spots_prefetch_home, 
            active_spots_prefetch_away
        ).first()

        if not matchup:
            return Response({'error': 'Matchup not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MatchupSerializer(matchup)
        return Response(serializer.data)