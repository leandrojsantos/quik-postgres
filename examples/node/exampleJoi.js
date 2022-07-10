/***
* Joi = para manipular requisições pelo heads ou seja validação fluente
*
* npm install joi
* 
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
               tags: ['api'],
               description: 'Listar Heroi',
               notes: 'Retorna a base inteira de herois',
 
               /**
                * onde é configurado o objeto no caso
                */
               validate: {
                   /**
                    * sem a validação necessária nem vai para headers as validações pode ser :
                    *
                    * payload valida o corpo da requisição,
                    * heardera valida o header ou cabeçalho da requisição,
                    * query válida a URL passa,
                    * params valida o parâmetro passado na url ou por exemplo /:id,
                    *
                    * required() = campo obrigatório,
                    * unknown() = objeto indefinido
                    * failAction = tipo do erro
                    *
                    */
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