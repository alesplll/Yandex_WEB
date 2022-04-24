from django.db import models
from django.urls import reverse
from django.contrib.auth.models import AbstractBaseUser
from .managers import CustomUserManager
from django.contrib.auth.models import PermissionsMixin


class QuestionsModel(models.Model):
    questionary_id = models.AutoField(primary_key=True)
    #user_id = models.ForeignKey('catalog.customuser', on_delete=models.CASCADE, db_column='questions', blank=False, null=False)
    gender = models.CharField(max_length=1, null=False)
    age = models.IntegerField(null=False)
    job = models.CharField(max_length=2, null=False)
    instant_coffee = models.IntegerField(null=False)
    grain_coffee = models.IntegerField(null=False)
    tea = models.IntegerField(null=False)
    energy_drinks = models.IntegerField(null=False)
    pills = models.IntegerField(null=False)
    addiction1 = models.IntegerField(null=False)
    addiction2 = models.IntegerField(null=False)
    addiction3 = models.IntegerField(null=False)
    symptoms = models.CharField(max_length=6, null=True)

    class Meta:
        pass

    def __str__(self):
        return self.user_id

    def get_absolute_url(self):
        return reverse('user-detail', args=[str(self.id)])


class CustomUser(AbstractBaseUser, PermissionsMixin):
    objects = CustomUserManager()
    last_login = False
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=40, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=30)
    #questions = models.ForeignKey('catalog.questionsmodel', on_delete=models.CASCADE, db_column='user_id', blank=True, null=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'password']

    class Meta:
        pass

    def __str__(self):
        return self.username


    def get_absolute_url(self):
        return reverse('user-detail', args=[str(self.id)])


class Article(models.Model):
    article_id = models.AutoField(primary_key=True)
    title = models.TextField()
    summary = models.TextField(null=True)
    tags = models.TextField(null=True)
    template = models.TextField(default='base_article')

    class Meta:
        pass

    def create_dict(self):
        return {'title': self.title, 'tags': [i.capitalize().replace('_', ' ') for i in self.tags.split()],
                'summary': self.summary, 'id': self.article_id}

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('user-detail', args=[str(self.article_id)])


