from django.urls import path
from . import views
#from django.conf.urls import url


urlpatterns = [
    path('', views.index, name='index'),
]

urlpatterns += [path('register/', views.registration_view, name="registration")]
urlpatterns += [path('statistic/', views.statistic_view, name="statistic")]
urlpatterns += [path('articles/', views.articles_view, name="articles")]
urlpatterns += [path('questionary/', views.questionary_view, name="questionary")]
urlpatterns += [path('articles/<int:id>/', views.article_view, name="article/<int:id>")]
