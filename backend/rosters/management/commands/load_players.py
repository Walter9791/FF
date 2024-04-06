import csv
from rosters.models import Player, Position
from django.core.management.base import BaseCommand




class Command(BaseCommand):
    help = 'Load a players list from a CSV file into the database'

    def add_arguments(self, parser):
        parser.add_argument('csv_file_path', type=str, help='The CSV file path')

    def handle(self, *args, **kwargs):
        file_path = kwargs['csv_file_path']
        
        with open(file_path, mode='r', encoding='utf-8-sig') as csv_file:
            reader = csv.DictReader(csv_file)
            for row in reader:
                position, _ = Position.objects.get_or_create(name=row['position'])
                player, created = Player.objects.get_or_create(
                    name=row['name'],
                    defaults={
                        'height': row['height'],
                        'weight': int(row['weight']),
                        'experience': int(row['experience']) if row['experience'] else None,
                        'college': row['college'],
                        'nfl_team': row['nfl_team'],
                        'position': position,
                        'jersey_number': int(row['jersey_number']) if row['jersey_number'] else None
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Player "{player.name}" created successfully'))
                else:
                    self.stdout.write(f'Player "{player.name}" already exists')