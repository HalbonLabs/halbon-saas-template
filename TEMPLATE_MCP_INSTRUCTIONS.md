# MCP Server Setup Instructions

## Template VS Code MCP Server Configuration

### Setup Steps:
1. Copy the JSON content from `TEMPLATE_MCP_SETTINGS.json`
2. Add to `.vscode/settings.json` in your project root
3. Replace `"YOUR_PROJECT_ROOT_PATH"` with your actual project path
4. Example paths:
   - Windows: `"C:\\Projects\\my-app"`
   - macOS/Linux: `"/Users/username/projects/my-app"`

### Servers Included:
- **filesystem**: File operations and project navigation
- **sequential-thinking**: Advanced reasoning and problem-solving  
- **browser**: Web automation and testing
- **code-runner**: Execute code snippets and commands

### Directory Structure:
```
your-project/
├── .vscode/
│   └── settings.json    # Add MCP config here
└── ... (your project files)
```

### Example Complete .vscode/settings.json:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem", 
        "/path/to/your/project"
      ]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "browser": {
      "command": "npx", 
      "args": ["-y", "@agent-infra/mcp-server-browser"]
    },
    "code-runner": {
      "command": "npx",
      "args": ["-y", "mcp-server-code-runner"]
    }
  }
}
```