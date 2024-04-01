from rest_framework import serializers
from .models import League
from django.http import JsonResponse 

class LeagueSerializer(serializers.ModelSerializer):

    class Meta:
        model = League
        fields = ['id', 'name', 'commissioner', 'owners_count', 'member','is_public', 'league_password', 'description', 'created_at', 'updated_at']
        extra_kwargs = {'league_password': {'write_only': True, 'required': False},
                        'commissioner': {'read_only': True},
                        }   

    def validate(self, attrs):
        is_public = attrs.get('is_public', True)
        league_password = attrs.get('league_password')
        
        if not is_public and not league_password:
            raise serializers.ValidationError({"league_password": "This field is required for private leagues."})
        return attrs
    

    def create(self, validated_data):
        # Pop 'league_password' from validated_data since it's handled separately
        league_password = validated_data.pop('league_password', None)
        
        # Create the league instance including the 'commissioner' directly
        league = League.objects.create(**validated_data)
        
        # If the league is not public and a password has been provided, set it
        if not validated_data.get('is_public', True) and league_password:
            league.set_password(league_password)
            league.save()  # Remember to save the league after setting the password
        
        return league


    # def create(self, validated_data):
    #     user = self.context['request'].user
    #     validated_data['commissioner'] = user
    #     league = League.objects.create(**validated_data)

        
    #     if not validated_data.get('is_public', True):
    #         league.set_password(validated_data.get('league_password', ''))
    #         league.member.add(user)

    #     is_public = validated_data.pop('is_public', True)
    #     league_password = validated_data.pop('league_password', None)
        
    #     league = League(**validated_data, is_public=is_public)
    #     if not is_public and league_password:
    #         league.set_password(league_password)
    #     # league.commissioner = self.context['request'].user
    #     league.save()
    #     league.member.add(self.context['request'].user)
        
    #     return league


 
