from rest_framework import generics, status
from .models import Folder, Note
from .serializers import FolderSerializer, NoteSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
import fitz
from docx import Document
from rest_framework.parsers import MultiPartParser, FormParser
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


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

class FolderNotesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, folder_id):
        notes = Note.objects.filter(folder_id=folder_id, folder__user=request.user)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

class NoteDetailView(RetrieveUpdateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(folder__user=self.request.user)

class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Handle PDF
            if uploaded_file.name.endswith('.pdf'):
                text = ""
                with fitz.open(stream=uploaded_file.read(), filetype="pdf") as doc:
                    for page in doc:
                        text += page.get_text()

            # Handle DOCX
            elif uploaded_file.name.endswith(('.docx', '.doc')):
                document = Document(uploaded_file)
                text = "\n".join([para.text for para in document.paragraphs])

            else:
                return Response({"error": "Unsupported file type."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"text": text})
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AIGenerateSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        input_text = request.data.get("text")
        if not input_text:
            return Response({"error": "No input text provided."}, status=400)

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You're a helpful assistant who summarizes study material."},
                    {"role": "user", "content": f"Summarize the following into bullet-point notes:\n\n{input_text}"}
                ],
                temperature=0.5,
                max_tokens=800
            )
            return Response({"summary": response.choices[0].message.content})
        except Exception as e:
            print("AI ERROR:", str(e))
            return Response({"error": str(e)}, status=500)