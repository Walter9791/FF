# Generated by Django 5.0.3 on 2024-04-13 18:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rosters', '0018_alter_rosterspot_unique_together_alter_position_name_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='rosterspot',
            unique_together=set(),
        ),
    ]