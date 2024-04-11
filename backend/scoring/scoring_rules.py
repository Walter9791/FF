SCORING_RULES = {
    "global" : {
            'touchdown' : 6,
            'fumble_lost': -2,
            'penalty' : -2, 
            }, 

    "QB" : {
        'pass_yards' : lambda yards : yards / 25, 
        'interceptions' : -2,
        },

    "WR_RB_TE" : {
        'yards': lambda yards : yards/10, 
        'receptions': 1, 
        'drop': -1,
        }, 

    "OL" : {
        ##Starting at 10 then deducting
        'sack_given' : -3,
        'qb_hit' : -2, 
        'qb_hurry' : -1, 
        # 'qb_pressure' : lambda pressures : pressures/-.5,
    }, 

    "DEFENSE" : {
        'tackle' : 1,
        'tackle_assist' : lambda tackle_assist : tackle_assist/.5, 
        'sack' : 2, 
        'qb_hit' : lambda qb_hit : qb_hit/.5, 
        'qb_hurry' : lambda qb_hurry : qb_hurry/.25, 
        'batted_pass' : lambda batted_pass : batted_pass/.5, 
        'forced_fumble' : 2, 
        'interception' : 2,
        'pass_breakup' : 1, 
        'reception_given' : lambda receptions_given : receptions_given/-.25, 
        "missed_tackle" : lambda missed_tackle : missed_tackle/-.5,
    },

    "SPECIAL_TEAMS" : {
        'XP' : 1, 
        'XP_missed' : -1, 
        'FG' : 3, 
        'FG_missed' : -1,  
        'FG_40_49' : 1,
        'FG_50_59' : 2, 
        'FG_60_plus': 4, 
        'punt_inside20' : 2, 
        'punt_ypa' : lambda yards_per_attempt : yards_per_attempt/10,
        'punt_ypr' : lambda yards_per_return : yards_per_return/-10,
        'kick_return_yards' : lambda kick_return_yards : kick_return_yards/10, 
        'punt_return_yards' : lambda punt_return_yards : punt_return_yards/10,
        'muffed' : -2, 
            
    }

}