
export const DeployStatus = {
    DEV: 'DEV',
    PRODUCTION: 'PRODUCTION'
}

const env_config = {
    DEV: { url: 'http://192.168.212.122:8080', status: DeployStatus.DEV },
    PRODUCTION: { url: 'https://yuttana-portfolio-api.herokuapp.com', status: DeployStatus.PRODUCTION }
}

export const env = env_config.PRODUCTION;
