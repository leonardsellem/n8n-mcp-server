export const qrCodeNode = {
  "name": "QR Code Functionality",
  "category": "Utility",
  "type": "utility",
  "displayName": "QR Code Operations",
  "description": "QR code functionality in n8n through third-party service nodes",
  "version": 1,
  "subtitle": "={{$parameter[\"operation\"] + \": \" + $parameter[\"resource\"]}}",
  "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMTciIHk9IjMiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9ImJsYWNrIi8+CjxyZWN0IHg9IjMiIHk9IjE3IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJibGFjayIvPgo8cmVjdCB4PSI5IiB5PSI5IiB3aWR0aD0iNiIgaGVpZ2h0PSI2IiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K",
  "defaults": {
    "name": "QR Code",
    "color": "#1A82e2"
  },
  "inputs": [
    "main"
  ],
  "outputs": [
    "main"
  ],
  "credentials": [
    {
      "name": "uProcApi",
      "required": false,
      "displayName": "uProc API",
      "description": "Required for uProc QR code operations"
    },
    {
      "name": "oneSimpleApi",
      "required": false,
      "displayName": "One Simple API",
      "description": "Required for One Simple API QR code operations"
    }
  ],
  "requestDefaults": {
    "baseURL": "https://api.uProc.io/v1",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  },
  "properties": [
    {
      "displayName": "Service Provider",
      "name": "provider",
      "type": "options",
      "noDataExpression": true,
      "options": [
        {
          "name": "uProc",
          "value": "uproc",
          "description": "Use uProc service for QR code operations"
        },
        {
          "name": "One Simple API",
          "value": "onesimpleapi",
          "description": "Use One Simple API service for QR code operations"
        }
      ],
      "default": "uproc",
      "description": "Choose the service provider for QR code operations"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "noDataExpression": true,
      "displayOptions": {
        "show": {
          "provider": [
            "uproc"
          ]
        }
      },
      "options": [
        {
          "name": "Decode QR Code",
          "value": "decode",
          "description": "Get QR code decoded content by an image URL",
          "action": "Decode QR code from image"
        },
        {
          "name": "Generate QR Code",
          "value": "generate",
          "description": "Get QR code encoded by a text",
          "action": "Generate QR code from text"
        }
      ],
      "default": "generate",
      "description": "Choose the QR code operation to perform"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "noDataExpression": true,
      "displayOptions": {
        "show": {
          "provider": [
            "onesimpleapi"
          ]
        }
      },
      "options": [
        {
          "name": "Generate QR Code",
          "value": "generate",
          "description": "Generate a QR Code",
          "action": "Generate QR code from text"
        }
      ],
      "default": "generate",
      "description": "QR code operation available in One Simple API"
    },
    {
      "displayName": "Text to Encode",
      "name": "text",
      "type": "string",
      "displayOptions": {
        "show": {
          "operation": [
            "generate"
          ]
        }
      },
      "default": "",
      "placeholder": "Enter text to encode in QR code",
      "description": "The text content to encode into a QR code"
    },
    {
      "displayName": "Image URL",
      "name": "imageUrl",
      "type": "string",
      "displayOptions": {
        "show": {
          "operation": [
            "decode"
          ],
          "provider": [
            "uproc"
          ]
        }
      },
      "default": "",
      "placeholder": "https://example.com/qr-image.png",
      "description": "URL of the image containing the QR code to decode"
    },
    {
      "displayName": "Size (pixels)",
      "name": "size",
      "type": "number",
      "displayOptions": {
        "show": {
          "operation": [
            "generate"
          ],
          "provider": [
            "onesimpleapi"
          ]
        }
      },
      "default": 200,
      "typeOptions": {
        "minValue": 50,
        "maxValue": 1000
      },
      "description": "Size of the generated QR code in pixels"
    },
    {
      "displayName": "Format",
      "name": "format",
      "type": "options",
      "displayOptions": {
        "show": {
          "operation": [
            "generate"
          ],
          "provider": [
            "onesimpleapi"
          ]
        }
      },
      "options": [
        {
          "name": "PNG",
          "value": "png"
        },
        {
          "name": "SVG",
          "value": "svg"
        }
      ],
      "default": "png",
      "description": "Output format for the generated QR code"
    }
  ],
  "supportedMethods": [
    "GET",
    "POST"
  ],
  "documentation": {
    "description": "QR code functionality in n8n is available through third-party service nodes rather than a dedicated QR Code node. Two main options are available:",
    "examples": [
      {
        "title": "Generate QR Code with uProc",
        "description": "Create a QR code containing text using the uProc service",
        "workflow": {
          "nodes": [
            {
              "name": "Generate QR Code",
              "type": "n8n-nodes-base.uproc",
              "parameters": {
                "operation": "image",
                "imageOperation": "Get QR code encoded by a text",
                "text": "Hello World!"
              }
            }
          ]
        }
      },
      {
        "title": "Decode QR Code with uProc",
        "description": "Extract text content from a QR code image",
        "workflow": {
          "nodes": [
            {
              "name": "Decode QR Code",
              "type": "n8n-nodes-base.uproc",
              "parameters": {
                "operation": "image",
                "imageOperation": "Get QR code decoded content by an image URL",
                "imageUrl": "https://example.com/qr-code.png"
              }
            }
          ]
        }
      },
      {
        "title": "Generate QR Code with One Simple API",
        "description": "Create a QR code using One Simple API service",
        "workflow": {
          "nodes": [
            {
              "name": "Generate QR Code",
              "type": "n8n-nodes-base.onesimpleapi",
              "parameters": {
                "operation": "utility",
                "utilityOperation": "Generate a QR Code",
                "text": "https://example.com",
                "size": 300,
                "format": "png"
              }
            }
          ]
        }
      }
    ],
    "useCases": [
      "Generate QR codes for URLs, contact information, or any text content",
      "Decode QR codes from images to extract embedded data",
      "Create QR codes for mobile app deep links",
      "Generate QR codes for event tickets or coupons",
      "Process QR codes from uploaded images or documents",
      "Automate QR code generation for batch operations"
    ],
    "bestPractices": [
      "Use uProc for both encoding and decoding QR codes",
      "Use One Simple API for simple QR code generation",
      "Test QR codes with different readers to ensure compatibility",
      "Keep QR code content concise for better readability",
      "Consider the display size when generating QR codes",
      "Use error correction levels appropriate for your use case"
    ],
    "limitations": [
      "No dedicated QR Code node in n8n core",
      "Requires third-party service credentials",
      "Limited to the features provided by the respective services",
      "Network dependency for processing",
      "May have rate limits based on service plans"
    ]
  },
  "providers": {
    "uProc": {
      "name": "uProc",
      "description": "Comprehensive data processing service with QR code capabilities",
      "operations": {
        "decode": "Get QR code decoded content by an image URL",
        "generate": "Get QR code encoded by a text"
      },
      "nodeType": "n8n-nodes-base.uproc",
      "category": "Image",
      "credentialsRequired": true,
      "documentation": "https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.uproc/"
    },
    "oneSimpleAPI": {
      "name": "One Simple API",
      "description": "Simple API service for various utilities including QR code generation",
      "operations": {
        "generate": "Generate a QR Code"
      },
      "nodeType": "n8n-nodes-base.onesimpleapi",
      "category": "Utility",
      "credentialsRequired": true,
      "documentation": "https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.onesimpleapi/"
    }
  },
  "relatedNodes": [
    "n8n-nodes-base.uproc",
    "n8n-nodes-base.onesimpleapi",
    "n8n-nodes-base.httprequest",
    "n8n-nodes-base.editimage"
  ],
  "tags": [
    "QR Code",
    "Barcode",
    "Image Processing",
    "Data Encoding",
    "Mobile",
    "Utility",
    "Third-party Service"
  ]
};

export default qrCodeNode;