# Heroku
 
[Heroku](https://www.heroku.com) vai ser usado no projeto para banco de dados online para postgres e também como forma de deploy
 
```bash
   $ npm install -g heroku # Instalação global pois podemos usar através do terminal com heroku cli, após isso conceito básico localhost nao existe ou só deve ser usado quando mudar a variável de ambiente, para isso ir no package.json e cria um novo script "prod": "cross-env NODE_ENV=prod pm2-runtime api.js"
 
   #Feito isso criar a arquivo na raiz do projeto chamado 'Procfile' que serve para o heroku identificar os comandos do package.json
 
   $ web: npm run prod
```
 
Comandos básicos do heroku cli no terminal
```bash
   $ heroku login #entra na conta
 
   $ heroku apps:list #lista app
 
   $ heroku apps:create NOME_DO_APP #cria um novo app esse nome deve ser único e será o mesmo da url
 
   heroku logs #mostra logs
```
Após criado app são mesmos comando do git, linkar origin pasta (fetch) e origin pasta (push)
```bash
   $ heroku git:remote --app NOME_DO_APP # linkar no git do heroku para origin pasta (fetch) e origin pasta (push)
   $ git remote -v
 
   comandos para subir app no heroku
   $ git status
   $ git add .
   $ git commit -m "v01"
   $ git push heroku master
 
   ou
 
   $ git add . && git commit -m "v01" && git push heroku master
 
   Feito isso tem liberar app no site do heroku, fazer login e no seu esquerdo superior clicar e selecionar 'DATA' nele escolher a opção do postgres então selecionar no canto superior esquerdo
 
   "install heroku postgres"
 
   Após colocar nome app seleciona "provision add-on"
 
   Em seguida vá ao canto direito inferior clicar em heroku postgres que abrirá o dashboard com infos do app onde terá na navbar a opção settings,
 
   "view credentials"
 
   Entra nessa opção para pegar uri de conexão em com postgres, com uri copiada substua POSTGRES_URL= por essa em config .env.prod #na pasta config na raiz do projeto