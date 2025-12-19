from django.shortcuts import render, get_object_or_404
from .models import Todo
from .serializers import TodoSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

# Create your views here.

@api_view(["GET", "POST"]) # Post will create a form in API
def todo_list(request):
    if request.method ==  "GET": # to fetch to read
        todos = Todo.objects.all()
        serializer = TodoSerializer(todos, many=True) # importing from serializer
        return Response(serializer.data)
    
    elif request.method == "POST": # to create 
        serializer = TodoSerializer(data=request.data) # to create a new todo
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) # HTTP for message display that todo is created
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # if not valid then error message



@api_view(["GET", "PATCH", "PUT", "DELETE"])
def todo_detail(request, pk):
    todo = get_object_or_404(Todo, id=pk)
    
    if request.method == 'GET':
        serializer = TodoSerializer(todo)
        return Response(serializer.data)
    # a PUT request simply replaces an entire object while PATCH request update a specific field in an object 
    elif request.method == 'PATCH': 
        serializer = TodoSerializer(todo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        todo.delete()
        return Response(status = status.HTTP_204_NO_CONTENT)