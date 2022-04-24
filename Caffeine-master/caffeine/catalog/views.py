from django.shortcuts import render

from .models import CustomUser, Article, QuestionsModel
from django.views.generic.edit import FormView
from .forms import CustomUserRegistrationForm, Questionary1, Questionary2, Questionary3, Questionary4, Questionary5, Articles_filter

from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView


def index(request):
    num_users = CustomUser.objects.all().count()
    num_articles = Article.objects.all().count()

    return render(
        request,

        'index.html',
        context={'num_users': num_users, 'num_articles': num_articles},
    )


def registration_view(request):
    form = CustomUserRegistrationForm(request.POST)
    if form.is_valid():
        username = form.cleaned_data.get('username')
        password = make_password(form.cleaned_data.get('password'))
        email = form.cleaned_data.get('email')
        user = CustomUser(username=username, password=password, email=email)
        user.save()
        return redirect('login')
    else:
        form = CustomUserRegistrationForm()
    return render(request, 'registration/register.html', {'form': form

})


def statistic_view(request):
    questionaries = QuestionsModel.objects.all()

    def get_stat(column, value):
        if column == 'gender':
            return len(questionaries.filter(gender=value))
        elif column == 'job':
            return len(questionaries.filter(job=value))
        elif column == 'caffe1':
            return len(questionaries.filter(instant_coffee=value))
        elif column == 'caffe2':
            return len(questionaries.filter(grain_coffee=value))
        elif column == 'tea':
            return len(questionaries.filter(tea=value))
        elif column == 'energydrinks':
            return len(questionaries.filter(energy_drinks=value))
        elif column == 'pills':
            return len(questionaries.filter(pills=value))
        elif column == 'spec1':
            return len(questionaries.filter(addiction1=value))
        elif column == 'spec2':
            return len(questionaries.filter(addiction2=value))
        elif column == 'spec3':
            return len(questionaries.filter(addiction3=value))
        elif column == 'age':
            res = [i.age for i in questionaries]
            stat2 = {'15-': 0, '16-18': 0, '19-23': 0, '24-30': 0, '31-45': 0, '46-60': 0, '61+': 0}
            for i in res:
                if i <= 15:
                    stat2['15-'] += 1
                elif 16 <= i <= 18:
                    stat2['16-18'] += 1
                elif 19 <= i <= 23:
                    stat2['19-23'] += 1
                elif 24 <= i <= 30:
                    stat2['24-30'] += 1
                elif 31 <= i <= 45:
                    stat2['31-45'] += 1
                elif 46 <= i <= 60:
                    stat2['46-60'] += 1
                elif i >= 61:
                    stat2['61+'] += 1
            return stat2
        elif column == 'symptoms':
            res = ''.join([i.symptoms for i in questionaries])
            res = {int(i): res.count(i) for i in '123456'}
            return res

    stat_data = [('male', get_stat('gender', 'M')), ('female', get_stat('gender', 'F')), ('Sc', get_stat('job', 'Sc')),
                 ('St',  get_stat('job', 'St')), ('T',  get_stat('job', 'T')), ('O',  get_stat('job', 'O'))]

    stat1 = get_stat('symptoms', 0)
    age_stat = get_stat('age', 0)
    stat_data += [('symp' + str(i), stat1[i]) for i in stat1.keys()]
    stat_data += [('age' + str(i), age_stat[i]) for i in age_stat.keys()]
    stat_data += [('caffe1_' + str(i), get_stat('caffe1', str(i))) for i in range(6)]
    stat_data += [('caffe2_' + str(i), get_stat('caffe2', str(i))) for i in range(6)]
    stat_data += [('tea_' + str(i), get_stat('tea', str(i))) for i in range(6)]
    stat_data += [('energydrinks_' + str(i), get_stat('energydrinks', str(i))) for i in range(6)]
    stat_data += [('pills_' + str(i), get_stat('pills', str(i))) for i in range(6)]
    stat_data += [('spec1_' + str(i), get_stat('spec1', str(i))) for i in range(4)]
    stat_data += [('spec2_' + str(i), get_stat('spec2', str(i))) for i in range(4)]
    stat_data += [('spec3_' + str(i), get_stat('spec3', str(i))) for i in range(3)]
    
    return render(request, 'statistic.html', context={'stat_data': stat_data})


def articles_view(request):
    num = Article.objects.all().count()
    articles_list = [i.create_dict() for i in Article.objects.all()]
    form = Articles_filter()
    filters = None
    if request.method == 'POST':
        req = dict(request.POST)
        if 'filter_field' in req.keys():
            filters = req['filter_field']
            articles_list = [i for i in articles_list if set(i['tags']).intersection(set(filters))]
            num = len(articles_list)

    return render(request, 'articles.html', {'num': num, 'articles_list': articles_list,
                                             'form': form, 'filters': filters})


@login_required
def questionary_view(request, data={'n': 1}):
    questionary_dict = {0: None, 1: Questionary1(), 2: Questionary2(), 3: Questionary3(), 4: Questionary4(), 5: Questionary5(), 6: None}
    req = None
    form = form = questionary_dict[data['n']]
    if request.method == 'POST':
        req = request.POST
        if req.get('next'):
            data.update(req)
            data['n'] += 1
            if data['n'] == 6:
                # user_id=request.user in QuestionsModel
                questionary = QuestionsModel(gender=data['gender'][0],
                                             age=int(data['age'][0]),
                                             job=data['job'][0],
                                             instant_coffee=int(data['instant_coffee'][0]),
                                             grain_coffee=int(data['grain_coffee'][0]),
                                             tea=int(data['tea'][0]),
                                             energy_drinks=int(data['energy_drinks'][0]),
                                             pills=int(data['pills'][0]),
                                             addiction1=int(data['addiction1'][0]),
                                             addiction2=int(data['addiction2'][0]),
                                             addiction3=int(data['addiction3'][0]),
                                             symptoms=''.join(
                                                 [str(i) for i in data['symptoms']]))
                questionary.save()
                data = {}
                data['n'] = 1
                return render(request, 'thanks.html')
            else:
                form = questionary_dict[data['n']]
                del data['next']

        elif req.get('back'):
            data['n'] -= 1
            form = questionary_dict[data['n']]

    return render(request, 'questionary_base.html', context={'form': form, 'req': req, 'data': data, 'back': data['n'] >= 2})


def article_view(request, id):
    try:
        template = Article.objects.filter(article_id=id)[0].template
    except KeyError:
        template = 'article_error'
    return render(request, f'articles/{template}.html')
