from django.shortcuts import render
from rest_framework import generics
from .serializers import LeagueSerializer, JoinLeagueSerializer 
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import League
import logging


logger = logging.getLogger(__name__)


class LeagueDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = League.objects.all()
    serializer_class = LeagueSerializer


class LeagueListCreate(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = League.objects.all()
    serializer_class = LeagueSerializer

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        try: 
            serializer.save(commissioner=self.request.user)
        except Exception as e:
            logger.error(f"League creation errors: {e}")
            return Response({'error': 'League creation failed'}, status=400)
        

class JoinLeagueView(generics.CreateAPIView):
    serializer_class = JoinLeagueSerializer

    def create(self, request, *args, **kwargs):
        logger.info('Received request to join league')
        logger.info('Request data: %s', request.data)
        return super().create(request, *args, **kwargs)



@api_view(['GET'])
def get_joined_leagues(request):
    # Fetch leagues where the user is a member or the commissioner
    leagues = League.objects.filter(Q(member=request.user) | Q(commissioner=request.user))
    serializer = LeagueSerializer(leagues, many=True)
    return Response(serializer.data)






    # def get_queryset(self):
    #     user = self.request.user
    #     # Subquery to check for join requests by the user for each league
    #     join_requests = JoinRequest.objects.filter(
    #         league=OuterRef('pk'),
    #         user=user
    #     )
    #     queryset = League.objects.annotate(
    #         has_join_request=Exists(join_requests)
    #     ).filter(
    #         # Exclude leagues where the user is a member or the commissioner
    #         ~Q(member=user) & 
    #         ~Q(commissioner=user)
    #         # # Also exclude leagues where a join request by the user exists
    #         # ~Q(has_join_request=True)
    #     )
    #     return queryset
    




# @api_view(['POST'])
# def send_join_request(request, pk):
#     try:
#         league = League.objects.get(pk=pk)  # Corrected line
#     except League.DoesNotExist:
#         return Response({"error": "League does not exist."}, status=status.HTTP_404_NOT_FOUND)

#     # Create a join request
#     # Assuming 'message' can be included from the frontend, it should be handled here.
#     initial_data = {
#         'league': league.pk,
#         'user': request.user.pk,
#         'message': request.data.get('message', ''),  # Optional message
#         'status': 'pending'  # Set status to 'pending' explicitly
#     }

#     serializer = JoinRequestSerializer(data=initial_data, context={'request': request})
#     if serializer.is_valid(raise_exception=True):
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET'])
# def get_join_request_statuses(request):
#     join_requests = JoinRequest.objects.filter(user=request.user).select_related('league')
    
#     # Construct a list of dictionaries with detailed info for each join request
#     join_requests_detailed = [
#         {
#             'leagueId': jr.league.id,
#             'status': jr.status,
#             'name': jr.league.name,
#             'description': jr.league.description,
#             'commissioner': jr.league.commissioner.username,  # Assuming commissioner is a user model instance
#             'owners_count': jr.league.owners_count,
#             'currentOwners': jr.league.member.count(),  # Counting the many-to-many relationship instances
#         } for jr in join_requests
#     ]
    
#     return Response(join_requests_detailed)



# @api_view(['POST'])
# def approve_join_request(request, join_request_id):
#     try:
#         join_request = JoinRequest.objects.get(pk=join_request_id)
#     except JoinRequest.DoesNotExist:
#         return Response({"error": "Join request does not exist."}, status=status.HTTP_404_NOT_FOUND)

#     # Check if the user approving the request is the league commissioner
#     if request.user != join_request.league.commissioner:
#         return Response({"error": "You are not authorized to approve this join request."}, status=status.HTTP_403_FORBIDDEN)

#     # Add the user to the league's members and update owners_count
#     join_request.league.member.add(join_request.user)  # Corrected field name from members to member
#     join_request.league.owners_count += 1
#     join_request.league.save()

#     # Update the join request status instead of deleting it
#     join_request.status = 'approved'
#     join_request.save()

#     return Response({"message": "Join request approved successfully."}, status=status.HTTP_200_OK)





