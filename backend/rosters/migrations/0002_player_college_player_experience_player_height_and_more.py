# Generated by Django 5.0.3 on 2024-04-06 01:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rosters', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='college',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='player',
            name='experience',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='player',
            name='height',
            field=models.CharField(default='DNE', max_length=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='player',
            name='nfl_team',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='player',
            name='weight',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
