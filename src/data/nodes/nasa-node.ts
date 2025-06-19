import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const nasaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.nasa',
  displayName: 'NASA',
  description: 'Use the NASA node to automate work in NASA, and integrate NASA with other applications. n8n has built-in support for a wide range of NASA features, including retrieving imagery and data.',
  category: 'Science',
  subcategory: 'Space & Astronomy',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'astronomy',
      description: 'The NASA resource to operate on',
      options: [
        { name: 'Astronomy Picture of the Day', value: 'astronomy', description: 'Get astronomy picture of the day' },
        { name: 'Asteroid Neo Feed', value: 'asteroidFeed', description: 'Retrieve asteroid data based on closest approach date' },
        { name: 'Asteroid Neo Lookup', value: 'asteroidLookup', description: 'Look up asteroid by NASA SPK-ID' },
        { name: 'Asteroid Neo Browse', value: 'asteroidBrowse', description: 'Browse overall asteroid dataset' },
        { name: 'DONKI Coronal Mass Ejection', value: 'donkiCme', description: 'Retrieve DONKI coronal mass ejection data' },
        { name: 'DONKI Interplanetary Shock', value: 'donkiIps', description: 'Retrieve DONKI interplanetary shock data' },
        { name: 'DONKI Solar Flare', value: 'donkiFlr', description: 'Retrieve DONKI solar flare data' },
        { name: 'DONKI Solar Energetic Particle', value: 'donkiSep', description: 'Retrieve DONKI solar energetic particle data' },
        { name: 'DONKI Magnetopause Crossing', value: 'donkiMpc', description: 'Retrieve DONKI magnetopause crossing data' },
        { name: 'DONKI Radiation Belt Enhancement', value: 'donkiRbe', description: 'Retrieve DONKI radiation belt enhancement data' },
        { name: 'DONKI High Speed Stream', value: 'donkiHss', description: 'Retrieve DONKI high speed stream data' },
        { name: 'DONKI WSA+EnlilSimulation', value: 'donkiWsa', description: 'Retrieve DONKI WSA+EnlilSimulation data' },
        { name: 'DONKI Notifications', value: 'donkiNotifications', description: 'Retrieve DONKI notifications data' },
        { name: 'Earth Imagery', value: 'earthImagery', description: 'Retrieve Earth imagery' },
        { name: 'Earth Assets', value: 'earthAssets', description: 'Retrieve Earth assets' }
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
        { name: 'Get', value: 'get', description: 'Get data from the selected resource' },
        { name: 'Get Today', value: 'getToday', description: 'Get today\'s astronomy picture' },
        { name: 'Get Random', value: 'getRandom', description: 'Get random astronomy picture' },
        { name: 'Browse', value: 'browse', description: 'Browse asteroid dataset' },
        { name: 'Search', value: 'search', description: 'Search for data' }
      ]
    },
    {
      name: 'date',
      displayName: 'Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Date in YYYY-MM-DD format. Default is today.'
    },
    {
      name: 'startDate',
      displayName: 'Start Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Start date in YYYY-MM-DD format for date range queries'
    },
    {
      name: 'endDate',
      displayName: 'End Date',
      type: 'string',
      required: false,
      default: '',
      description: 'End date in YYYY-MM-DD format for date range queries'
    },
    {
      name: 'asteroidId',
      displayName: 'Asteroid ID',
      type: 'string',
      required: false,
      default: '',
      description: 'NASA SPK-ID of the asteroid to look up'
    },
    {
      name: 'count',
      displayName: 'Count',
      type: 'number',
      required: false,
      default: 5,
      description: 'Number of random images to return (for random APOD)'
    },
    {
      name: 'thumbs',
      displayName: 'Include Thumbnails',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Return thumbnail URLs for videos'
    },
    {
      name: 'hd',
      displayName: 'High Definition',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Retrieve high definition image URLs'
    },
    {
      name: 'latitude',
      displayName: 'Latitude',
      type: 'number',
      required: false,
      default: 0,
      description: 'Latitude coordinate for Earth imagery'
    },
    {
      name: 'longitude',
      displayName: 'Longitude',
      type: 'number',
      required: false,
      default: 0,
      description: 'Longitude coordinate for Earth imagery'
    },
    {
      name: 'dim',
      displayName: 'Dimension',
      type: 'number',
      required: false,
      default: 0.5,
      description: 'Width and height of image in degrees'
    },
    {
      name: 'earthDate',
      displayName: 'Earth Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Date of image for Earth imagery (YYYY-MM-DD)'
    },
    {
      name: 'catalog',
      displayName: 'Catalog',
      type: 'options',
      required: false,
      default: 'earth_search',
      description: 'Catalog to search for Earth assets',
      options: [
        { name: 'Earth Search', value: 'earth_search', description: 'Earth search catalog' },
        { name: 'Landsat 8', value: 'landsat_8', description: 'Landsat 8 catalog' }
      ]
    },
    {
      name: 'bbox',
      displayName: 'Bounding Box',
      type: 'string',
      required: false,
      default: '',
      description: 'Bounding box coordinates (comma-separated: lon1,lat1,lon2,lat2)'
    },
    {
      name: 'datetime',
      displayName: 'DateTime',
      type: 'string',
      required: false,
      default: '',
      description: 'DateTime range in ISO format'
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
      name: 'includeValues',
      displayName: 'Include Values',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Include additional metadata values'
    },
    {
      name: 'mostAccurateOnly',
      displayName: 'Most Accurate Only',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Return only the most accurate location data'
    },
    {
      name: 'complete',
      displayName: 'Complete',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Return complete dataset information'
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
      description: 'The processed NASA data'
    }
  ],
  credentials: ['nasaApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Get Today\'s Astronomy Picture',
      description: 'Get the astronomy picture of the day',
      workflow: {
        nodes: [
          {
            name: 'NASA',
            type: 'n8n-nodes-base.nasa',
            parameters: {
              resource: 'astronomy',
              operation: 'getToday',
              hd: true,
              thumbs: false
            }
          }
        ]
      }
    },
    {
      name: 'Get Asteroid Data',
      description: 'Get asteroid data for a specific date range',
      workflow: {
        nodes: [
          {
            name: 'NASA',
            type: 'n8n-nodes-base.nasa',
            parameters: {
              resource: 'asteroidFeed',
              operation: 'get',
              startDate: '2024-01-01',
              endDate: '2024-01-07'
            }
          }
        ]
      }
    },
    {
      name: 'Lookup Specific Asteroid',
      description: 'Look up a specific asteroid by NASA SPK-ID',
      workflow: {
        nodes: [
          {
            name: 'NASA',
            type: 'n8n-nodes-base.nasa',
            parameters: {
              resource: 'asteroidLookup',
              operation: 'get',
              asteroidId: '3542519'
            }
          }
        ]
      }
    },
    {
      name: 'Get Solar Flare Data',
      description: 'Retrieve DONKI solar flare data for a date range',
      workflow: {
        nodes: [
          {
            name: 'NASA',
            type: 'n8n-nodes-base.nasa',
            parameters: {
              resource: 'donkiFlr',
              operation: 'get',
              startDate: '2024-01-01',
              endDate: '2024-01-31'
            }
          }
        ]
      }
    },
    {
      name: 'Get Earth Imagery',
      description: 'Get satellite imagery of a specific location on Earth',
      workflow: {
        nodes: [
          {
            name: 'NASA',
            type: 'n8n-nodes-base.nasa',
            parameters: {
              resource: 'earthImagery',
              operation: 'get',
              latitude: 40.7128,
              longitude: -74.0060,
              dim: 0.5,
              earthDate: '2024-01-01'
            }
          }
        ]
      }
    },
    {
      name: 'Search Earth Assets',
      description: 'Search for Earth satellite data assets',
      workflow: {
        nodes: [
          {
            name: 'NASA',
            type: 'n8n-nodes-base.nasa',
            parameters: {
              resource: 'earthAssets',
              operation: 'search',
              latitude: 40.7128,
              longitude: -74.0060,
              catalog: 'earth_search',
              limit: 10
            }
          }
        ]
      }
    },
    {
      name: 'Get Random Astronomy Pictures',
      description: 'Get multiple random astronomy pictures of the day',
      workflow: {
        nodes: [
          {
            name: 'NASA',
            type: 'n8n-nodes-base.nasa',
            parameters: {
              resource: 'astronomy',
              operation: 'getRandom',
              count: 5,
              hd: true,
              thumbs: true
            }
          }
        ]
      }
    },
    {
      name: 'Get Space Weather Notifications',
      description: 'Retrieve DONKI space weather notifications',
      workflow: {
        nodes: [
          {
            name: 'NASA',
            type: 'n8n-nodes-base.nasa',
            parameters: {
              resource: 'donkiNotifications',
              operation: 'get',
              startDate: '2024-01-01',
              endDate: '2024-01-31'
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the NASA node
export const nasaActions = [
  // Astronomy Picture of the Day
  'get_astronomy_picture_today',
  'get_astronomy_picture_date',
  'get_random_astronomy_pictures',
  // Asteroid operations
  'get_asteroid_feed',
  'lookup_asteroid_by_id',
  'browse_asteroid_dataset',
  // DONKI space weather operations
  'get_donki_coronal_mass_ejection',
  'get_donki_interplanetary_shock',
  'get_donki_solar_flare',
  'get_donki_solar_energetic_particle',
  'get_donki_magnetopause_crossing',
  'get_donki_radiation_belt_enhancement',
  'get_donki_high_speed_stream',
  'get_donki_wsa_enlil_simulation',
  'get_donki_notifications',
  // Earth observation operations
  'get_earth_imagery',
  'search_earth_assets'
];

// Export NASA data categories
export const nasaCategories = [
  'astronomy_picture_of_the_day',
  'asteroid_data',
  'space_weather_donki',
  'earth_observation',
  'mars_rover_photos',
  'exoplanet_data',
  'earth_imagery',
  'earth_assets'
];