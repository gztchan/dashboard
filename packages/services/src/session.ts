import { configure, Config } from '@providence/api'

export class SessionService {
  static createService(config: Config) {
    configure(config);
    return new SessionService();
  }
}