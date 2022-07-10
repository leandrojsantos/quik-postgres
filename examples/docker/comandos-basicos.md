## Comandos Docker :
-------------------------
### IMAGEM
```bash
$ sudo usermod -aG docker $(whoami) # nao usar sudo
 
$ docker search nome_da_img # procura uma imagem
 
$ docker pull nome_da_img # baixar imagem na última versão
 
$ docker pull nome_da_img:nome_ou_numero_da_ver # baixa imagem de versão específica
 
$ docker run nome_da_img # executa a imagem
 
$ docker run --link postgres:pgadmin # linkar imagens, por ex postgres necessita do pgadmin
 
$ docker images # lista imagens
 
$ docker ps -a # lista imagens rodando
 
$ (docker ps -qa) # para todas imagens
 
$ docker rmi id_da_img # para excluir a imagem
 
$ docker exec -it nome_da_imagem # entra na imagem
 
$ exit # sai dessa imagem
```
__________________
 
### CONTAINER
```bash
$ docker run nome_da_imagem # cria container
 
$ docker run -d -p 6379:6379 --name redisnovo redis # cria container nome e porta, para ex redis
 
$ docker run --name nome_escolhido nome_da_imagem # cria um nome para container
 
$ docker stats id_ou_nome # Informações de uso de Hardware do container
 
$ docker inspect id_ou_apelido # Informações de uso de Hardware do container
 
$ docker run -it -p 8080:80 nome_da_imagem # Mapeando uma porta para o container, sempre usar portas padrões dos programas mas você pode alterar. Estamos informando que a porta 8080 no Host é aberta e deve ser mapeada na porta 80 do container
 
$ docker start id_ou_nome # start container
 
$ docker-compose up -d # start container in compose mode in file
 
$ docker stop id_ou_nome # stop container
 
$ docker container stop $(docker container ls -a -q) # stop all containers
 
$ docker exec -it nome_do_container # entra no container
 
$ docker exec -it id_ou_nome # entra no container e executa comando
 
$ exit # sai do container
 
$ docker rm id_ou_nome # del container
 
$ docker rm $(docker ps -qa) # del all containers
 
$ docker system prune --all --force --volumes # Excluir images,container,volumes ou tudo
```
_______________________
 
### OUTROS COMANDOS
```bash
$ docker --help # infos de help
 
$ docker attach # Acessar dentro do container e trabalhar a partir dele.
 
$ docker build # A partir de instruções de um arquivo Dockerfile eu posso criar uma imagem.
 
$ docker commit # Cria uma imagem a partir de um container.
 
$ docker cp # Copia arquivos ou diretórios do container para o host.
 
$ docker create # Cria um novo container.
 
$ docker diff # Exibe as alterações feitas no filesystem do container.
 
$ docker events # Exibe os eventos do container em tempo real.
 
$ docker exec # Executa uma instrução dentro do container que está rodando sem precisar entrar nele.
 
$ docker export # Exporta um container para um arquivo .tar.
 
$ docker history # Exibe o histórico de comandos que foram executados dentro do container.
 
$ docker images # Lista as imagens disponíveis no host.
 
$ docker import # Importa uma imagem .tar para o host.
 
$ docker info # Exibe informações sobre o host.
 
$ docker kill # Da Poweroff no container.
 
$ docker load # Carrega a imagem de um arquivo .tar.
 
$ docker login # Registra ou faz o login em um servidor de registry.
 
$ docker logout # Faz o logout de um servidor de registry.
 
$ docker logs # Exibe os logs de um container.
 
$ docker port # Abre uma porta do host e do container.
 
$ docker network # Gerenciamento das redes do docker.
 
$ docker node # Gerenciamento dos node do docker Swarm.
 
$ docker pause # Pausa o container.
 
$ docker port # Lista as portas mapeadas de um container.
 
$ docker ps # Lista todos os containers.
 
$ docker pull # Faz o pull de uma imagem a partir de um servidor de registry.
 
$ docker push # Faz o push de uma imagem a partir de um servidor de registry.
 
$ docker rename # Renomeia um container existente.
 
$ docker restart # Restartar um container que está rodando ou parado.
 
$ docker rm # Remove um ou mais container.
 
$ docker rmi # Remove uma ou mais imagens.
 
$ docker run # Executa um comando em um novo container.
 
$ docker save # Salva a imagem em um arquivo .tar.
 
$ docker search # Procura por uma imagem no docker Hub.
 
$ docker service # Gerenciamento dos serviços do docker.
 
$ docker swarm # Clusterização das aplicações em uma orquestração de várias containers, aplicações junto.
 
$ docker tag # Coloca tag em uma imagem para o repositório.
 
$ docker top # Exibe os processos rodando em um container.
 
$ docker unpause # Inicia um container que está em pause.
 
$ docker update # Atualiza a configuração de um ou mais containers.
 
$ docker version # Exibe as versões de API, Client e Server do host.
 
$ docker volume # Gerenciamento dos volumes no docker.
 
$ docker wait # Aguarda o retorno da execução de um container para iniciar esse container.
 
```