# Generated by Django 5.0.3 on 2024-04-13 13:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rosters', '0016_alter_rosterspot_team_delete_team'),
    ]

    operations = [
        migrations.DeleteModel(
            name='TeamPlayer',
        ),
    ]
