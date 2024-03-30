from django.shortcuts import render
from rest_framework import generics
from .serializers import LeagueSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import League, JoinRequest
from .serializers import LeagueSerializer, JoinRequestSerializer

class LeagueListCreate(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = League.objects.all()
    serializer_class = LeagueSerializer

    def perform_create(self, serializer):
        serializer.save(commissioner=self.request.user) 

class LeagueDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = League.objects.all()
    serializer_class = LeagueSerializer

@api_view(['POST'])
def send_join_request(request, pk):
    try:
        league = League.objects.get(pk=pk)  # Corrected line
    except League.DoesNotExist:
        return Response({"error": "League does not exist."}, status=status.HTTP_404_NOT_FOUND)

    # Create a join request
    # Assuming 'message' can be included from the frontend, it should be handled here.
    initial_data = {
        'league': league.pk,
        'user': request.user.pk,
        'message': request.data.get('message', ''),  # Optional message
        'status': 'pending'  # Set status to 'pending' explicitly
    }

    serializer = JoinRequestSerializer(data=initial_data, context={'request': request})
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def approve_join_request(request, join_request_id):
    try:
        join_request = JoinRequest.objects.get(pk=join_request_id)
    except JoinRequest.DoesNotExist:
        return Response({"error": "Join request does not exist."}, status=status.HTTP_404_NOT_FOUND)

    # Check if the user approving the request is the league commissioner
    if request.user != join_request.league.commissioner:
        return Response({"error": "You are not authorized to approve this join request."}, status=status.HTTP_403_FORBIDDEN)

    # Add the user to the league's members and update owners_count
    join_request.league.member.add(join_request.user)  # Corrected field name from members to member
    join_request.league.owners_count += 1
    join_request.league.save()

    # Update the join request status instead of deleting it
    join_request.status = 'approved'
    join_request.save()

    return Response({"message": "Join request approved successfully."}, status=status.HTTP_200_OK)



@api_view(['POST'])
def deny_join_request(request, join_request_id):
    try:
        join_request = JoinRequest.objects.get(pk=join_request_id)
    except JoinRequest.DoesNotExist:
        return Response({"error": "Join request does not exist."}, status=status.HTTP_404_NOT_FOUND)

    # Check if the user denying the request is the league commissioner
    if request.user != join_request.league.commissioner:
        return Response({"error": "You are not authorized to deny this join request."}, status=status.HTTP_403_FORBIDDEN)

    join_request.delete()  # Delete the join request
    return Response({"message": "Join request denied successfully."}, status=status.HTTP_200_OK)



