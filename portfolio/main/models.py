from django.db import models
from django.core.validators import RegexValidator

# ---------- Profile ----------
class Profile(models.Model):
    name = models.CharField(max_length=100, default="Your Name")
    tagline = models.CharField(max_length=200, default="Full Stack Developer")
    about = models.TextField(blank=True)

    # ✅ CHANGED from ImageField → URLField
    profile_image = models.URLField(max_length=500, blank=True, null=True)

    # CV file can stay as file upload (optional)
    cv_file = models.FileField(upload_to='cv/', blank=True, null=True)

    # Social
    github_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)

    # “Technical expertise summary” — editable text block
    tech_summary_title = models.CharField(max_length=120, default="Technical Expertise")
    tech_summary = models.TextField(blank=True)

    def __str__(self):
        return self.name


# ---------- Skills ----------
class SkillTag(models.Model):
    name = models.CharField(max_length=40, unique=True)
    def __str__(self):
        return self.name


class Skill(models.Model):
    SKILL_TYPES = [
        ('technical', 'Technical'),
        ('soft', 'Soft Skill'),
        ('tools', 'Tools & Tech'),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    proficiency = models.PositiveIntegerField(default=80)
    skill_type = models.CharField(max_length=20, choices=SKILL_TYPES, default='technical')
    icon = models.CharField(max_length=50, blank=True)
    tags = models.ManyToManyField(SkillTag, blank=True, related_name='skills')
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_featured', 'skill_type', 'name']

    def __str__(self):
        return self.name


# ---------- Education ----------
class Education(models.Model):
    degree = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)
    location = models.CharField(max_length=100, blank=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    grade = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    is_current = models.BooleanField(default=False)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.degree} - {self.institution}"


# ---------- Project ----------
class ProjectTag(models.Model):
    name = models.CharField(max_length=40, unique=True)
    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    # ✅ CHANGED from ImageField → URLField
    image = models.URLField(max_length=500, blank=True, null=True)

    technologies = models.CharField(max_length=300, blank=True, help_text="Comma-separated or keep blank")
    tags = models.ManyToManyField(ProjectTag, blank=True, related_name='projects')
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_featured', '-start_date']

    def __str__(self):
        return self.title

    def tech_list(self):
        return [t.strip() for t in (self.technologies or '').split(',') if t.strip()]


# ---------- Contact ----------
class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone must be like +999999999 up to 15 digits."
    )
    phone = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Contact Messages"

    def __str__(self):
        return f"{self.name} - {self.email}"
