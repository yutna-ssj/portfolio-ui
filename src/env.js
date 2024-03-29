
export const DeployStatus = {
    DEV: 'DEV',
    PRODUCTION: 'PRODUCTION'
}

const env_config = {
    DEV: { url: 'http://192.168.1.103:8080', status: DeployStatus.DEV },
    PRODUCTION: { url: 'https://yuttana-portfolio.herokuapp.com', status: DeployStatus.PRODUCTION }
}

export const env = env_config.PRODUCTION;
