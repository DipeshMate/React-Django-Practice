from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status , viewsets, permissions
from rest_framework.exceptions import NotFound

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
#from knox.models import AuthToken

User = get_user_model()


@api_view(["GET", "POST"])  # Handle list and creation
def track_list(request):
    if request.method == "GET":  # Fetch all tasks
        trackWork = Track.objects.all()
        serializer = TrackSerializer(trackWork, many=True)
        return Response(serializer.data)
    
    elif request.method == "POST":  # Create a new task
        serializer = TrackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PATCH", "DELETE"])  # Handle specific task
def track_detail(request, pk):
    track = get_object_or_404(Track, id=pk)
    
    try:
        track = Track.objects.get(pk=pk)
    except Track.DoesNotExist:
        raise NotFound(detail=f"Task with ID {pk} not found")
    
    completed = request.data.get('completed', None)

    if completed is not None:
        if completed:  # Marking task as completed
            today = now().date()
            if track.last_completed_date:
                delta = (today - track.last_completed_date).days
                if delta == 1:  # Increment streak for consecutive day
                    track.streak += 1
                elif delta > 1:  # Reset streak if day is skipped
                    track.streak = 1
            else:
                track.streak = 1  # Start streak if first-time completion
            track.last_completed_date = today
        else:  # Reset streak when task is marked incomplete
            track.streak = 0
            track.last_completed_date = None

    
    if request.method == 'GET':  # Retrieve a task
        serializer = TrackSerializer(track)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':  # Update task fields
        serializer = TrackSerializer(track, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # Trigger custom save logic
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':  # Delete a task
        track.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PATCH'])
def update_task(request, pk):
    try:
        task = Track.objects.get(pk=pk)
    except Track.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    data = request.data
    task.completed = data.get('completed', task.completed)  # Update completion status
    task.save()

    serializer = TrackSerializer(task)
    return Response(serializer.data)

@api_view(["PATCH"])
def update_streak(request):
    streak = request.data.get("streak")
    # Update streak in database (use appropriate logic for your model)
    track = Track.objects.get(id=request.data.get("id"))
    track.streak = streak
    track.save()
    return Response({"streak": track.streak}, status=status.HTTP_200_OK)


class RegisterViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    
    def create(self,request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else: 
            return Response(serializer.errors,status=400)


@api_view(['POST'])
def register_user(request):
    data = request.data
    phone_number = data.get('phone_number')
    email = data.get('email')
    password = data.get('password')

    if not all([phone_number, email, password]):
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Save the user or handle registration logic
    return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
