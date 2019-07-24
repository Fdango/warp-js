const env = process.env.NODE_ENV;

// configuration file is used to configure application and interfaces
// If anything needs to be sucured, save it in an environement variable file (.env) and paste process.env.[#varname] to this config file.
const development = {
    evrynet: {
        DEFAULT_CONTRACT_ADDRESS: '0xC7B9e4b1414d61136B1e777CFBe84802435Fd2C8',
        GASLIMIT: 50000,
    },
    stellar: {
        ESCROW_ACCOUNT: 'GAAQ4EOKRV3O5MC42JPREIUYRCTXUE6JLXWHMETM24AFACXWE54FQATQ',
        EVRY_ASSET_NAME: 'EVRY',
        EVRY_ASSET_ISSUER_PUB: 'GATIJFZRBQH6S2BM2M2LPK7NMZWS43VQJQJNMSAR7LHW3XVPBBNV7BE5',
        STROOP_OF_ONE_STELLAR: Math.pow(10, 7),
    },
    grpc: {
        STELLAR: 'stellar',
        EVRYNET: 'evrynet',
        TRANSFER: 'transfer',
        DEFAULT_HOST: 'localhost:8080',
    }
}

const production = {

}

const config = {
    development,
    production,
    test: development,
}

export default config[env]