from rest_framework import generics
from .models import Folder, Note
from .serializers import FolderSerializer, NoteSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

class FolderListCreateView(generics.ListCreateAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Folder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(folder__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()

