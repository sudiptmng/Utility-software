from rest_framework.routers import DefaultRouter
from .views import PasswordEntryViewSet

router = DefaultRouter()
router.register(r'passwords', PasswordEntryViewSet, basename='password')

urlpatterns = router.urls