from rest_framework import serializers
from .models import League, JoinRequest

class LeagueSerializer(serializers.ModelSerializer):
    class Meta:
        model = League
        fields = ['id', 'name', 'owners_count', 'member', 'description', 'commissioner', 'created_at', 'updated_at']


class JoinRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinRequest
        fields = ['id', 'user', 'league', 'message', 'status', 'created_at']   
