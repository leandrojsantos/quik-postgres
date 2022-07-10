/***
* esse é um exemplo de como conectar com db sem strategy (padrão de projeto)
* nesse ex e no projeto vamos esta usando o sequelize que é ORM =  os ORM servem para transformar objetos em tabelas para trabalhar com db relacional no caso postgres
*/
 
/**
* para instalar o sequelize e também seu driver.:
* npm install sequelize
* npm install pg-hstore pg
*/
 
/**
* driver, host e dialect = monta a conexão com db, user, senha e tipo do db
* quateIdentifiers e operatorAliases = impede o sequelize de add item pois ele adiciona vários
*/
const Sequelize = require('sequelize')
const driver = new Sequelize(
   'heroes',
   'root',
   'root', {
       host: 'localhost',
       dialect: 'postgres',
       quoteIdentifiers: false,
       operatorAliases: false
   }
)
 
/**
* *tablename, freezeTableName e timestamps = para usar o banco existe pois o sequelize altera as configurações
* *raw e attributes = filtros no sequelize
*/
async function main() {
  
   /**conexão normal */
   const sequelize = new Sequelize(
       'heroes', //database
       'root', // user
       'root', //senha
       {
           host: 'localhost',
           dialect: 'postgres',
           // case sensitive
           quoteIdentifiers: false,
           // deprecation warning
           // operatorsAliases: false,
           //disable logging
           logging: false
           // dialectOptions: {
           //   ssl: true,
       },
   );
 
   /**conexão com .env */
   //     const sequelize = new Sequelize(process.env.POSTGRES_URL, {
   //       quoteIdentifiers: false,
   //       // deprecation warning
   //       //operatorsAliases: false,
   //       //disable logging
   //       logging: false,
 
   //       ssl: process.env.SSL_DB,
   //       dialectOptions: {
   //         ssl: process.env.SSL_DB
   //       }
 
   //     })
   //     console.log('POSTGRESQL OK');
   //     return sequelize
   //   }
 
   await Herois.sync()
 
   await Herois.create({
       nome: 'Rock',
       poder: 'luta'
   })
 
   const result = await Herois.findAll({
       raw: true
       //attributes: ['nome']
   })
   console.log('result', result)
}
main()