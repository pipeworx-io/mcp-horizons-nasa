interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * JPL Horizons MCP.
 *
 * Auth: none. Docs: https://ssd-api.jpl.nasa.gov/doc/horizons.html
 */


const BASE = 'https://ssd.jpl.nasa.gov/api';
const UA = 'pipeworx-mcp-horizons-nasa/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'lookup',
    description: 'Resolve an object name → SPK id.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' } },
      required: ['query'],
    },
  },
  {
    name: 'ephemeris',
    description: 'Generate an ephemeris (default observer table).',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'SPK id, name, or designation. e.g. "499" (Mars).' },
        center: { type: 'string', description: 'Default "500@399" (geocentric).' },
        start_time: { type: 'string', description: 'e.g. "2026-05-18"' },
        stop_time: { type: 'string', description: 'e.g. "2026-05-19"' },
        step_size: { type: 'string', description: 'e.g. "1h", "1d" (default "1h").' },
        table_type: { type: 'string', description: 'OBSERVER (default) | VECTORS | ELEMENTS' },
      },
      required: ['command', 'start_time', 'stop_time'],
    },
  },
  {
    name: 'observers',
    description: 'Convenience: ephemeris with table_type=OBSERVER.',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string' },
        center: { type: 'string' },
        start_time: { type: 'string' },
        stop_time: { type: 'string' },
        step_size: { type: 'string' },
      },
      required: ['command', 'start_time', 'stop_time'],
    },
  },
  {
    name: 'vectors',
    description: 'Convenience: ephemeris with table_type=VECTORS.',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string' },
        center: { type: 'string' },
        start_time: { type: 'string' },
        stop_time: { type: 'string' },
        step_size: { type: 'string' },
      },
      required: ['command', 'start_time', 'stop_time'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'lookup': {
      const params = new URLSearchParams({
        sstr: reqStr(args, 'query', '"Mars"'),
        format: 'json',
      });
      return hGet(`/horizons_lookup.api?${params}`);
    }
    case 'ephemeris':
    case 'observers':
    case 'vectors': {
      const tableType =
        name === 'vectors'
          ? 'VECTORS'
          : name === 'observers'
            ? 'OBSERVER'
            : String(args.table_type ?? 'OBSERVER');
      const params = new URLSearchParams({
        format: 'json',
        COMMAND: `'${reqStr(args, 'command', '"499"')}'`,
        EPHEM_TYPE: tableType,
        CENTER: `'${String(args.center ?? '500@399')}'`,
        START_TIME: `'${reqStr(args, 'start_time', '"2026-05-18"')}'`,
        STOP_TIME: `'${reqStr(args, 'stop_time', '"2026-05-19"')}'`,
        STEP_SIZE: `'${String(args.step_size ?? '1h')}'`,
        OBJ_DATA: 'NO',
        MAKE_EPHEM: 'YES',
      });
      return hGet(`/horizons.api?${params}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function hGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Horizons: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
