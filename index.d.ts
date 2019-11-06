declare var dush: dush.DushStatic;

declare namespace dush {
  type Handler = (...event: any[]) => void;

  interface DushStatic {
    (): Emitter;
  }

  interface Emitter {
    _allEvents: Array<{ [eventName: string]: Handler[] }>;
    once(type: string, handler: Handler): Emitter;
    emit(type: string, ...event: any[]): Emitter;
  }
}

export = dush;
