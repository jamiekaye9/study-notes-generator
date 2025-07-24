from django.urls import path
from .views import FolderListCreateView, NoteListCreateView, FolderNotesView, NoteDetailView, FileUploadView, AIGenerateSummaryView

urlpatterns = [
    path('folders/', FolderListCreateView.as_view(), name='folder-list-create'),
    path('notes/', NoteListCreateView.as_view(), name='note-list-create'),
    path('folders/<int:folder_id>/notes/', FolderNotesView.as_view(), name='folder-notes-view'),
    path('notes/<int:pk>/', NoteDetailView.as_view(), name='note-detail'),
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('summarize/', AIGenerateSummaryView.as_view(), name='summarize-text'),
]