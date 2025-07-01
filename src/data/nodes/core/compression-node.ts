/**
 * # Compression
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: File Processing
 * 
 * ## Description
 * 
 * Compress and decompress files and data using various compression algorithms. This node enables
 * efficient file size reduction, archiving, and data packaging for storage optimization, faster
 * data transfer, and streamlined backup workflows.
 * 
 * ## Key Features
 * 
 * - **Multiple Compression Formats**: ZIP, GZIP, TAR, 7ZIP, BZIP2, and more
 * - **Batch Processing**: Compress/decompress multiple files simultaneously
 * - **Archive Creation**: Create archives with directory structures
 * - **Password Protection**: Encrypt archives with password security
 * - **Compression Levels**: Adjustable compression ratios (speed vs. size)
 * - **File Filtering**: Include/exclude files based on patterns
 * - **Metadata Preservation**: Maintain file timestamps and permissions
 * - **Progress Tracking**: Monitor compression/decompression progress
 * - **Memory Optimization**: Efficient handling of large files
 * - **Format Detection**: Automatic detection of compressed file formats
 * - **Partial Extraction**: Extract specific files from archives
 * - **Content Preview**: List archive contents without extraction
 * 
 * ## Supported Formats
 * 
 * ### Archive Formats
 * - **ZIP**: Universal compression format with wide compatibility
 * - **TAR**: Unix archive format, often combined with compression
 * - **7ZIP**: High compression ratio with advanced features
 * - **RAR**: Popular compression format (extraction only)
 * - **ISO**: Disc image format for CD/DVD archives
 * 
 * ### Compression Algorithms
 * - **GZIP**: Fast compression for single files
 * - **BZIP2**: Better compression ratio than GZIP
 * - **LZMA**: High compression ratio with good speed
 * - **LZ4**: Ultra-fast compression with moderate ratios
 * - **ZSTD**: Modern algorithm balancing speed and compression
 * 
 * ## Operations
 * 
 * ### Compression Operations
 * - **Compress Files**: Create compressed archives from input files
 * - **Create Archive**: Bundle multiple files into a single archive
 * - **Stream Compression**: Compress data streams without temporary files
 * - **Incremental Compression**: Add files to existing archives
 * - **Format Conversion**: Convert between different archive formats
 * 
 * ### Decompression Operations
 * - **Extract All**: Extract all files from compressed archives
 * - **Selective Extraction**: Extract specific files or directories
 * - **List Contents**: View archive contents without extraction
 * - **Verify Integrity**: Check archive integrity and validate checksums
 * - **Preview Files**: Quick preview of compressed file contents
 * 
 * ## Advanced Features
 * 
 * ### Compression Settings
 * - **Compression Level**: Balance between speed and file size reduction
 * - **Block Size**: Optimize for memory usage and performance
 * - **Dictionary Size**: Configure compression dictionary for better ratios
 * - **Threading**: Multi-threaded compression for faster processing
 * - **Solid Archives**: Compress similar files together for better ratios
 * 
 * ### Security Features
 * - **Password Protection**: Encrypt archives with AES encryption
 * - **Digital Signatures**: Sign archives for authenticity verification
 * - **Access Control**: Set file permissions and access restrictions
 * - **Secure Deletion**: Securely remove temporary files during processing
 * 
 * ### File Management
 * - **Path Preservation**: Maintain directory structures in archives
 * - **Timestamp Retention**: Preserve original file modification times
 * - **Attribute Handling**: Maintain file attributes and permissions
 * - **Symbolic Links**: Handle symbolic links and shortcuts
 * - **Large File Support**: Process files larger than 4GB
 * 
 * ## Use Cases
 * 
 * - **Backup Solutions**: Create compressed backups for storage efficiency
 * - **Data Transfer**: Reduce bandwidth usage for file transfers
 * - **Log Archiving**: Compress historical log files for long-term storage
 * - **Software Distribution**: Package applications and updates
 * - **Email Attachments**: Compress files before sending via email
 * - **Cloud Storage**: Optimize storage costs with compressed uploads
 * - **Database Exports**: Compress database dumps and exports
 * - **Media Processing**: Compress images, videos, and documents
 * - **Documentation**: Archive project documentation and resources
 * - **Version Control**: Create compressed releases and distributions
 * - **System Administration**: Automate file compression and archiving
 * - **Data Pipeline**: Compress data between processing stages
 */

