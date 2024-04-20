from django.contrib import admin
from .models import User, Profile


# Register your models here.

class UserAdmin(admin.ModelAdmin):              
    list_display = ('email', 'username', 'date_joined', 'last_login')
    search_fields = ('email', 'username')
    readonly_fields = ('id', 'date_joined', 'last_login')

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()

class ProfileAdmin(admin.ModelAdmin):           
    list_display = ('user', 'first_name', 'last_name', 'bio', 'avatar', 'verified')
    search_fields = ('user', 'first_name', 'last_name')
    readonly_fields = ('id', 'user', 'avatar', 'verified')

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()

admin.site.register(User, UserAdmin)        
admin.site.register(Profile, ProfileAdmin)  
