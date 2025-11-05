from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from .models import Profile, Skill, Education, Project, Contact
from .forms import ContactForm

def home(request):
    profile = Profile.objects.first()
    # show only featured (limit 3–4)
    featured_skills = Skill.objects.filter(is_featured=True).order_by('-proficiency')[:4]
    featured_projects = Project.objects.filter(is_featured=True)[:4]
    education = Education.objects.all()[:3]
    contact_form = ContactForm()
    return render(request, 'main/index.html', {
        'profile': profile,
        'featured_skills': featured_skills,
        'featured_projects': featured_projects,
        'education': education,
        'contact_form': contact_form,
    })

def skills_list(request):
    profile = Profile.objects.first()
    skills = Skill.objects.all()
    return render(request, 'main/skills_list.html', {'profile': profile, 'skills': skills})

def projects_list(request):
    profile = Profile.objects.first()
    projects = Project.objects.all()
    return render(request, 'main/projects_list.html', {'profile': profile, 'projects': projects})

@require_http_methods(["POST"])
def contact(request):
    form = ContactForm(request.POST)
    if form.is_valid():
        form.save()
        messages.success(request, "Thanks! I'll get back to you soon.")
    else:
        messages.error(request, "Please fix the errors and try again.")
    return redirect('main:home')
