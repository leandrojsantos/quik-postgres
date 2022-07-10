/**
* swagger = front para rotas e documentação e gerado automaticamente desde que tenha mapRoutes() e instalado vision, inert, hapi-swagger
*
* npm install vision
* npm install inert
* npm install hapi-swagger
* npm install @hapi/hapi
*
* primeiro na api adicionar o app.register()
*/
 
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
        title: 'Leandro - API Restfull',
        version: 'v5.0'
    },
 }
  
 const Context = require('./src/db/strategies/base/contextStrategy')
 const MongoDB = require('./src/db/strategies/mongodb/mongoDbStrategy')
 const PostgresDB = require('./src/db/strategies/postgres/postgresSQLStrategy')
  
 const HeroSchema = require('./src/db/strategies/mongodb/schemas/heroSchema')
 const UserSchema = require('./src/db/strategies/postgres/schemas/userSchema')
  
 const UtilRoutes = require('./src/routes/utilRoutes')
 const AuthRoutes = require('./src/routes/authRoutes')
 const HeroRoutes = require('./src/routes/heroRoutes')
  
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
  
    const connection = MongoDB.connect()
    const mongoDb = new Context(new MongoDB(connection, HeroSchema))
  
 /**
 * começa por usar app.register() para importar módulos e se fazer também eles se comunicar 
 */
    await app.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            //config do título no frontEnd
            options: swaggerConfig
        }
    ])
  
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_KEY_ROOT,
        // options: {
        //     expiresIn: 30
        // },
        validate: (dado, request) => {
            return {
                isValid: true
            }
        }
    })
  
    app.auth.default('jwt')
  
  
    app.route([
        ...mapRoutes(new UtilRoutes(), UtilRoutes.methods()),
        ...mapRoutes(new HeroRoutes(mongoDb), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_KEY_ROOT, postgresModel), AuthRoutes.methods())
    ])
  
    await app.start()
    console.log('SERVIDOR OK na porta', app.info.port)
  
    return app;
 }
  
 module.exports = main()
  
  
 /**
 *
 * após isso ir routes:
 * para mapear as rotas exportada
 * fazendo por exemplo a route do heroRoutes lista
 *
 * localhost:5000/documentation
 * e a url onde fica as rotas e swagger
 */
  
 const BaseRoute = require('./base/baseRoute')
 const Joi = require('joi')
  
 class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }
  
    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                /**
                 * ao adicionar a:
                 *  tags: ['nome do aquivo'],
                 * description: 'descrição sobre a função'
                 * notes:'notas sobre como deve ser usado '
                 *
                 */
                tags: ['api'],
                description: 'Listar Herói',
                notes: 'Retorna a base inteira de heróis',
  
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown()
                }
            },
            handler: (request, headers) => {
                return this.db.read()
            }
        }
    }
 }
  
 module.exports = HeroRoutes 