/**
* strategy e um padrão de projeto
* ex => cliente que produto 'x' isso ativa o método comprar() que pode ser pela web, moblie
*/
 
/**
* ou seja strategy é uma ação quem tem 'n' formas de ser realizada, no nosso caso 2 db relacional e db não relacional
**/
 
 
/**
* class feita para padronizar error com exception
*/
class NotImplementedException extends Error {
    constructor() {
        super("Sem Implementação")
    }
 }
  
 class ICrud {
    create(item) {
        throw new NotImplementedException()
    }
  
    read(query) {
        throw new NotImplementedException()
    }
  
    update(id, item) {
        throw new NotImplementedException()
    }
  
    delete(id) {
        throw new NotImplementedException()
    }
 }
  
 class MongoDB extends ICrud {
    constructor() {
        super()
    }
    create(item) {
        console.log('Salvo no Mongo')
    }
 }
  
 class Postgres extends ICrud {
    constructor() {
        super()
    }
    create(item) {
        console.log('Salvo no PG')
    }
 }
  
  
 /**
 * context = entender qual e contexto do db para usar
 */
 class ContextStrategy extends ICrud {
    constructor(strategy) {
        super()
        this._database = strategy
    }
  
    create(item) {
        return this._database.create(item)
    }
  
    read(item) {
        return this._database.read(item)
    }
  
    update(id, item) {
        return this._database.update(id, item)
    }
  
    delete(id) {
        return this._database.delete(id)
    }
 }
  
  
 /**
 * após isso instância o obj
 */
 const contexMongo = new ContextStrategy(new MongoDB())
 contexMongo.create()
  
 const contexPostgres = new ContextStrategy(new Postgres())
 contexPostgres.create()
  
 /**
 * index.js = chamar os métodos instanciados
 */
  
  
  
 /**após isso e dividir strategy.js na pasta strategies para melhor organização**/ 