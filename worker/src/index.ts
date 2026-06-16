export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/api/health') {
      return Response.json(
        { status: 'ok', game: 'Goblin Village', version: '0.1.0' },
        { headers: corsHeaders }
      );
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};

// Env interface — wird durch wrangler.toml Bindings befüllt
interface Env {
  PLAYER_DATA: KVNamespace;
  VILLAGE_STATE: DurableObjectNamespace;
  GAME_ROOM: DurableObjectNamespace;
}
