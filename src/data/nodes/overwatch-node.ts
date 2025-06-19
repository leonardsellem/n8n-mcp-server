import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const overwatchNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.overwatch',
  displayName: 'Overwatch',
  description: 'Use the Overwatch node to automate work with Overwatch game data and integrate Overwatch with other applications. n8n has built-in support for retrieving player statistics, hero information, competitive rankings, and match data.',
  category: 'Gaming',
  subcategory: 'Statistics',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'player',
      description: 'The resource to operate on',
      options: [
        { name: 'Player', value: 'player', description: 'Get player statistics and information' },
        { name: 'Hero', value: 'hero', description: 'Get hero information and statistics' },
        { name: 'Match', value: 'match', description: 'Get match data and results' },
        { name: 'Competitive', value: 'competitive', description: 'Get competitive rankings and seasons' },
        { name: 'Achievement', value: 'achievement', description: 'Get player achievements' },
        { name: 'Career', value: 'career', description: 'Get career statistics' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        // Player operations
        { name: 'Get Profile', value: 'getProfile', description: 'Get player profile information' },
        { name: 'Get Statistics', value: 'getStatistics', description: 'Get player game statistics' },
        { name: 'Get Summary', value: 'getSummary', description: 'Get player summary' },
        // Hero operations
        { name: 'Get All Heroes', value: 'getAllHeroes', description: 'Get list of all heroes' },
        { name: 'Get Hero Stats', value: 'getHeroStats', description: 'Get statistics for a specific hero' },
        { name: 'Get Hero Details', value: 'getHeroDetails', description: 'Get detailed hero information' },
        // Match operations
        { name: 'Get Recent Matches', value: 'getRecentMatches', description: 'Get recent match history' },
        { name: 'Get Match Details', value: 'getMatchDetails', description: 'Get detailed match information' },
        // Competitive operations
        { name: 'Get Competitive Stats', value: 'getCompetitiveStats', description: 'Get competitive season statistics' },
        { name: 'Get Season Rankings', value: 'getSeasonRankings', description: 'Get season ranking information' },
        { name: 'Get Skill Rating', value: 'getSkillRating', description: 'Get current skill rating' },
        // Achievement operations
        { name: 'Get Achievements', value: 'getAchievements', description: 'Get player achievements' },
        { name: 'Get Achievement Progress', value: 'getAchievementProgress', description: 'Get achievement progress' },
        // Career operations
        { name: 'Get Career Stats', value: 'getCareerStats', description: 'Get overall career statistics' },
        { name: 'Get Playtime', value: 'getPlaytime', description: 'Get hero playtime statistics' }
      ]
    },
    {
      name: 'battleTag',
      displayName: 'Battle Tag',
      type: 'string',
      required: false,
      default: '',
      description: 'The player\'s Battle.net tag (e.g., PlayerName-1234)'
    },
    {
      name: 'platform',
      displayName: 'Platform',
      type: 'options',
      required: false,
      default: 'pc',
      description: 'Gaming platform',
      options: [
        { name: 'PC', value: 'pc', description: 'PC/Battle.net' },
        { name: 'PlayStation', value: 'psn', description: 'PlayStation Network' },
        { name: 'Xbox', value: 'xbl', description: 'Xbox Live' },
        { name: 'Nintendo Switch', value: 'nintendo-switch', description: 'Nintendo Switch' }
      ]
    },
    {
      name: 'region',
      displayName: 'Region',
      type: 'options',
      required: false,
      default: 'us',
      description: 'Game region',
      options: [
        { name: 'Americas', value: 'us', description: 'Americas region' },
        { name: 'Europe', value: 'eu', description: 'Europe region' },
        { name: 'Asia', value: 'asia', description: 'Asia region' }
      ]
    },
    {
      name: 'heroName',
      displayName: 'Hero Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the hero to get statistics for'
    },
    {
      name: 'gameMode',
      displayName: 'Game Mode',
      type: 'options',
      required: false,
      default: 'quickplay',
      description: 'Game mode to filter statistics',
      options: [
        { name: 'Quick Play', value: 'quickplay', description: 'Quick Play matches' },
        { name: 'Competitive', value: 'competitive', description: 'Competitive matches' },
        { name: 'Arcade', value: 'arcade', description: 'Arcade mode matches' }
      ]
    },
    {
      name: 'season',
      displayName: 'Season',
      type: 'string',
      required: false,
      default: 'current',
      description: 'Competitive season number or "current" for current season'
    },
    {
      name: 'role',
      displayName: 'Role',
      type: 'options',
      required: false,
      default: 'all',
      description: 'Hero role to filter by',
      options: [
        { name: 'All', value: 'all', description: 'All roles' },
        { name: 'Tank', value: 'tank', description: 'Tank heroes' },
        { name: 'Damage', value: 'damage', description: 'Damage heroes' },
        { name: 'Support', value: 'support', description: 'Support heroes' }
      ]
    },
    {
      name: 'matchId',
      displayName: 'Match ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Specific match ID to retrieve details for'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 10,
      description: 'Maximum number of results to return'
    },
    {
      name: 'includePrivate',
      displayName: 'Include Private Profile',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Attempt to include data from private profiles'
    },
    {
      name: 'timeFrame',
      displayName: 'Time Frame',
      type: 'options',
      required: false,
      default: 'all',
      description: 'Time frame for statistics',
      options: [
        { name: 'All Time', value: 'all', description: 'All time statistics' },
        { name: 'Last Week', value: 'week', description: 'Last 7 days' },
        { name: 'Last Month', value: 'month', description: 'Last 30 days' },
        { name: 'Current Season', value: 'season', description: 'Current competitive season' }
      ]
    }
  ],
  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: false
    }
  ],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'The processed Overwatch data'
    }
  ],
  credentials: ['overwatchApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Get Player Profile',
      description: 'Retrieve a player\'s profile information',
      workflow: {
        nodes: [
          {
            name: 'Overwatch',
            type: 'n8n-nodes-base.overwatch',
            parameters: {
              resource: 'player',
              operation: 'getProfile',
              battleTag: 'Player-1234',
              platform: 'pc',
              region: 'us'
            }
          }
        ]
      }
    },
    {
      name: 'Get Player Statistics',
      description: 'Get detailed statistics for a player',
      workflow: {
        nodes: [
          {
            name: 'Overwatch',
            type: 'n8n-nodes-base.overwatch',
            parameters: {
              resource: 'player',
              operation: 'getStatistics',
              battleTag: 'Player-1234',
              platform: 'pc',
              gameMode: 'competitive',
              timeFrame: 'season'
            }
          }
        ]
      }
    },
    {
      name: 'Get Hero Statistics',
      description: 'Get statistics for a specific hero',
      workflow: {
        nodes: [
          {
            name: 'Overwatch',
            type: 'n8n-nodes-base.overwatch',
            parameters: {
              resource: 'hero',
              operation: 'getHeroStats',
              battleTag: 'Player-1234',
              heroName: 'Tracer',
              gameMode: 'competitive',
              platform: 'pc'
            }
          }
        ]
      }
    },
    {
      name: 'Get Competitive Rankings',
      description: 'Get competitive season rankings',
      workflow: {
        nodes: [
          {
            name: 'Overwatch',
            type: 'n8n-nodes-base.overwatch',
            parameters: {
              resource: 'competitive',
              operation: 'getSeasonRankings',
              battleTag: 'Player-1234',
              season: 'current',
              platform: 'pc'
            }
          }
        ]
      }
    },
    {
      name: 'Get Recent Matches',
      description: 'Get recent match history for a player',
      workflow: {
        nodes: [
          {
            name: 'Overwatch',
            type: 'n8n-nodes-base.overwatch',
            parameters: {
              resource: 'match',
              operation: 'getRecentMatches',
              battleTag: 'Player-1234',
              platform: 'pc',
              gameMode: 'competitive',
              limit: 20
            }
          }
        ]
      }
    },
    {
      name: 'Get All Heroes',
      description: 'Get list of all Overwatch heroes',
      workflow: {
        nodes: [
          {
            name: 'Overwatch',
            type: 'n8n-nodes-base.overwatch',
            parameters: {
              resource: 'hero',
              operation: 'getAllHeroes',
              role: 'all'
            }
          }
        ]
      }
    },
    {
      name: 'Get Career Statistics',
      description: 'Get overall career statistics for a player',
      workflow: {
        nodes: [
          {
            name: 'Overwatch',
            type: 'n8n-nodes-base.overwatch',
            parameters: {
              resource: 'career',
              operation: 'getCareerStats',
              battleTag: 'Player-1234',
              platform: 'pc',
              timeFrame: 'all'
            }
          }
        ]
      }
    },
    {
      name: 'Get Player Achievements',
      description: 'Get achievements for a player',
      workflow: {
        nodes: [
          {
            name: 'Overwatch',
            type: 'n8n-nodes-base.overwatch',
            parameters: {
              resource: 'achievement',
              operation: 'getAchievements',
              battleTag: 'Player-1234',
              platform: 'pc'
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for easier importing
export const overwatchNodes: NodeTypeInfo[] = [overwatchNode];

// Export individual actions for the Overwatch node
export const overwatchActions = [
  // Player actions
  'get_player_profile',
  'get_player_statistics',
  'get_player_summary',
  // Hero actions
  'get_all_heroes',
  'get_hero_statistics',
  'get_hero_details',
  // Match actions
  'get_recent_matches',
  'get_match_details',
  // Competitive actions
  'get_competitive_statistics',
  'get_season_rankings',
  'get_skill_rating',
  // Achievement actions
  'get_achievements',
  'get_achievement_progress',
  // Career actions
  'get_career_statistics',
  'get_playtime_statistics'
];

// Export supported platforms
export const overwatchPlatforms = [
  'pc',
  'psn',
  'xbl',
  'nintendo-switch'
];

// Export supported regions
export const overwatchRegions = [
  'us',
  'eu',
  'asia'
];

// Export hero roles
export const overwatchRoles = [
  'tank',
  'damage',
  'support'
];

// Export game modes
export const overwatchGameModes = [
  'quickplay',
  'competitive',
  'arcade'
];

// Note: Overwatch does not have trigger capabilities, so no trigger events are exported
export const overwatchTriggers: string[] = [];