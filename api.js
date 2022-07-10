const {
    join
} = require('path')
const {
    config
} = require('dotenv')

const {
    ok
} = require('assert')

const Hapi = require('hapi')
const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "environment inválida! Ou prod ou dev")

const configPath = join('./config', `.env.${env}`)

config({
    path: configPath
})

const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')
const HapiJwt = require('hapi-auth-jwt2')
const JWT_KEY_ROOT = process.env.JWT_KEY

const swaggerConfig = {
    info: {
        title: 'API Restfull - Postgres',
        version: 'v0.0'
    },
}

const Context = require('./src/db/strategies/base/contextStrategy')
const PostgresDB = require('./src/db/strategies/postgres/postgresSQLStrategy')

const UserSchema = require('./src/db/strategies/postgres/schemas/userSchema')

const UtilRoutes = require('./src/routes/utilRoutes')
const AuthRoutes = require('./src/routes/authRoutes')
const UserRoutes = require('./src/routes/userRoutes')

const app = new Hapi.Server({
    port: process.env.PORT,
    routes: {
        cors: true
    }
})


function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {

    const connectionPostgres = await PostgresDB.connect()
    const model = await PostgresDB.defineModel(connectionPostgres, UserSchema)
    const postgresModel = new Context(new PostgresDB(connectionPostgres, model));

    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerConfig
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_KEY_ROOT,
        options: {
            expiresIn: 30,
            algorithms: [ 'HS256' ]
        },
        validate: (dado, request) => {
            return {
                isValid: true
            }
        }
    })

    app.auth.default('jwt')


    app.route([
        //api methods helpers
        ...mapRoutes(new UtilRoutes(), UtilRoutes.methods()),
        
        //api methods postgres
        ...mapRoutes(new UserRoutes(postgresModel), UserRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_KEY_ROOT, postgresModel), AuthRoutes.methods())
    ])

    await app.start()
    console.log('API SWAGGER OK, na porta', app.info.port, 'link abaixo')
    console.log(`${'http://localhost:5000/documentation'}`)
    return app;
}

module.exports = main()