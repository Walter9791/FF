from django.urls import path
from .views import LeagueListCreate, LeagueDetail
from .views import join_league, get_joined_leagues



urlpatterns = [
    path('leagues/', LeagueListCreate.as_view(), name='league-list-create'),
    path('leagues/myleagues/', get_joined_leagues, name='my-leagues'),
    path('leagues/<int:pk>/', LeagueDetail.as_view(), name='league-detail'),
    path('leagues/join/<int:pk>/', join_league , name='join-league'),
]