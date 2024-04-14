import csv
from django.core.management.base import BaseCommand
from django.db import transaction
from leagues.models import League, Team
from rosters.models import Player, Position, RosterSpot
import logging

logging.basicConfig(level=logging.INFO)

class Command(BaseCommand):
    help = 'Assigns players to teams and positions within specific leagues from a CSV file with statuses.'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file')
    def handle(self, *args, **options):
        with open(options['csv_file'], newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            with transaction.atomic():
                for row in reader:
                    league = League.objects.get(id=row['league_id'])
                    team = Team.objects.get(name=row['TeamName'], league=league)
                    position = Position.objects.get(name=row['position_id'])
                    player = Player.objects.get(name=row['PlayerName'])

                    # Try to find a RosterSpot with the given team and position that doesn't have a player yet
                    roster_spot = RosterSpot.objects.filter(team=team, position=position, player__isnull=True).first()

                    if roster_spot is None:
                        # If all the specific position spots are filled, find a RosterSpot with the given team and a null position that doesn't have a player yet
                        roster_spot = RosterSpot.objects.filter(team=team, position__isnull=True, player__isnull=True).first()

                        # When assigning to a bench spot or similar, update the position to match the intended position from the CSV
                        if roster_spot:
                            roster_spot.position = position

                    if roster_spot is None:
                        # If no available spots, log an error and continue to the next row
                        logging.error(f'All spots for team {team.name} are filled. Could not assign player {player.name} to a spot.')
                        continue

                    # Assign the player and status from the CSV to the found or created RosterSpot
                    roster_spot.player = player
                    roster_spot.status = row['Status']
                    roster_spot.save()




    # def handle(self, *args, **options):
    #     with open(options['csv_file'], newline='') as csvfile:
    #         reader = csv.DictReader(csvfile)
    #         with transaction.atomic():
    #             for row in reader:
    #                 league = League.objects.get(id=row['league_id'])
    #                 team = Team.objects.get(name=row['TeamName'], league=league)
    #                 position = Position.objects.get(name=row['position_id'])
    #                 player = Player.objects.get(name=row['PlayerName'])

    #                 # Try to find a RosterSpot with the given team and position that doesn't have a player yet
    #                 roster_spot = RosterSpot.objects.filter(team=team, position=position, player__isnull=True).first()

    #                 if roster_spot is None:
    #                     # If all the specific position spots are filled, find a RosterSpot with the given team and a null position that doesn't have a player yet
    #                     roster_spot = RosterSpot.objects.filter(team=team, position__isnull=True, player__isnull=True).first()
                        

    #                 if roster_spot is None:
    #                     # If all the spots are filled, log an error and continue to the next row
    #                     logging.error(f'All spots for team {team.name} are filled. Could not assign player {player.name} to a spot.')
    #                     continue

    #                 roster_spot.player = player
    #                 roster_spot.status = row['Status']
    #                 roster_spot.save()

                # for row in reader:
                #     try:
                #         league = League.objects.get(id=row['league_id'])
                #         team = Team.objects.get(name=row['TeamName'], league=league)
                #         position = Position.objects.get(name=row['position_id'])
                #         player = Player.objects.get(name=row['PlayerName'])

                #         roster_spot, created = RosterSpot.objects.update_or_create(
                #             team=team,
                #             defaults={
                #                 'player': player,
                #                 'position': position,
                #                 'status': row['Status']
                #             }
                #         )
                        # action = "created" if created else "updated"
                        # self.stdout.write(self.style.SUCCESS(
                        #     f"Successfully {action} roster spot for {player.name} in {team.name} as {position.name} with status {row['Status']}."
                        # ))
                    # except Player.DoesNotExist:
                    #     self.stdout.write(self.style.WARNING(
                    #         f"Player named '{row['PlayerName']}' not found. Skipping."
                    #     ))
                    # except Team.DoesNotExist:
                    #     self.stdout.write(self.style.WARNING(
                    #         f"Team named '{row['TeamName']}' not found in league ID {row['league_id']}. Skipping."
                    #     ))
                    # except Position.DoesNotExist:
                    #     self.stdout.write(self.style.WARNING(
                    #         f"Position with ID '{row['position_id']}' not found. Skipping."
                    #     ))
                    # except Exception as e:
                    #     self.stdout.write(self.style.ERROR(
                    #         f"An error occurred: {str(e)}"
                    #     ))
