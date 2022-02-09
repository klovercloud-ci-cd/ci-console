export function getConfig(CONFIG: any) {
  return {
    host: CONFIG.host,
    port: CONFIG.port,
    prefix: CONFIG.prefix,
    endPoint: CONFIG.endPoint,
    mockPoint: CONFIG.mockPoint,
    api: {
      auth: '/api/auth/',
      profile: '/api/profile/'
    }
  };
}
