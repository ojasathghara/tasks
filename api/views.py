from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer

# Create your views here.
@api_view(['GET'])
def apiOverview(request):
    
    api_urls = {
        'List':'/task-list/',
        'Detail View':'/task-detail/<str:pk>/',
        'Create':'/task-create/',
        'Update':'/task-update/<str:pk>/',
        'Delete':'/task-delete/<str:pk>/',
    }

    return Response(api_urls)

@api_view(['GET'])
def taskList(request):
    tasks = Task.objects.all()
    json = TaskSerializer(tasks, many=True)

    return Response(json.data)

@api_view(['GET'])
def taskDetail(request, pk):
    task = Task.objects.get(id=pk)
    json = TaskSerializer(task, many=False)

    return Response(json.data)

@api_view(['POST'])
def taskCreate(request):
# normal request contains instance but api request contains data

    json = TaskSerializer(data = request.data)
    # just like forms
    if json.is_valid():
        json.save()

    # automatically generates the views, put the json string in the content field, duplicate ids are handled automatically
    return Response(json.data)

@api_view(['POST'])
def taskUpdate(request, pk):
    task = Task.objects.get(id=pk)
    json = TaskSerializer(instance=task, data=request.data)

    if json.is_valid():
        json.save()

    return Response(json.data)  

@api_view(['DELETE'])
def taskDelete(request, pk):
    try:
        task = Task.objects.get(id=pk)
        task.delete()
    except:
        return Response("Item does not exist!")

    return Response("Item deleted")  