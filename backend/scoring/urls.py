from django.urls import path
from .views import CurrentMatchupView

urlpatterns = [
    path('leagues/<int:league_id>/teams/<int:team_id>/currentmatchup/', CurrentMatchupView.as_view(), name='current_matchup'),
]
