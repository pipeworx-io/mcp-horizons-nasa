# mcp-horizons-nasa

NASA JPL Horizons — solar-system body ephemerides

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `lookup` | Resolve an object name → SPK id. |
| `ephemeris` | Generate an ephemeris (default observer table). |
| `observers` | Convenience: ephemeris with table_type=OBSERVER. |
| `vectors` | Convenience: ephemeris with table_type=VECTORS. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "horizons-nasa": {
      "url": "https://gateway.pipeworx.io/horizons-nasa/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Horizons Nasa data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
