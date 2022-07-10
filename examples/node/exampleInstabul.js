/**
* cobertura de código
* com instabul
*
* site https://istanbul.js.org/
*
* instalação
* npm install --save-dev nyc
*
*/
 
/**
* feito no packeage.json colocar nyc antes do mocha fazendo script fica assim "test": "nyc --reporter=html mocha --timeout 50000 tests/*.test.js --exit"
* após isso rodar npm test ele irá gerar 2 pastas a primeira chamada .nyc_output onde é gerado os json da cobertura do código, a segunda coverage onde gera os mesmo códigos só que em html
*
*/
 
/**
* expor numa rota
* criar em routes utilRoutes.js
*/
const BaseRoute = require('./base/baseRoute')
const {
   join
} = require('path')
 
class UtilRoutes extends BaseRoute {
   coverage() {
       return {
           path: '/coverage/{param*}',
           method: 'GET',
           config: {
               auth: false,
           },
           handler: {
               directory: {
                   path: join(__dirname, '../../coverage'),
                   redirectToSlash: true,
                   index: true,
               },
           },
       }
   }
}
 
module.exports = UtilRoutes
 
/**
* após isso add rota na api.js
*/
const UtilRoutes = require('./src/routes/utilRoutes')
 
app.route([
   ...mapRoutes(new UtilRoutes(), UtilRoutes.methods()),])
 
/**
* obs é importante que seja exposto em um domínio específico ou tenha uma rota de autenticação segura
*/