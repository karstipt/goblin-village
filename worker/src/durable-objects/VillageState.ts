export class VillageState {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    // TODO: Phase 3 — Village State persistieren
    return new Response('VillageState stub', { status: 200 });
  }
}
