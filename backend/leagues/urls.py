from django.urls import path
from .views import LeagueListCreate, LeagueDetail
from .views import get_joined_leagues, JoinLeagueView, LeagueScheduleView



urlpatterns = [
    path('leagues/', LeagueListCreate.as_view(), name='league-list-create'),
    path('leagues/myleagues/', get_joined_leagues, name='my-leagues'),
    path('leagues/myleagues/<int:pk>/', LeagueDetail.as_view(), name='league-detail'),
    path('leagues/join/<int:pk>/', JoinLeagueView.as_view() , name='join-league'),
    path('leagues/<int:league_id>/schedule/', LeagueScheduleView.as_view(), name='league-schedule'),
]
