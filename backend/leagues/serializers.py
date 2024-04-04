from rest_framework import serializers
from .models import League, Team, Matchup   
from django.http import JsonResponse
from django.db import transaction
from itertools import combinations
from django.contrib.auth.hashers import check_password
import logging
import random




logger = logging.getLogger(__name__)    

class LeagueSerializer(serializers.ModelSerializer):

    class Meta:
        model = League
        fields = ['id', 'name', 'commissioner', 'owners_count', 'member','is_public', 'league_password', 'description', 'created_at', 'updated_at']
        extra_kwargs = {'league_password': {'write_only': True, 'required': False},
                        'commissioner': {'read_only': True},
                        } 
        
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
                            print(f"Week {week}: {home_team.name} vs {away_team.name}") 
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
            Team.objects.create(
                name= f'Team {request.user.username}',
                league=league,
                owner=league.commissioner
            )

            for i in range(2, owners_count + 1):
                Team.objects.create(
                    name=f'Team {i}',
                    league=league
                )
                # print(f'Created team {i} for league {league.id}')  
            
           
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

 
