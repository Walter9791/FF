from rest_framework.response import Response
from rest_framework.views import APIView
from .models import RosterSpot, Team, Player
from .serializers import RosterSpotSerializer, MyScheduleSerializer, FreeAgentSerializer
from leagues.models import Matchup, League
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework import status
from django.db import transaction
from rest_framework import serializers

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
        
class FreeAgencyTransaction(APIView):
    def post(self, request, *args, **kwargs):
        drop_roster_spot_id = request.data.get('dropPlayerId')
        add_roster_spot_id = request.data.get('dropPlayerId')
        player_to_add_id = request.data.get('addPlayerId')
        logger.debug(f"Drop roster spot ID: {drop_roster_spot_id}")
        logger.debug(f"Add roster spot ID: {add_roster_spot_id}")
        logger.debug(f"Player to add ID: {player_to_add_id}")

        try:
            with transaction.atomic():
                
                if drop_roster_spot_id:
                    roster_spot_to_drop = RosterSpot.objects.get(id=drop_roster_spot_id)
                    roster_spot_to_drop.player = None
                    roster_spot_to_drop.save()
                    logger.debug(f"Player dropped from roster spot ID: {drop_roster_spot_id}")

            
                if add_roster_spot_id:
                    roster_spot_to_add = RosterSpot.objects.get(id=add_roster_spot_id)
                    roster_spot_to_add.player_id = player_to_add_id
                    roster_spot_to_add.position_id = Player.objects.get(id=player_to_add_id).position_id   
                    roster_spot_to_add.save()
                    logger.debug(f"Player with ID {player_to_add_id} added to roster spot ID: {add_roster_spot_id}")

                return Response({'message': 'Roster update successful'}, status=status.HTTP_200_OK)

        except RosterSpot.DoesNotExist:
            logger.error("Roster spot not found")
            return Response({'error': 'Roster spot not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error during roster update: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



# class FreeAgencyTransaction(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer_context = {
#             'request': request,
#         }
#         team = request.data.get('team')
#         add_player_id = request.data.get('addPlayerId')
#         drop_player_id = request.data.get('dropPlayerId')

#         logger.debug(f"Team ID: {team}")
#         logger.debug(f"Add player ID: {add_player_id}")
#         logger.debug(f"Drop player ID: {drop_player_id}")
#         logger.debug(f"Request data: {request.data}")

#         try:
#             with transaction.atomic():
#                 # Handle dropping the player
#                 # Ensure we are getting the correct player based on team_id and player_id
#                 dropped_player = get_object_or_404(Player, id=drop_player_id, team_id=team_id)
#                 logger.debug(f"Dropped player: {dropped_player}")
#                 drop_serializer = RosterSpotSerializer(dropped_player, data={'team': None}, context=serializer_context, partial=True)
#                 if drop_serializer.is_valid():
#                     drop_serializer.save()
#                     logger.debug(f"Player dropped: {dropped_player}")
#                 else:
#                     logger.error(f"Error dropping player: {drop_serializer.errors}")

#                 # Handle adding the new player to the team
#                 added_player = get_object_or_404(Player, id=add_player_id)
#                 logger.debug(f"Added player: {added_player}")
#                 add_serializer = RosterSpotSerializer(added_player, data={'team': team_id}, context=serializer_context, partial=True)
#                 if add_serializer.is_valid():
#                     add_serializer.save()
#                     logger.debug(f"Player added: {added_player}")
#                 else:
#                     logger.error(f"Error adding player: {add_serializer.errors}")
#                     raise serializers.ValidationError(add_serializer.errors)

#                 return Response({'message': 'Roster updated successfully'}, status=status.HTTP_200_OK)

#         except Player.DoesNotExist:
#             logger.error("Player not found")
#             return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)
#         except serializers.ValidationError as e:
#             logger.error(f"Validation error: {e}")
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             logger.error(f"Error: {e}")
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)