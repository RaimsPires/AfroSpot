# users/admin.py
from django.contrib import admin
from django.contrib.auth.models import Group

# Import Unfold's admin classes instead of standard Django ones
from unfold.admin import ModelAdmin, StackedInline
from .models import User, UserSettings

# 1. Create the Inline for UserSettings
class UserSettingsInline(StackedInline):
    model = UserSettings
    can_delete = False
    verbose_name_plural = 'User Settings'
    fk_name = 'user'

# 2. Register the Custom User Model
@admin.register(User)
class CustomUserAdmin(ModelAdmin):
    # What shows up on the list view
    list_display = ('email', 'first_name', 'last_name', 'is_store_owner', 'is_staff', 'is_active')
    list_filter = ('is_active', 'is_staff', 'is_store_owner', 'language')
    search_fields = ('email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-date_joined',)
    
    # Attach the UserSettings inline here
    inlines = [UserSettingsInline]

    # How the detail/edit page is grouped
    fieldsets = (
        ('Login Credentials', {
            'fields': ('email', 'password')
        }),
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'phone_number', 'dob', 'profile_picture', 'language')
        }),
        ('Permissions & Roles', {
            'fields': (
                'is_active', 
                'is_staff', 
                'is_superuser', 
                'is_store_owner', 
                'groups', 
                'user_permissions'
            )
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined')
        }),
    )

    # Prevent password hashing issues if someone tries to type a plaintext password in the admin
    readonly_fields = ('last_login', 'date_joined')

# (Optional) Unregister the default Group model and re-register it with Unfold
admin.site.unregister(Group)

@admin.register(Group)
class GroupAdmin(ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)