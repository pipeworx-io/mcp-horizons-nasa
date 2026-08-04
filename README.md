# @pipeworx/horizons-nasa

NASA JPL [Horizons](https://ssd.jpl.nasa.gov/horizons/) MCP — solar-system body ephemerides (planets, moons, asteroids, comets, spacecraft). Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `lookup(query)` — resolve an object name → SPK id
- `ephemeris(command, center?, start_time, stop_time, step_size?, table_type?)` — generate ephemerides
- `observers(command, center?, start_time, stop_time, step_size?)` — observer (apparent position) table
- `vectors(command, center?, start_time, stop_time, step_size?)` — Cartesian state vectors

`command` accepts SPK id (e.g. `"499"` Mars), name `"Mars"`, or designation.
`center` defaults to `"500@399"` (geocentric).

## Data source

`https://ssd.jpl.nasa.gov/api/horizons.api` and `/horizons_lookup.api`.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
