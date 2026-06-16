export class GameRoom {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    // TODO: Phase 3 — WebSocket Multiplayer
    return new Response('GameRoom stub', { status: 200 });
  }
}
