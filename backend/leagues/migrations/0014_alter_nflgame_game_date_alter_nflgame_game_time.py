# Generated by Django 5.0.4 on 2024-04-14 03:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leagues', '0013_alter_week_end_date_alter_week_lock_time_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nflgame',
            name='game_date',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='nflgame',
            name='game_time',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]