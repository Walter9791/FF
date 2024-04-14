from rest_framework.response import Response
from rest_framework.views import APIView
from .models import RosterSpot, RosterEntry, Team
from .serializers import RosterSpotSerializer, MyScheduleSerializer
from leagues.models import Matchup
from django.db.models import Q
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status

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
        updated_roster = request.data.get('updatedRoster', [])

        # Get the team to ensure it belongs to the right league
        try:
            team = Team.objects.get(id=team_id, league_id=league_id)
        except Team.DoesNotExist:
            return Response({'message': 'No such team found in the specified league'}, status=status.HTTP_404_NOT_FOUND)

        updates_successful = True
        for entry in updated_roster:
            try:
                # Ensure that the roster entry belongs to the correct team and by extension, league
                roster_entry = RosterEntry.objects.get(id=entry['id'], team=team)
                roster_entry.status = entry['status']
                roster_entry.save()
            except RosterEntry.DoesNotExist:
                updates_successful = False

        if updates_successful:
            return Response({'message': 'Roster updated successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Some entries were not found'}, status=status.HTTP_404_NOT_FOUND)




# @api_view(['POST'])
# def RosterEntryAPIView(request, league_id, team_id):
#     updated_roster = request.data.get('updatedRoster', [])

#     updates_successful = True
#     for entry in updated_roster:
#         try:
#             roster_entry = RosterEntry.objects.get(id=entry['id'], team_id=team_id, league_id=league_id)
#             roster_entry.status = entry['status']
#             roster_entry.save()
#         except RosterEntry.DoesNotExist:
#             updates_successful = False
#             # Optionally, add logging here to debug or track these errors

#     if updates_successful:
#         return JsonResponse({'message': 'Roster updated successfully'}, status=200)
#     else:
#         return JsonResponse({'message': 'Some entries were not found'}, status=400)