import { NodeTypeInfo } from '../../node-types.js';

export const compressionNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.compression',
  displayName: 'Compression',
  description: 'Compress and decompress files using various compression algorithms and archive formats',
  category: 'Core Nodes',
  subcategory: 'File Processing',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'compress',
      description: 'The compression operation to perform',
      options: [
        {
          name: 'Compress',
          value: 'compress',
          description: 'Create compressed archive from input files'
        },
        {
          name: 'Decompress',
          value: 'decompress',
          description: 'Extract files from compressed archive'
        },
        {
          name: 'List Contents',
          value: 'list',
          description: 'List contents of compressed archive'
        },
        {
          name: 'Verify',
          value: 'verify',
          description: 'Verify integrity of compressed archive'
        }
      ]
    },
    {
      name: 'format',
      displayName: 'Compression Format',
      type: 'options',
      required: true,
      default: 'zip',
      description: 'Compression format to use',
      displayOptions: {
        show: {
          operation: ['compress']
        }
      },
      options: [
        {
          name: 'ZIP',
          value: 'zip',
          description: 'ZIP archive format (recommended)'
        },
        {
          name: 'GZIP',
          value: 'gzip',
          description: 'GZIP compression (single file)'
        },
        {
          name: 'TAR',
          value: 'tar',
          description: 'TAR archive without compression'
        },
        {
          name: 'TAR.GZ',
          value: 'tar.gz',
          description: 'TAR archive with GZIP compression'
        },
        {
          name: '7ZIP',
          value: '7z',
          description: '7ZIP format with high compression'
        },
        {
          name: 'BZIP2',
          value: 'bzip2',
          description: 'BZIP2 compression (single file)'
        }
      ]
    },
    {
      name: 'compressionLevel',
      displayName: 'Compression Level',
      type: 'options',
      required: false,
      default: 'balanced',
      description: 'Balance between compression speed and file size',
      displayOptions: {
        show: {
          operation: ['compress']
        }
      },
      options: [
        {
          name: 'Fastest',
          value: 'fastest',
          description: 'Fastest compression, larger file size'
        },
        {
          name: 'Fast',
          value: 'fast',
          description: 'Fast compression with good size reduction'
        },
        {
          name: 'Balanced',
          value: 'balanced',
          description: 'Good balance of speed and compression'
        },
        {
          name: 'Best',
          value: 'best',
          description: 'Maximum compression, slower processing'
        },
        {
          name: 'Ultra',
          value: 'ultra',
          description: 'Ultra compression, very slow (7ZIP only)'
        }
      ]
    },
    {
      name: 'archiveName',
      displayName: 'Archive Name',
      type: 'string',
      required: false,
      default: 'archive',
      description: 'Name for the created archive (without extension)',
      displayOptions: {
        show: {
          operation: ['compress']
        }
      },
      placeholder: 'my-archive'
    },
    {
      name: 'password',
      displayName: 'Password',
      type: 'string',
      required: false,
      default: '',
      description: 'Password for encrypting/decrypting the archive',
    },
    {
      name: 'fileFilters',
      displayName: 'File Filters',
      type: 'collection',
      required: false,
      default: {},
      description: 'Filter files to include or exclude',
      displayOptions: {
        show: {
          operation: ['compress']
        }
      },
      options: [
        {
          name: 'includePatterns',
          displayName: 'Include Patterns',
          type: 'string',
          required: false,
          default: '',
          description: 'File patterns to include (comma-separated)',
          placeholder: '*.txt, *.pdf, docs/**'
        },
        {
          name: 'excludePatterns',
          displayName: 'Exclude Patterns',
          type: 'string',
          required: false,
          default: '',
          description: 'File patterns to exclude (comma-separated)',
          placeholder: '*.tmp, .git/**, node_modules/**'
        },
        {
          name: 'includeDotFiles',
          displayName: 'Include Hidden Files',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Include hidden files (starting with dot)'
        }
      ]
    },
    {
      name: 'extractOptions',
      displayName: 'Extraction Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Options for extracting archives',
      displayOptions: {
        show: {
          operation: ['decompress']
        }
      },
      options: [
        {
          name: 'extractPath',
          displayName: 'Extract to Path',
          type: 'string',
          required: false,
          default: '',
          description: 'Specific path to extract files to',
          placeholder: '/extracted/files/'
        },
        {
          name: 'preservePaths',
          displayName: 'Preserve Directory Structure',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Maintain directory structure when extracting'
        },
        {
          name: 'overwriteFiles',
          displayName: 'Overwrite Existing Files',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Overwrite files if they already exist'
        },
        {
          name: 'selectiveExtraction',
          displayName: 'Extract Specific Files',
          type: 'string',
          required: false,
          default: '',
          description: 'Comma-separated list of files/patterns to extract',
          placeholder: 'config.json, docs/**, *.txt'
        }
      ]
    },
    {
      name: 'advancedOptions',
      displayName: 'Advanced Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Advanced compression and processing options',
      options: [
        {
          name: 'preserveTimestamps',
          displayName: 'Preserve Timestamps',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Maintain original file modification times'
        },
        {
          name: 'preservePermissions',
          displayName: 'Preserve Permissions',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Maintain file permissions and attributes'
        },
        {
          name: 'compressionMemory',
          displayName: 'Memory Usage',
          type: 'options',
          required: false,
          default: 'normal',
          description: 'Memory usage level for compression',
          options: [
            { name: 'Low', value: 'low', description: 'Use less memory' },
            { name: 'Normal', value: 'normal', description: 'Standard memory usage' },
            { name: 'High', value: 'high', description: 'Use more memory for better compression' }
          ]
        },
        {
          name: 'verifyAfterCompression',
          displayName: 'Verify After Compression',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Verify archive integrity after creation'
        }
      ]
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Compressed or extracted files'
    }
  ],

  credentials: [],
  
  version: [1],
  defaults: {
    name: 'Compression'
  },

  aliases: ['compress', 'decompress', 'zip', 'archive', 'extract', 'unzip'],
  
  examples: [
    {
      name: 'Create Backup Archive',
      description: 'Compress files into a password-protected backup archive',
      workflow: {
        nodes: [
          {
            name: 'Compression',
            type: 'n8n-nodes-base.compression',
            parameters: {
              operation: 'compress',
              format: 'zip',
              compressionLevel: 'best',
              archiveName: 'backup-{{$now.format("yyyy-MM-dd")}}',
              password: '{{$vars.backupPassword}}',
              fileFilters: {
                excludePatterns: '*.tmp, .git/**, node_modules/**',
                includeDotFiles: false
              },
              advancedOptions: {
                verifyAfterCompression: true,
                preserveTimestamps: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Extract Archive Contents',
      description: 'Extract specific files from a compressed archive',
      workflow: {
        nodes: [
          {
            name: 'Compression',
            type: 'n8n-nodes-base.compression',
            parameters: {
              operation: 'decompress',
              password: '{{$vars.archivePassword}}',
              extractOptions: {
                extractPath: '/tmp/extracted/',
                preservePaths: true,
                selectiveExtraction: 'config.json, docs/**, *.txt',
                overwriteFiles: false
              }
            }
          }
        ]
      }
    },
    {
      name: 'Log File Archiving',
      description: 'Compress old log files for long-term storage',
      workflow: {
        nodes: [
          {
            name: 'Compression',
            type: 'n8n-nodes-base.compression',
            parameters: {
              operation: 'compress',
              format: 'tar.gz',
              compressionLevel: 'best',
              archiveName: 'logs-{{$now.minus({months: 1}).format("yyyy-MM")}}',
              fileFilters: {
                includePatterns: '*.log, *.log.*',
                excludePatterns: '*.current.log'
              },
              advancedOptions: {
                preserveTimestamps: true,
                compressionMemory: 'high'
              }
            }
          }
        ]
      }
    }
  ]
};

export default compressionNode;
