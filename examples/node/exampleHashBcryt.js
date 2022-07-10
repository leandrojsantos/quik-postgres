/**
* hash, bcrytc = manipulação de usuário e senha
*
* hash = não guarda a senha do usuário no banco de dados ele configura a senha e gera um hash ou seja um código e na próxima vez que logando e comparado 
*
* npm install brytc
*
*/
 
/**
* cria teste password para gerar e comparar hash
*/
const assert = require('assert');
const PasswordHelper = require('../src/helpers/passwordHelper');
 
const SENHA = 'testPss@pss';
const HASH = '$2b$04$xD/qMwMqBSa7kTB1.lmdVOvNW/XcFcQBTMZ4SYo0QJ85gwXmWIhQy'
 
describe('==> UserHelper Gera e Compara Hash a partir de senha', function () {
 
   it('t1gerarHash', async () => {
       const result = await PasswordHelper.hashPassword(SENHA);
       console.log('result', result)
       assert.ok(result.length > 10);
   });
 
   it('t2compararHash', async () => {
       const result = PasswordHelper.comparePassword(SENHA, HASH)
       console.log('result', result)
       assert.ok(result)
   })
 
});
 
 
/**
* criar pasta helpers dentro dela criar passwordHelper.js classe para para gera e comparar senha
*
*/
 
const Bcrypt = require('bcrypt')
 
//pois brypt trabalha com callback e com isso passamos para promisify
const {
   promisify
} = require('util')
 
const hashAsync = promisify(Bcrypt.hash)
const compareAsync = promisify(Bcrypt.compare)
 
//nível de complexidade da senha
const SALT = 3
 
class Password {
 
   static hashPassword(pass) {
       //pass = criar senha e retorna o hash
       return hashAsync(pass, SALT)
   }
   static comparePassword(pass, hash) {
       return compareAsync(pass, hash)
   }
}
module.exports = Password