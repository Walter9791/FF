import csv
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_date, parse_time
from leagues.models import Week, NFLTeam, NFLGame

class Command(BaseCommand):
    help = 'Import NFL schedule from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file')

    def handle(self, *args, **options):
        with open(options['csv_file'], newline='') as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                week_number = int(row['Week'])
                date_str = row['Date']  # e.g., "2024-09-07"
                time_str = row['Time (ET)']  # e.g., "20:20"
                away_team_name = row['Away Team']
                home_team_name = row['Home Team']
                week, _ = Week.objects.get_or_create(week_number=week_number)
                away_team = NFLTeam.objects.get_or_create(name=away_team_name)[0]
                home_team = NFLTeam.objects.get_or_create(name=home_team_name)[0]

                NFLGame.objects.get_or_create(
                    week=week,
                    home_team=home_team,
                    away_team=away_team,
                    game_date=date_str,
                    game_time=time_str
                )