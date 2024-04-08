# urls.py
from django.urls import path
from .views import TeamRosterAPIView, TeamScheduleAPIView

urlpatterns = [
    path('leagues/<int:league_id>/teams/<int:team_id>/roster/', TeamRosterAPIView.as_view(), name='team-roster'),
    path('leagues/<int:league_id>/teams/<int:team_id>/schedule/', TeamScheduleAPIView.as_view(), name='team-schedule'), 
         
]
