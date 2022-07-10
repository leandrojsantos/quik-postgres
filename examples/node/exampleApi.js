/**
* hapijs = e biblioteca usado para controle das rotas para api com mais plugins que express que é outro framework com a mesma utilidade, isso ajuda em velocidade e com isso melhor comunica
*/
 
/**
* npm install hapi
* const app = inicia servidor
* context = conecta com o db e schema
* await app.start = start o hapi
*/
 
const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')
 
const app = new Hapi.Server({
   port: 5000
})
 
async function main() {
   const conneted = MongoDB.connect()
   const context = new Context(new MongoDB(conneted, HeroiSchema))
   app.route([{
       path: '/herois',
       method: 'GET',
       handler: (request, headers) => {
           return context.read()
       }
   }])
 
   await app.start()
   console.log('Hapi ok na porta', app.info.port)
 
}
main()