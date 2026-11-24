from django.urls import path
from apps.genealogy.views import (
    PersonListView, PersonDetailView, FamilyTreeGraphView,
    ParentChildRelationshipView, PartnerRelationshipView,
    KinshipCalculateView, DuplicatePersonCheckView,
    PendingTreeChangeListView, PendingTreeChangeActionView
)

urlpatterns = [
    # Slug-based routes (for Next.js App Router dynamic slug)
    path('by-slug/<str:slug>/persons/', PersonListView.as_view(), name='slug-genealogy-person-list'),
    path('by-slug/<str:slug>/persons/<uuid:person_id>/', PersonDetailView.as_view(), name='slug-genealogy-person-detail'),
    path('by-slug/<str:slug>/tree/', FamilyTreeGraphView.as_view(), name='slug-genealogy-tree-graph'),
    path('by-slug/<str:slug>/relationships/parent-child/', ParentChildRelationshipView.as_view(), name='slug-genealogy-parent-child'),
    path('by-slug/<str:slug>/relationships/parent-child/<uuid:relationship_id>/', ParentChildRelationshipView.as_view(), name='slug-genealogy-parent-child-delete'),
    path('by-slug/<str:slug>/relationships/partner/', PartnerRelationshipView.as_view(), name='slug-genealogy-partner'),
    path('by-slug/<str:slug>/relationships/partner/<uuid:relationship_id>/', PartnerRelationshipView.as_view(), name='slug-genealogy-partner-delete'),
    path('by-slug/<str:slug>/kinship/calculate/', KinshipCalculateView.as_view(), name='slug-genealogy-kinship-calculate'),
    path('by-slug/<str:slug>/persons/duplicates/', DuplicatePersonCheckView.as_view(), name='slug-genealogy-person-duplicates'),
    path('by-slug/<str:slug>/tree/proposals/', PendingTreeChangeListView.as_view(), name='slug-genealogy-tree-proposals'),
    path('by-slug/<str:slug>/tree/proposals/<uuid:proposal_id>/<str:action>/', PendingTreeChangeActionView.as_view(), name='slug-genealogy-proposal-action'),

    # UUID-based routes
    path('<uuid:id>/persons/', PersonListView.as_view(), name='genealogy-person-list'),
    path('<uuid:id>/persons/<uuid:person_id>/', PersonDetailView.as_view(), name='genealogy-person-detail'),
    path('<uuid:id>/tree/', FamilyTreeGraphView.as_view(), name='genealogy-tree-graph'),
    path('<uuid:id>/relationships/parent-child/', ParentChildRelationshipView.as_view(), name='genealogy-parent-child'),
    path('<uuid:id>/relationships/parent-child/<uuid:relationship_id>/', ParentChildRelationshipView.as_view(), name='genealogy-parent-child-delete'),
    path('<uuid:id>/relationships/partner/', PartnerRelationshipView.as_view(), name='genealogy-partner'),
    path('<uuid:id>/relationships/partner/<uuid:relationship_id>/', PartnerRelationshipView.as_view(), name='genealogy-partner-delete'),
    path('<uuid:id>/kinship/calculate/', KinshipCalculateView.as_view(), name='genealogy-kinship-calculate'),
    path('<uuid:id>/persons/duplicates/', DuplicatePersonCheckView.as_view(), name='genealogy-person-duplicates'),
    path('<uuid:id>/tree/proposals/', PendingTreeChangeListView.as_view(), name='genealogy-tree-proposals'),
    path('<uuid:id>/tree/proposals/<uuid:proposal_id>/<str:action>/', PendingTreeChangeActionView.as_view(), name='genealogy-proposal-action'),
]
