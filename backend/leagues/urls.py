from django.urls import path
from .views import LeagueListCreate, LeagueDetail
from .views import send_join_request, approve_join_request, deny_join_request


urlpatterns = [
    path('leagues/', LeagueListCreate.as_view(), name='league-list-create'),
    path('leagues/<int:pk>/', LeagueDetail.as_view(), name='league-detail'),
    path('leagues/join/<int:pk>/', send_join_request , name='join-league'), 
    path('leagues/join-request/approve/<int:pk>/', approve_join_request, name='approve-join-request'),
    path('leagues/join-request/deny/<int:pk>/', deny_join_request, name='deny-join-request'),
]