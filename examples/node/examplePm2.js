/****pm2
http://pm2.keymetrics.io/
*
npm install -g pm2
necessário também instalacao global
**/
 
/**
* comando node api.js (por ex) onde e dado start do app se algo inesperado ocorrer tudo para pois node e assíncrono mas está tudo na mesmo processo
* monitora a aplicação e faz gestão do app com um conjunto completo de recursos para o ambiente de produção
* /
 
/**
*
* onde está no pakage.json script para iniciar o projeto em produção no nosso caso script
*  prod: pm2 runtime api.js
*/
 
/**
* *comandos básicos para pm2
* pm2 start --name herois -i 10 api.js = cria 10 instâncias do que tá rodando
* pm2 monit = monitora todas as aplicações
* pm2 logs = ver logs
* pm2 kill = matar todas aplicações
* heroku config:set PM2_PUBLIC_KEY=70gkh0t5ork2cy7 PM2_SECRET_KEY=ge7h765ewpt1zsn = linka com heroku
*
*/