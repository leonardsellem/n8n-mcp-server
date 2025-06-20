export const netscalerAdcNode = {
  "displayName": "Netscaler ADC",
  "name": "netscalerAdc",
  "icon": "file:netscaleradc.svg",
  "group": ["transform"],
  "version": 1,
  "subtitle": '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
  "description": "Automate work in Netscaler ADC and integrate with other applications",
  "defaults": {
    "name": "Netscaler ADC"
  },
  "inputs": ["main"],
  "outputs": ["main"],
  "credentials": [
    {
      "name": "netscalerAdcApi",
      "required": true
    }
  ],
  "requestDefaults": {
    "baseURL": "={{$credentials.url}}",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    "auth": {
      "username": "={{$credentials.username}}",
      "password": "={{$credentials.password}}"
    }
  },
  "properties": [
    {
      "displayName": "Resource",
      "name": "resource",
      "type": "options",
      "noDataExpression": true,
      "options": [
        {
          "name": "Certificate",
          "value": "certificate"
        },
        {
          "name": "File",
          "value": "file"
        },
        {
          "name": "Load Balancer",
          "value": "loadBalancer"
        },
        {
          "name": "Server",
          "value": "server"
        },
        {
          "name": "Service",
          "value": "service"
        },
        {
          "name": "Virtual Server",
          "value": "virtualServer"
        }
      ],
      "default": "certificate",
      "required": true
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "noDataExpression": true,
      "displayOptions": {
        "show": {
          "resource": ["certificate"]
        }
      },
      "options": [
        {
          "name": "Create",
          "value": "create",
          "description": "Create a new certificate",
          "action": "Create a certificate"
        },
        {
          "name": "Delete",
          "value": "delete",
          "description": "Delete a certificate",
          "action": "Delete a certificate"
        },
        {
          "name": "Get",
          "value": "get",
          "description": "Get certificate details",
          "action": "Get a certificate"
        },
        {
          "name": "Install",
          "value": "install",
          "description": "Install a certificate",
          "action": "Install a certificate"
        },
        {
          "name": "List",
          "value": "list",
          "description": "List all certificates",
          "action": "List certificates"
        }
      ],
      "default": "list"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "noDataExpression": true,
      "displayOptions": {
        "show": {
          "resource": ["file"]
        }
      },
      "options": [
        {
          "name": "Delete",
          "value": "delete",
          "description": "Delete a file",
          "action": "Delete a file"
        },
        {
          "name": "Download",
          "value": "download",
          "description": "Download a file",
          "action": "Download a file"
        },
        {
          "name": "List",
          "value": "list",
          "description": "List all files",
          "action": "List files"
        },
        {
          "name": "Upload",
          "value": "upload",
          "description": "Upload a file",
          "action": "Upload a file"
        }
      ],
      "default": "list"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "noDataExpression": true,
      "displayOptions": {
        "show": {
          "resource": ["loadBalancer"]
        }
      },
      "options": [
        {
          "name": "Create",
          "value": "create",
          "description": "Create a load balancer",
          "action": "Create a load balancer"
        },
        {
          "name": "Delete",
          "value": "delete",
          "description": "Delete a load balancer",
          "action": "Delete a load balancer"
        },
        {
          "name": "Get",
          "value": "get",
          "description": "Get load balancer details",
          "action": "Get a load balancer"
        },
        {
          "name": "List",
          "value": "list",
          "description": "List all load balancers",
          "action": "List load balancers"
        },
        {
          "name": "Update",
          "value": "update",
          "description": "Update a load balancer",
          "action": "Update a load balancer"
        }
      ],
      "default": "list"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "noDataExpression": true,
      "displayOptions": {
        "show": {
          "resource": ["server"]
        }
      },
      "options": [
        {
          "name": "Add",
          "value": "add",
          "description": "Add a server",
          "action": "Add a server"
        },
        {
          "name": "Delete",
          "value": "delete",
          "description": "Delete a server",
          "action": "Delete a server"
        },
        {
          "name": "Disable",
          "value": "disable",
          "description": "Disable a server",
          "action": "Disable a server"
        },
        {
          "name": "Enable",
          "value": "enable",
          "description": "Enable a server",
          "action": "Enable a server"
        },
        {
          "name": "Get",
          "value": "get",
          "description": "Get server details",
          "action": "Get a server"
        },
        {
          "name": "List",
          "value": "list",
          "description": "List all servers",
          "action": "List servers"
        }
      ],
      "default": "list"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "noDataExpression": true,
      "displayOptions": {
        "show": {
          "resource": ["service"]
        }
      },
      "options": [
        {
          "name": "Add",
          "value": "add",
          "description": "Add a service",
          "action": "Add a service"
        },
        {
          "name": "Delete",
          "value": "delete",
          "description": "Delete a service",
          "action": "Delete a service"
        },
        {
          "name": "Disable",
          "value": "disable",
          "description": "Disable a service",
          "action": "Disable a service"
        },
        {
          "name": "Enable",
          "value": "enable",
          "description": "Enable a service",
          "action": "Enable a service"
        },
        {
          "name": "Get",
          "value": "get",
          "description": "Get service details",
          "action": "Get a service"
        },
        {
          "name": "List",
          "value": "list",
          "description": "List all services",
          "action": "List services"
        }
      ],
      "default": "list"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "noDataExpression": true,
      "displayOptions": {
        "show": {
          "resource": ["virtualServer"]
        }
      },
      "options": [
        {
          "name": "Add",
          "value": "add",
          "description": "Add a virtual server",
          "action": "Add a virtual server"
        },
        {
          "name": "Delete",
          "value": "delete",
          "description": "Delete a virtual server",
          "action": "Delete a virtual server"
        },
        {
          "name": "Disable",
          "value": "disable",
          "description": "Disable a virtual server",
          "action": "Disable a virtual server"
        },
        {
          "name": "Enable",
          "value": "enable",
          "description": "Enable a virtual server",
          "action": "Enable a virtual server"
        },
        {
          "name": "Get",
          "value": "get",
          "description": "Get virtual server details",
          "action": "Get a virtual server"
        },
        {
          "name": "List",
          "value": "list",
          "description": "List all virtual servers",
          "action": "List virtual servers"
        }
      ],
      "default": "list"
    },
    {
      "displayName": "Certificate Name",
      "name": "certificateName",
      "type": "string",
      "displayOptions": {
        "show": {
          "resource": ["certificate"],
          "operation": ["create", "delete", "get", "install"]
        }
      },
      "default": "",
      "required": true,
      "description": "Name of the certificate"
    },
    {
      "displayName": "File Name",
      "name": "fileName",
      "type": "string",
      "displayOptions": {
        "show": {
          "resource": ["file"],
          "operation": ["delete", "download"]
        }
      },
      "default": "",
      "required": true,
      "description": "Name of the file"
    },
    {
      "displayName": "Server Name",
      "name": "serverName",
      "type": "string",
      "displayOptions": {
        "show": {
          "resource": ["server"],
          "operation": ["add", "delete", "disable", "enable", "get"]
        }
      },
      "default": "",
      "required": true,
      "description": "Name of the server"
    },
    {
      "displayName": "Server IP",
      "name": "serverIp",
      "type": "string",
      "displayOptions": {
        "show": {
          "resource": ["server"],
          "operation": ["add"]
        }
      },
      "default": "",
      "required": true,
      "description": "IP address of the server"
    },
    {
      "displayName": "Service Name",
      "name": "serviceName",
      "type": "string",
      "displayOptions": {
        "show": {
          "resource": ["service"],
          "operation": ["add", "delete", "disable", "enable", "get"]
        }
      },
      "default": "",
      "required": true,
      "description": "Name of the service"
    },
    {
      "displayName": "Service Type",
      "name": "serviceType",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": ["service"],
          "operation": ["add"]
        }
      },
      "options": [
        {
          "name": "HTTP",
          "value": "HTTP"
        },
        {
          "name": "HTTPS",
          "value": "HTTPS"
        },
        {
          "name": "TCP",
          "value": "TCP"
        },
        {
          "name": "UDP",
          "value": "UDP"
        },
        {
          "name": "SSL",
          "value": "SSL"
        }
      ],
      "default": "HTTP",
      "required": true,
      "description": "Type of the service"
    },
    {
      "displayName": "Service Port",
      "name": "servicePort",
      "type": "number",
      "displayOptions": {
        "show": {
          "resource": ["service"],
          "operation": ["add"]
        }
      },
      "default": 80,
      "required": true,
      "description": "Port number of the service"
    },
    {
      "displayName": "Virtual Server Name",
      "name": "virtualServerName",
      "type": "string",
      "displayOptions": {
        "show": {
          "resource": ["virtualServer"],
          "operation": ["add", "delete", "disable", "enable", "get"]
        }
      },
      "default": "",
      "required": true,
      "description": "Name of the virtual server"
    },
    {
      "displayName": "Virtual Server IP",
      "name": "virtualServerIp",
      "type": "string",
      "displayOptions": {
        "show": {
          "resource": ["virtualServer"],
          "operation": ["add"]
        }
      },
      "default": "",
      "required": true,
      "description": "IP address of the virtual server"
    },
    {
      "displayName": "Virtual Server Port",
      "name": "virtualServerPort",
      "type": "number",
      "displayOptions": {
        "show": {
          "resource": ["virtualServer"],
          "operation": ["add"]
        }
      },
      "default": 80,
      "required": true,
      "description": "Port number of the virtual server"
    },
    {
      "displayName": "Protocol",
      "name": "protocol",
      "type": "options",
      "displayOptions": {
        "show": {
          "resource": ["virtualServer"],
          "operation": ["add"]
        }
      },
      "options": [
        {
          "name": "HTTP",
          "value": "HTTP"
        },
        {
          "name": "HTTPS",
          "value": "HTTPS"
        },
        {
          "name": "TCP",
          "value": "TCP"
        },
        {
          "name": "UDP",
          "value": "UDP"
        },
        {
          "name": "SSL",
          "value": "SSL"
        }
      ],
      "default": "HTTP",
      "required": true,
      "description": "Protocol for the virtual server"
    },
    {
      "displayName": "Additional Fields",
      "name": "additionalFields",
      "type": "collection",
      "placeholder": "Add Field",
      "default": {},
      "options": [
        {
          "displayName": "Certificate Key",
          "name": "certificateKey",
          "type": "string",
          "default": "",
          "description": "Certificate key content"
        },
        {
          "displayName": "Certificate Content",
          "name": "certificateContent",
          "type": "string",
          "default": "",
          "description": "Certificate content"
        },
        {
          "displayName": "File Content",
          "name": "fileContent",
          "type": "string",
          "default": "",
          "description": "Content of the file to upload"
        },
        {
          "displayName": "File Location",
          "name": "fileLocation",
          "type": "string",
          "default": "",
          "description": "Location where to store the file"
        },
        {
          "displayName": "Description",
          "name": "description",
          "type": "string",
          "default": "",
          "description": "Description of the resource"
        },
        {
          "displayName": "State",
          "name": "state",
          "type": "options",
          "options": [
            {
              "name": "Enabled",
              "value": "ENABLED"
            },
            {
              "name": "Disabled",
              "value": "DISABLED"
            }
          ],
          "default": "ENABLED",
          "description": "State of the resource"
        },
        {
          "displayName": "Load Balancing Method",
          "name": "lbMethod",
          "type": "options",
          "options": [
            {
              "name": "Round Robin",
              "value": "ROUNDROBIN"
            },
            {
              "name": "Least Connection",
              "value": "LEASTCONNECTION"
            },
            {
              "name": "Least Response Time",
              "value": "LEASTRESPONSETIME"
            },
            {
              "name": "Source IP Hash",
              "value": "SOURCEIPHASH"
            }
          ],
          "default": "ROUNDROBIN",
          "description": "Load balancing method"
        }
      ]
    }
  ],
  "routing": {
    "request": {
      "method": "={{ $parameter.operation === 'list' || $parameter.operation === 'get' ? 'GET' : $parameter.operation === 'delete' || $parameter.operation === 'disable' ? 'DELETE' : 'POST' }}",
      "url": "=/nitro/v1/config/{{ $parameter.resource }}{{ $parameter.operation === 'get' ? '/' + $parameter[$parameter.resource + 'Name'] : '' }}{{ $parameter.operation === 'list' ? '' : '' }}",
      "body": {
        "{{ $parameter.resource }}": "={{ \n  $parameter.operation === 'list' || $parameter.operation === 'get' || $parameter.operation === 'delete' || $parameter.operation === 'disable' || $parameter.operation === 'enable' ? {} : \n  $parameter.resource === 'certificate' ? {\n    name: $parameter.certificateName,\n    ...$parameter.additionalFields\n  } :\n  $parameter.resource === 'file' ? {\n    filename: $parameter.fileName,\n    ...$parameter.additionalFields\n  } :\n  $parameter.resource === 'server' ? {\n    name: $parameter.serverName,\n    ipaddress: $parameter.serverIp,\n    ...$parameter.additionalFields\n  } :\n  $parameter.resource === 'service' ? {\n    name: $parameter.serviceName,\n    servicetype: $parameter.serviceType,\n    port: $parameter.servicePort,\n    ...$parameter.additionalFields\n  } :\n  $parameter.resource === 'virtualServer' ? {\n    name: $parameter.virtualServerName,\n    ipv46: $parameter.virtualServerIp,\n    port: $parameter.virtualServerPort,\n    servicetype: $parameter.protocol,\n    ...$parameter.additionalFields\n  } : {}\n}}"
      }
    },
    "output": {
      "postReceive": [
        {
          "type": "rootProperty",
          "properties": {
            "property": "data"
          }
        }
      ]
    }
  }
};