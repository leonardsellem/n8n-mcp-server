# n8n-MCP Documentation

Welcome to the n8n-MCP documentation. This directory contains comprehensive guides for installation, configuration, and troubleshooting.

## 📚 Documentation Index

### Getting Started
- **[Installation Guide](./INSTALLATION.md)** - Comprehensive installation guide covering all methods
- **[Claude Desktop Setup](./README_CLAUDE_SETUP.md)** - Step-by-step guide for Claude Desktop configuration
- **[Quick Start Tutorial](../README.md)** - Basic overview and quick start instructions

### Deployment
- **[HTTP Deployment Guide](./HTTP_DEPLOYMENT.md)** - Deploy n8n-MCP as an HTTP server for remote access
- **[Docker Deployment](./DOCKER_README.md)** - Complete Docker deployment and configuration guide
- **[Release Guide](./RELEASE_GUIDE.md)** - How to create releases and manage Docker tags

### Reference
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Solutions for common issues and errors
- **[HTTP Server Fix Documentation](./HTTP_SERVER_FINAL_FIX.md)** - Technical details of v2.3.2 HTTP server fixes
- **[Docker Optimization Guide](./DOCKER_OPTIMIZATION_GUIDE.md)** - Reference for optimized Docker builds (~150MB)
- **[Changelog](./CHANGELOG.md)** - Version history and release notes

## 🚀 Quick Links

### For Users
- [Install n8n-MCP](./INSTALLATION.md)
- [Configure Claude Desktop](./README_CLAUDE_SETUP.md)
- [Deploy with Docker](./DOCKER_README.md)
- [Troubleshoot Issues](./TROUBLESHOOTING.md)

### For Developers
- [HTTP Server Architecture](./HTTP_SERVER_FINAL_FIX.md)
- [Docker Build Optimization](./DOCKER_OPTIMIZATION_GUIDE.md)
- [Release Process](./RELEASE_GUIDE.md)

## 📋 Environment Variables

Key configuration options:

| Variable | Description | Default |
|----------|-------------|---------|
| `MCP_MODE` | Server mode: `stdio` or `http` | `stdio` |
| `USE_FIXED_HTTP` | Use fixed HTTP implementation (v2.3.2+) | `true` |
| `AUTH_TOKEN` | Authentication token for HTTP mode | Required |
| `PORT` | HTTP server port | `3000` |
| `LOG_LEVEL` | Logging verbosity | `info` |

See [Installation Guide](./INSTALLATION.md#environment-configuration) for complete list.

## 🆘 Getting Help

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review [HTTP Server Fix Documentation](./HTTP_SERVER_FINAL_FIX.md) for v2.3.2 issues
3. Open an issue on [GitHub](https://github.com/czlonkowski/n8n-mcp/issues)

## 📝 License

This project uses the Sustainable Use License. See [LICENSE](../LICENSE) for details.