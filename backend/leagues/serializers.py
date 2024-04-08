from rest_framework import serializers
from .models import League, Team, Matchup   
from django.http import JsonResponse
from django.db import transaction
from itertools import combinations
from django.contrib.auth.hashers import check_password
import logging
import random
from rosters.models import Position, RosterSpot, TeamPlayer

logger = logging.getLogger(__name__)    

class LeagueSerializer(serializers.ModelSerializer):

    class Meta:
        model = League
        fields = ['id', 'name', 'commissioner', 'owners_count', 'member','is_public', 'league_password', 'description', 'created_at', 'updated_at']
        extra_kwargs = {'league_password': {'write_only': True, 'required': False},
                        'commissioner': {'read_only': True},
                        } 

    @staticmethod
    def initialize_roster(team):
        # Example roster structure based on your description
        ROSTER_STRUCTURE = {
            'QB': 1, 'RB': 1, 'WR': 2, 'X': 1, 'TE': 1, 'T': 2, 'G': 2, 'C': 1,
            'DT': 2, 'EDGE': 2, 'LB': 3, 'CB': 2, 'S': 2,
            'K': 1, 'P': 1, 'KR': 1, 'PR': 1, #'BENCH': 20,
        }
        TOTAL_SPOTS = 53
        # Create roster spots for each required position
        with transaction.atomic():
        # Create roster spots for each required position
            for position_code, count in ROSTER_STRUCTURE.items():
                position, created = Position.objects.get_or_create(name=position_code)
                for _ in range(count):
                    RosterSpot.objects.create(team=team, position=position, status='Active')

            # Calculate remaining spots for bench
            bench_spots = TOTAL_SPOTS - sum(ROSTER_STRUCTURE.values())

            # Initialize bench spots without specifying a position
            for _ in range(bench_spots):
                RosterSpot.objects.create(team=team, position=None, status='Bench')

        logger.info(f"Roster initialized for team: {team.name}") 
    
    
    @staticmethod
    def create_schedule(league):
        print("schedule for league:", league.name)
        teams = list(league.teams.all())
        print(f"{len(teams)} teams in league {league.name}")
        
        weeks = 15 
        matchups_per_week = len(teams) // 2

        with transaction.atomic():
            try:
                for week in range(1, weeks + 1):
                    random.shuffle(teams) 
                    for i in range(matchups_per_week):
                        home_team = teams[i * 2] 
                        away_team = teams[i * 2 + 1] ##if i * 2 + 1 < len(teams) else None --- not sure if needed 
                        if away_team:
                            #print(f"Week {week}: {home_team.name} vs {away_team.name}")  --Console log
                            Matchup.objects.create(
                                week=week,
                                league=league,
                                home_team=home_team,
                                away_team=away_team
                            )   
            except Exception as e:
                logger.error(f"Error creating schedule: {e}")    

    def validate(self, attrs):
        is_public = attrs.get('is_public', True)
        league_password = attrs.get('league_password')
        
        if not is_public and not league_password:
            raise serializers.ValidationError({"league_password": "This field is required for private leagues."})
        return attrs
    

    def create(self, validated_data):
    # Pop 'league_password' from validated_data since it's handled separately
        league_password = validated_data.pop('league_password', None)
        owners_count = validated_data.get('owners_count')
        request = self.context.get('request')

        # Create the league instance including the 'commissioner' directly
        league = League.objects.create(**validated_data)
        
        # If the league is not public and a password has been provided, set it
        if not validated_data.get('is_public', True) and league_password:
            league.set_password(league_password)
            league.save()   # Remember to save the league after setting the password

        # Create teams for the league
        with transaction.atomic():
        # Create the commissioner's team and initialize its roster immediately
            commissioner_team = Team.objects.create(
                name=f"Team {request.user.username}",  # Assuming this is the naming convention for the commissioner's team
                league=league,
                owner=request.user  # Assigning the commissioner as the owner
            )
            # Initialize roster for the commissioner's team
            self.initialize_roster(commissioner_team)


            # Team.objects.create(
            #     name= f'Team {request.user.username}',
            #     league=league,
            #     owner=league.commissioner
            # )

            for i in range(2, owners_count + 1):
                team = Team.objects.create(
                    name=f'Team {i}',
                    league=league
                )
                # print(f'Created team {i} for league {league.id}')  
                self.initialize_roster(team)
        
        self.create_schedule(league)
        return league
    



class JoinLeagueSerializer(serializers.Serializer):
        password = serializers.CharField(required=False )  
        # league_id = serializers.IntegerField()

        def validate(self, data):
            logger.info(data)
            league_id = self.context['view'].kwargs['pk']
            try:
                league = League.objects.get(id=league_id)
            except League.DoesNotExist:
                logger.error('League does not exist')
                raise serializers.ValidationError('League does not exist')

            if not league.is_public and 'password' not in data:
                logger.error('Password is required to join this league')
                raise serializers.ValidationError('Password is required to join this league')

            if not league.is_public and not check_password(data['password'], league.league_password):
                logger.error('Incorrect password')
                raise serializers.ValidationError('Incorrect password')

            return data
        
        def create(self, validated_data):
            logger.info('Creating team with validated data: %s', validated_data)
            league_id = self.context['view'].kwargs['pk']
            league = League.objects.get(id=league_id)
            user = self.context['request'].user
            team = Team.objects.filter(league=league, owner=None).first()

            if team is None:
                raise serializers.ValidationError('No available teams in this league')

            # Assign the user to the team
            team.owner = user
            team.name = f'Team {user.username}'
            team.save()

            LeagueSerializer.create_schedule(league)

            return team



class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name']  # Adjust based on the fields you want to include

class MatchupSerializer(serializers.ModelSerializer):
    # Use TeamSerializer for detailed team info (optional)
    home_team = TeamSerializer(read_only=True)
    away_team = TeamSerializer(read_only=True)
    
    # Correcting field types for scores
    home_score = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    away_score = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)

    class Meta:
        model = Matchup
        fields = ['week', 'home_team', 'away_team', 'home_score', 'away_score']
