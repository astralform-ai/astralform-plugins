#!/usr/bin/env node
/**
 * Astralform MCP Server
 *
 * Provides tools for managing Astralform projects from Claude Code.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { requestDeviceCode, pollForToken, getAccessToken } from "./auth.js";

import { whoami, getStats, isAuthenticated } from "./tools/developer.js";
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "./tools/projects.js";
import { listApiKeys, createApiKey, revokeApiKey } from "./tools/api-keys.js";
import {
  listLlmProviders,
  getLlmConfig,
  setLlmConfig,
  deleteLlmConfig,
} from "./tools/llm-config.js";
import {
  listMcpTemplates,
  listMcpServers,
  addMcpServer,
  updateMcpServer,
  toggleMcpServer,
  deleteMcpServer,
} from "./tools/mcp-servers.js";
import {
  listPlatformTools,
  getProjectTools,
  updateProjectTool,
} from "./tools/platform-tools.js";
import { getAnalytics } from "./tools/analytics.js";
import { searchDocs, getDoc } from "./tools/docs.js";

// Create MCP server
const server = new Server(
  {
    name: "astralform",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Define all tools
const TOOLS = [
  // Authentication
  {
    name: "astralform_device_code",
    description:
      "Start OAuth device authorization flow. Returns a user code for the user to enter at the verification URL.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "astralform_device_token",
    description:
      "Poll for device authorization token. Call repeatedly until it returns a token or error.",
    inputSchema: {
      type: "object" as const,
      properties: {
        device_code: {
          type: "string",
          description: "The device code from astralform_device_code",
        },
      },
      required: ["device_code"],
    },
  },
  {
    name: "astralform_whoami",
    description:
      "Get the current authenticated developer's profile. Returns email, name, and admin status.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "astralform_get_stats",
    description:
      "Get aggregate statistics for the developer: projects count, API keys count, conversations count.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },

  // Projects
  {
    name: "astralform_list_projects",
    description:
      "List all Astralform projects for the authenticated developer.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "astralform_get_project",
    description: "Get details for a specific project.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "astralform_create_project",
    description:
      "Create a new Astralform project. IMPORTANT: Returns an encryption_key that is shown ONLY ONCE. User must save it.",
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Name for the project",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "astralform_update_project",
    description: "Update a project's name.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
        name: {
          type: "string",
          description: "New name for the project",
        },
      },
      required: ["project_id", "name"],
    },
  },
  {
    name: "astralform_delete_project",
    description:
      "Delete a project. WARNING: This is irreversible and deletes all project data.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
      },
      required: ["project_id"],
    },
  },

  // API Keys
  {
    name: "astralform_list_api_keys",
    description:
      "List API keys for a project. Only shows key prefix, not the full key.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "astralform_create_api_key",
    description:
      "Create a new API key. IMPORTANT: Returns the full key ONLY ONCE. User must save it.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
        name: {
          type: "string",
          description: "Name for the API key",
        },
        environment: {
          type: "string",
          enum: ["development", "production"],
          description: "Environment (determines sk_test_ or sk_live_ prefix)",
        },
      },
      required: ["project_id", "name"],
    },
  },
  {
    name: "astralform_revoke_api_key",
    description: "Revoke an API key. The key will no longer work.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
        key_id: {
          type: "string",
          description: "The API key UUID",
        },
      },
      required: ["project_id", "key_id"],
    },
  },

  // LLM Configuration
  {
    name: "astralform_list_llm_providers",
    description:
      "List available LLM providers (OpenAI, Anthropic, Groq, Ollama, Platform).",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "astralform_get_llm_config",
    description: "Get the current LLM configuration for a project.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "astralform_set_llm_config",
    description: "Set the LLM provider and model for a project.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
        provider: {
          type: "string",
          description:
            "Provider name (openai, anthropic, groq, ollama, platform)",
        },
        model: {
          type: "string",
          description: "Model name (e.g., gpt-4o, claude-sonnet-4-20250514)",
        },
        api_key: {
          type: "string",
          description:
            "API key for BYOK providers (required for openai, anthropic, groq)",
        },
        base_url: {
          type: "string",
          description: "Custom base URL (for Ollama or custom endpoints)",
        },
      },
      required: ["project_id", "provider", "model"],
    },
  },
  {
    name: "astralform_delete_llm_config",
    description: "Remove LLM configuration from a project.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
      },
      required: ["project_id"],
    },
  },

  // MCP Servers
  {
    name: "astralform_list_mcp_templates",
    description: "List available MCP server templates (GitHub, Slack, etc.).",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "astralform_list_mcp_servers",
    description: "List MCP servers configured for a project.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "astralform_add_mcp_server",
    description: "Add an MCP server to a project.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
        name: {
          type: "string",
          description: "Name for the MCP server",
        },
        template_id: {
          type: "string",
          description:
            "Template ID (use astralform_list_mcp_templates to see options)",
        },
        command: {
          type: "string",
          description: "Custom command (if not using template)",
        },
        args: {
          type: "array",
          items: { type: "string" },
          description: "Command arguments",
        },
        env_vars: {
          type: "object",
          additionalProperties: { type: "string" },
          description: "Environment variables",
        },
      },
      required: ["project_id", "name"],
    },
  },
  {
    name: "astralform_toggle_mcp_server",
    description: "Enable or disable an MCP server.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
        server_id: {
          type: "string",
          description: "The MCP server UUID",
        },
      },
      required: ["project_id", "server_id"],
    },
  },
  {
    name: "astralform_delete_mcp_server",
    description: "Remove an MCP server from a project.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
        server_id: {
          type: "string",
          description: "The MCP server UUID",
        },
      },
      required: ["project_id", "server_id"],
    },
  },

  // Platform Tools
  {
    name: "astralform_list_platform_tools",
    description: "List available platform tools (Tavily search, etc.).",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "astralform_get_project_tools",
    description: "Get platform tool configuration for a project.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
      },
      required: ["project_id"],
    },
  },
  {
    name: "astralform_update_project_tool",
    description: "Enable/disable a platform tool or set custom API key.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
        tool_name: {
          type: "string",
          description: "Tool name (e.g., 'tavily')",
        },
        enabled: {
          type: "boolean",
          description: "Enable or disable the tool",
        },
        api_key: {
          type: "string",
          description: "Custom API key for the tool",
        },
      },
      required: ["project_id", "tool_name"],
    },
  },

  // Analytics
  {
    name: "astralform_get_analytics",
    description:
      "Get usage analytics for a project (conversations, tokens, tool usage).",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_id: {
          type: "string",
          description: "The project UUID",
        },
        start_date: {
          type: "string",
          description: "Start date (ISO 8601)",
        },
        end_date: {
          type: "string",
          description: "End date (ISO 8601)",
        },
      },
      required: ["project_id"],
    },
  },

  // Documentation
  {
    name: "astralform_search_docs",
    description: "Search Astralform documentation.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
        category: {
          type: "string",
          enum: [
            "ios-sdk",
            "backend-api",
            "mcp-config",
            "dashboard",
            "billing",
          ],
          description: "Filter by category",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "astralform_get_doc",
    description: "Get the full content of a documentation page.",
    inputSchema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description:
            "Documentation path (e.g., '/ios-sdk/getting-started.md')",
        },
      },
      required: ["path"],
    },
  },
];

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Authentication
      case "astralform_device_code": {
        const result = await requestDeviceCode();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_device_token": {
        const deviceCode = args?.device_code as string;
        const result = await pollForToken(deviceCode, 5);
        if (result === "pending") {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  status: "pending",
                  message: "Waiting for user authorization...",
                }),
              },
            ],
          };
        }
        if (result === "expired") {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  status: "expired",
                  error: "Device code expired. Please start again.",
                }),
              },
            ],
            isError: true,
          };
        }
        if (result === "denied") {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  status: "denied",
                  error: "User denied authorization.",
                }),
              },
            ],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status: "success",
                message: "Successfully authenticated!",
              }),
            },
          ],
        };
      }

      case "astralform_whoami": {
        const result = await whoami();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_get_stats": {
        const result = await getStats();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      // Projects
      case "astralform_list_projects": {
        const result = await listProjects();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_get_project": {
        const result = await getProject(args?.project_id as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_create_project": {
        const result = await createProject({ name: args?.name as string });
        // Add warning about encryption key
        const response = {
          ...result,
          WARNING:
            "The encryption_key above is shown ONLY ONCE. Save it securely!",
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }

      case "astralform_update_project": {
        const result = await updateProject(args?.project_id as string, {
          name: args?.name as string,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_delete_project": {
        await deleteProject(args?.project_id as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Project deleted",
              }),
            },
          ],
        };
      }

      // API Keys
      case "astralform_list_api_keys": {
        const result = await listApiKeys(args?.project_id as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_create_api_key": {
        const result = await createApiKey(args?.project_id as string, {
          name: args?.name as string,
          environment: args?.environment as "development" | "production",
        });
        // Add warning about API key
        const response = {
          ...result,
          WARNING: "The full_key above is shown ONLY ONCE. Save it securely!",
        };
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }

      case "astralform_revoke_api_key": {
        await revokeApiKey(args?.project_id as string, args?.key_id as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "API key revoked",
              }),
            },
          ],
        };
      }

      // LLM Configuration
      case "astralform_list_llm_providers": {
        const result = await listLlmProviders();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_get_llm_config": {
        const result = await getLlmConfig(args?.project_id as string);
        return {
          content: [
            {
              type: "text",
              text: result
                ? JSON.stringify(result, null, 2)
                : JSON.stringify({ message: "No LLM configuration set" }),
            },
          ],
        };
      }

      case "astralform_set_llm_config": {
        const result = await setLlmConfig(args?.project_id as string, {
          provider: args?.provider as string,
          model: args?.model as string,
          api_key: args?.api_key as string | undefined,
          base_url: args?.base_url as string | undefined,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_delete_llm_config": {
        await deleteLlmConfig(args?.project_id as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "LLM configuration removed",
              }),
            },
          ],
        };
      }

      // MCP Servers
      case "astralform_list_mcp_templates": {
        const result = await listMcpTemplates();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_list_mcp_servers": {
        const result = await listMcpServers(args?.project_id as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_add_mcp_server": {
        const result = await addMcpServer(args?.project_id as string, {
          name: args?.name as string,
          template_id: args?.template_id as string | undefined,
          command: args?.command as string | undefined,
          args: args?.args as string[] | undefined,
          env_vars: args?.env_vars as Record<string, string> | undefined,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_toggle_mcp_server": {
        const result = await toggleMcpServer(
          args?.project_id as string,
          args?.server_id as string,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_delete_mcp_server": {
        await deleteMcpServer(
          args?.project_id as string,
          args?.server_id as string,
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "MCP server removed",
              }),
            },
          ],
        };
      }

      // Platform Tools
      case "astralform_list_platform_tools": {
        const result = await listPlatformTools();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_get_project_tools": {
        const result = await getProjectTools(args?.project_id as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_update_project_tool": {
        const result = await updateProjectTool(
          args?.project_id as string,
          args?.tool_name as string,
          {
            enabled: args?.enabled as boolean | undefined,
            api_key: args?.api_key as string | undefined,
          },
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      // Analytics
      case "astralform_get_analytics": {
        const result = await getAnalytics(args?.project_id as string, {
          start_date: args?.start_date as string | undefined,
          end_date: args?.end_date as string | undefined,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      // Documentation
      case "astralform_search_docs": {
        const result = await searchDocs({
          query: args?.query as string,
          category: args?.category as string | undefined,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "astralform_get_doc": {
        const result = await getDoc(args?.path as string);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: message }),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Astralform MCP server started");
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
