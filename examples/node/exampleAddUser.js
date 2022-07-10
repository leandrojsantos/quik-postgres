/**
* =>heróis são cadastrados no mongodb com nome e poder
*
* =>usuários são cadastrados no postgres
* com nome e senha
*
*
*/
 
/** primeiro ao teste auth.test.js */
const assert = require('assert')
const api = require('../api')
const Context = require('../src/db/strategies/base/contextStrategy')
const PostgresDB = require('../src/db/strategies/postgres/postgresSQLStrategy')
const UserSchema = require('../src/db/strategies/postgres/schemas/userSchema')
 
let app = {}
 
const USER = {
   username: 'test',
   password: 'auth'
}
 
const USER_DB = {
   ...USER,
   password: '$2b$04$meQYE5L8R6Wo5SfI8m6a7OFWmuJgPtFlvHveO5fN.bd8gM.DnzatS'
}
 
 
describe('==> Auth User Suite de Testes', function () {
   this.beforeAll(async () => {
       app = await api
 
       const connectionPostgres = await PostgresDB.connect()
       const model = await PostgresDB.defineModel(connectionPostgres, UserSchema)
 
       //cadastro do mock user_db pois não tem rota de cadastro de usuário
       /**
       *
       para isso mudar a assinatura do método update do postgres pois esta como único para:
       * upset = insere
       pois assim se ele não encontra vai inserir no banco nao vai ser necessário ficar deletando para novo teste
      
       update(id, item, upsert = false) {
           const fn = upsert ? 'upsert' : 'update'
           return this._db[fn](item, {
               where: {
                           id
                       }
           });
       }
       *
       *
       altera também update do contextStrategy.js para:
      
       update(id, item, upsert) {
       return this._database.update(id, item, upsert);
       }
       * 
       **/
       const postgresModel = new Context(new PostgresDB(connectionPostgres, model));
       await postgresModel.update(null, USER_DB, true)
   })
 
   it('t1obterToken', async () => {
       const result = await app.inject({
           method: 'POST',
           url: '/login',
           payload: USER
       });
       const statusCode = result.statusCode
       const dados = JSON.parse(result.payload)
       console.log(`dados`, dados);
 
       assert.deepEqual(statusCode, 200)
       assert.ok(JSON.parse(result.payload).token.length > 10)
   })
 
   it('t2loginErrado', async () => {
       const result = await app.inject({
           method: 'POST',
           url: '/login',
           payload: {
               username: 'testeUsername',
               password: 'abc'
           }
       });
       const statusCode = result.statusCode
 
       assert.deepEqual(statusCode, 401)
       assert.deepEqual(JSON.parse(result.payload).error, "Unauthorized")
   })
})
 
/**
* após isso ir na pasta schemas do postgres fazer userSchema.js
*/
const Sequelize = require('sequelize')
 
const UserSchema = {
   name: 'users',
 
   schema: {
       id: {
           type: Sequelize.INTEGER,
           required: true,
           primaryKey: true,
           autoIncrement: true,
       },
       username: {
           type: Sequelize.STRING,
           unique: true,
           required: true,
       },
       password: {
           type: Sequelize.STRING,
           required: true,
       },
   },
   options: {
       //opções para base existente
       tableName: 'TB_USUARIOS',
       freezeTableName: false,
       timestamps: false,
 
   }
}
 
module.exports = UserSchema
 
/**
* feito isso ir na authRoutes.js
*/
const BaseRoute = require('./base/baseRoute')
 
const Joi = require('joi')
const Boom = require('boom')
 
const PasswordHelper = require('./../helpers/passwordHelper')
 
const USER = {
   username: 'test',
   password: 'auth'
}
const Jwt = require('jsonwebtoken')
 
class AuthRoutes extends BaseRoute {
   //add db assim key
   constructor(key, db) {
       super()
       this.secret = key
       this.db = db
   }
 
   login() {
 
       return {
           path: '/login',
           method: 'POST',
           config: {
               auth: false,
               tags: ['api'],
               description: 'Obter tokin',
               notes: 'Retorna o token com user e senha do banco',
 
               validate: {
                   failAction: (request, h, err) => {
                       throw err;
                   },
                   payload: {
                       username: Joi.string().required(),
                       password: Joi.string().required()
                   }
               }
           },
           handler: async (request, headers) => {
               const {
                   username,
                   password
               } = request.payload
 
               //válida se usuário existe no banco de dados
               const [USER] = await this.db.read({
                   username: username.toLowerCase()
               })
 
               if (!USER) {
                   return Boom.unauthorized('Usuario nao existe')
               }
 
               //compara a senha que veio e válida com hash no banco de dados
               const match = await PasswordHelper.comparePassword(password, USER.password)
 
               if (!match) {
                   return Boom.unauthorized('Usuario e Senha invalidos!')
               }
 
               return {
                   token: Jwt.sign({
                       username: username
                   }, this.secret)
               }
           }
       }
   }
}
 
module.exports = AuthRoutes
 
/**
* após importar o banco e rotas na api.js
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
 
   //conexão para postgres e schema userSchema
   const connectionPostgres = await PostgresDB.connect()
   const model = await PostgresDB.defineModel(connectionPostgres, UserSchema)
   const postgresModel = new Context(new PostgresDB(connectionPostgres, model));
 
   const connection = MongoDB.connect()
   const mongoDb = new Context(new MongoDB(connection, HeroSchema))
 
 
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
 
       //adiciona conexão e schama para user através do postgresModel
       ...mapRoutes(new AuthRoutes(JWT_KEY_ROOT, postgresModel), AuthRoutes.methods())
   ])
 
   await app.start()
   console.log('SERVIDOR OK na porta', app.info.port)
 
   return app;
}
 
module.exports = main()