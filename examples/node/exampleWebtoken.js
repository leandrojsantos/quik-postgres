/**
* objetivo separar o projeto em dois ambientes desenvolvimento e produção
*
* .env = variáveis de ambiente
* npm install dotenv
*
* npm install -g cross-env
*
*/
 
/**
* primeiro cria na raiz do projeto uma pasta config nela criar dois arquivos:
.env.dev
.env.prod
 
esses arquivos são selecionados conforme o ambiente da aplicação de desenvolvimento ou produção 
*/
 
//As variáveis sensíveis do código por exemplo conexão dos bancos, porta da api e salt/key  para criptografia
 
//após encontra substuir por nome da varivel no aquivo .env.dev ou .env.prod:
process.env.NOME_DA_VARIAVEL
//obs nome sempre em maiúsculo por exemplo:
const JWT_KEY_ROOT = process.env.JWT_KEY
 
/**
* exemplo de arquivo .env.dev
*
JWT_KEY=root
PORT=5000
PWD_SALT=3
 
MONGO_URL=mongodb://root:root@localhost:27017/herois
 
POSTGRES_URL=postgres://root:root@localhost/heroes
*
**/
 
/**
* após isso ir na api
*/
 
//join para normalizar o caminho
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
//são colocadas primeiro para se algum precisar das variáveis
const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "environment inválida! Ou prod ou dev")
//aqui configPath escolhe o .env independe do lugar que rodar 
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
       ...mapRoutes(new AuthRoutes(JWT_KEY_ROOT, postgresModel), AuthRoutes.methods())
   ])
 
   await app.start()
   console.log('SERVIDOR OK na porta', app.info.port)
 
   return app;
}
 
module.exports = main()