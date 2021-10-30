
export const DeployStatus = {
    DEV: 'DEV',
    PRODUCTION: 'PRODUCTION'
}

const env_config = {
    DEV: { url: 'http://192.168.1.104:8080', basename: '/behavior', app_root: '/app', status: DeployStatus.DEV },
    PRODUCTION: { url: 'https://yuttana-portfolio-api.herokuapp.com', basename: '/behavior', app_root: '/app', status: DeployStatus.PRODUCTION }
}

export const env = env_config.PRODUCTION;
