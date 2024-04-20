from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import LeagueSerializer, JoinLeagueSerializer, MatchupSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q , Count, F
from .models import League, Team, Matchup
import logging


logger = logging.getLogger(__name__)


class LeagueDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LeagueSerializer
    queryset = League.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serialized_data = serializer.data

        user_team = Team.objects.filter(league=instance, owner=request.user).first()
        team_id = user_team.id if user_team else None
        serialized_data['user_team_id'] = team_id
        logger.info('Sending the following league to the frontend: %s', serialized_data)
        return Response(serialized_data)


class LeagueListCreate(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LeagueSerializer

    def get_queryset(self):
        leagues_with_member_count = League.objects.annotate(current_member_count=Count('member'))
        leagues = leagues_with_member_count.exclude(Q(member=self.request.user) | Q(commissioner=self.request.user)| Q(current_member_count__gte=F('owners_count')))
        return leagues
    
    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        try: 
            league = serializer.save(commissioner=self.request.user)
            logger.info(f'League created: {league}')
        except Exception as e:
            logger.error(f"League creation errors: {e}")
            return Response({'error': 'League creation failed'}, status=400)



class JoinLeagueView(generics.CreateAPIView):
    serializer_class = JoinLeagueSerializer

    def create(self, request, *args, **kwargs):
        logger.info('Received request to join league')
        logger.info('Request data: %s', request.data)

        response = super().create(request, *args, **kwargs)

        # Get the league that the user joined
        league_id = kwargs.get('pk')  # Replace 'pk' with the correct parameter name if it's different
        league = League.objects.get(id=league_id)

        # Add the user to the league's members
        league.member.add(request.user)
        league.save()

        return response

    # def create(self, request, *args, **kwargs):
    #     logger.info('Received request to join league')
    #     logger.info('Request data: %s', request.data)
    #     return super().create(request, *args, **kwargs)



class LeagueScheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, league_id):
        matchups = Matchup.objects.filter(league_id=league_id)
        serializer = MatchupSerializer(matchups, many=True)
        logger.info('Sending the following matchups to the frontend: %s', serializer.data)
        return Response(serializer.data)



@api_view(['GET'])
def get_joined_leagues(request):
    # Fetch leagues where the user is a member or the commissioner
    leagues = League.objects.filter(Q(member=request.user) | Q(commissioner=request.user))
    serializer = LeagueSerializer(leagues, many=True)
    logger.info('Sending the following leagues to the frontend: %s', serializer.data)
    return Response(serializer.data)






