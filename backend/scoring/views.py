from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from leagues.models import Matchup, Week, League, Team
from rosters.models import RosterSpot
from .serializers import MatchupSerializer
from django.db.models import Q 




import logging
logger = logging.getLogger(__name__)

class CurrentMatchupView(APIView):
    def get(self, request, league_id, team_id, week_id):
        logger.info("Fetching week...")
        week = self.get_week(week_id) 

        logger.info("Fetching league...")
        league = self.get_league(league_id) 

        logger.info("Fetching team...")
        team = self.get_team(team_id)  

        logger.info("Querying matchup for league %s, week %s, team %s", league, week, team)
        matchup = self.get_matchup(league, week, team)

        if not matchup:
            logger.info("No matchup found")
            return Response({'error': 'Matchup not found'}, status=status.HTTP_404_NOT_FOUND)

        logger.info("Serializing matchup...")
        return self.serialize_matchup(matchup)

    def get_league(self, league_id):
        """ Retrieve the league object or return 404 if not found. """
        return get_object_or_404(League, id=league_id)

    def get_week(self, week_id):
        """ Retrieve the week object or return 404 if not found. """
        return get_object_or_404(Week, id=week_id)

    def get_team(self, team_id):
        """ Retrieve the team object or return 404 if not found. """
        return get_object_or_404(Team, id=team_id)

    def get_matchup(self, league, week, team):
        """ Retrieve the first matching matchup or None if not found. """
        return Matchup.objects.filter(
            Q(league=league, week=week, home_team=team) | Q(league=league, week=week, away_team=team)
        ).select_related('home_team').first()

    def serialize_matchup(self, matchup):
        """ Serialize the matchup and return the response. """
        serializer = MatchupSerializer(matchup)
        serialized_data = serializer.data
        logger.info("Serialized data: %s", serialized_data)
        return Response(serialized_data)
    
