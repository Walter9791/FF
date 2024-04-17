from rest_framework.response import Response
from rest_framework.views import APIView
from .models import RosterSpot, Team, Player
from .serializers import RosterSpotSerializer, MyScheduleSerializer, FreeAgentSerializer
from leagues.models import Matchup, League
from django.db.models import Q
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


class TeamRosterAPIView(APIView):
    def get(self, request, league_id, team_id):
        team_id = team_id
        roster_spots = RosterSpot.objects.filter(team__league__id=league_id, team__id=team_id)
        serializer = RosterSpotSerializer(roster_spots, many=True)
        return Response(serializer.data)


class TeamScheduleAPIView(APIView):
    def get(self, request, league_id, team_id):
        team_id = team_id
        team_schedule = Matchup.objects.filter(Q(home_team__league__id=league_id, home_team__id=team_id) | Q(away_team__league__id=league_id, away_team__id=team_id))
        serializer = MyScheduleSerializer(team_schedule, many=True) 
        return Response(serializer.data)
    

class RosterEntryUpdateAPIView(APIView):
        def post(self, request, league_id, team_id):
            logger.debug("Request reached RosterEntryUpdateAPIView")
            logger.debug(f"Request data received: {request.data}")
            updated_roster = request.data.get('updatedRoster', [])
            
            try:
                team = Team.objects.get(id=team_id, league_id=league_id)
                logger.debug(f"Team found: {team}")
            except Team.DoesNotExist:
                logger.error(f"Team with ID {team_id} and league ID {league_id} not found.")
                return Response({'message': 'No such team found in the specified league'}, status=status.HTTP_404_NOT_FOUND)

            not_found_entries = []
            for entry in updated_roster:
                entry_id = entry.get('id')
                entry_status = entry.get('status')
                entry_week_id = entry.get('week') 

                try:
                    logger.debug(f"Looking for RosterSpot id={entry_id} with team={team} and week_id={entry_week_id}")
                    roster_entry = RosterSpot.objects.get(id=entry_id, team=team, week_id=entry_week_id)
                    roster_entry.status = entry_status
                    roster_entry.save()
                    logger.debug(f"Roster entry updated: {roster_entry}")
                except RosterSpot.DoesNotExist:
                    not_found_entries.append(entry_id)
                    logger.error(f"Roster spot not found: {entry}")

            if not not_found_entries:
                logger.debug("All roster entries updated successfully")
                return Response({'message': 'Roster updated successfully'}, status=status.HTTP_200_OK)
            else:
                logger.error(f"Some roster entries were not found: {not_found_entries}")
                return Response({'message': 'Some entries were not found', 'ids': not_found_entries}, status=status.HTTP_404_NOT_FOUND)

class FreeAgentsAPIView(APIView):
    def get(self, request, league_id):
        try:
            league = League.objects.get(id=league_id)
            free_agents = Player.objects.exclude(
                roster_spots__team__league=league
            ).distinct()
            serializer = FreeAgentSerializer(free_agents, many=True)
            return Response(serializer.data)
        except League.DoesNotExist:
            return Response({'error': 'League not found'}, status=status.HTTP_404_NOT_FOUND)