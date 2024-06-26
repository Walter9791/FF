# Generated by Django 5.0.3 on 2024-04-10 00:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rosters', '0009_alter_position_is_kick_returner_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='position',
            name='name',
            field=models.CharField(choices=[('QB', 'Quarterback'), ('RB', 'Running Back'), ('WR', 'Wide Receiver'), ('TE', 'Tight End'), ('T', 'Tackle'), ('G', 'Guard'), ('C', 'Center'), ('DT', 'Defensive Tackle'), ('DE', 'Defensive End'), ('LB', 'Linebacker'), ('CB', 'Cornerback'), ('S', 'Safety'), ('KR', 'Kick Returner'), ('PR', 'Punt Returner'), ('K', 'Kicker'), ('P', 'Punter')], max_length=5, unique=True),
        ),
    ]
