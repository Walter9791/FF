# Generated by Django 5.0.4 on 2024-04-17 00:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rosters', '0027_alter_rosterspot_unique_together'),
    ]

    operations = [
        migrations.AddField(
            model_name='rosterspot',
            name='score',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=3),
        ),
    ]
