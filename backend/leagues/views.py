from django.shortcuts import render
from rest_framework import generics
from .serializers import LeagueSerializer, JoinLeagueSerializer 
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q , Count, F
from .models import League, Team
import logging


logger = logging.getLogger(__name__)


class LeagueDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = LeagueSerializer
    queryset = League.objects.all()


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
            
            # Create shell teams here if you haven't done so in the serializer

            # # Assign the first team to the commissioner
            # first_team = Team.objects.filter(league=league, owner=None).first()
            # if first_team:
            #     first_team.owner = self.request.user
            #     first_team.name = f'Team {self.request.user.username}'
            #     first_team.save()
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



@api_view(['GET'])
def get_joined_leagues(request):
    # Fetch leagues where the user is a member or the commissioner
    leagues = League.objects.filter(Q(member=request.user) | Q(commissioner=request.user))
    serializer = LeagueSerializer(leagues, many=True)
    # logger.info('Sending the following leagues to the frontend: %s', serializer.data)
    return Response(serializer.data)



