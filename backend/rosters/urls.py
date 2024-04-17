# urls.py
from django.urls import path
from .views import TeamRosterAPIView, TeamScheduleAPIView, RosterEntryUpdateAPIView, FreeAgentsAPIView

urlpatterns = [
    path('leagues/<int:league_id>/teams/<int:team_id>/roster/', TeamRosterAPIView.as_view(), name='team-roster'),
    path('leagues/<int:league_id>/teams/<int:team_id>/schedule/', TeamScheduleAPIView.as_view(), name='team-schedule'),
    path('leagues/<int:league_id>/teams/<int:team_id>/roster/change/', RosterEntryUpdateAPIView.as_view(), name='roster-entry'),
    path('leagues/<int:league_id>/freeagents/', FreeAgentsAPIView.as_view(), name='free-agents'),
]
