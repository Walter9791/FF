from rest_framework.response import Response
from rest_framework.views import APIView
from .models import RosterSpot
from .serializers import RosterSpotSerializer, MyScheduleSerializer
from leagues.models import Matchup
from django.db.models import Q

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