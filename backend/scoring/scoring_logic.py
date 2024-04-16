from .scoring_rules import SCORING_RULES

def calculate_score(player_performance):
    position = player_performance.player.position 
    position_key = "WR_RB_TE" if position in ["WR", "RB", "TE"] else position  # Group WR, RB, TE
    position_key = "OL" if position in ["T", "G", "C"] else position_key  # Group T, G, C
    position_key = "DEFENSE" if position in ["DT", "DE", "LB", "CB", "S"] else position_key 
    position_key = "SPECIAL_TEAMS" if position in ["KR", "PR", "K", "P"] else position_key
    score = 10 if position_key == "OL" else 0

    #Global rules
    for stat, value in player_performance.stats.items():
        if stat in SCORING_RULES['global']:
            rule = SCORING_RULES['global'][stat]
            score += rule(value) if callable(rule) else value * rule
    
    #position-specific rules
    if position_key in SCORING_RULES:
        for stat, value in player_performance.stats.items():
            if stat in SCORING_RULES[position_key]:
                rule = SCORING_RULES[position_key][stat]
                score += rule(value) if callable(rule) else value * rule

    score = round(score, 2) 

    return score
