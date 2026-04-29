export interface Config {
  apiEndpoint: string | null;
  edgeEndpoint: string | null;
}

const globalConfig: Config = {
  apiEndpoint: null,
  edgeEndpoint: null
}

export function configure(config: Config) {
  Object.assign(globalConfig, config);
}

export function getConfig(): Config {
  return globalConfig;
}