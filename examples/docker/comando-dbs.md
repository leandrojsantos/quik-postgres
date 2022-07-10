## Docker criando Databases :
----------------------
### POSTGRESQL
```bash
# criar imagem do postgres
 
    docker run \
   --name postgres \
   -e POSTGRES_USER=admin \
   -e POSTGRES_PASSWORD=root \
   -e POSTGRES_DB=mdb \
   -p 5432:5432 \
   -d \
   postgres:11.5

# cria interface do pg
 
    docker run \
   --name adminer \
   -p 8080:8080 \
   --link postgres:postgres \
   -d \
   adminer

# login interface do adminer em localhost:8080
 
   sistema: PostgreSQL
   servidor: postgres
   usuário: admin
   senha: root
   base de dados: mdb
```
