# Installation

Ubuntu 22

## 一、 包管理器




```bash
#更新软件包列表：
sudo apt-get update
sudo apt-get upgrade

#升级已安装的软件包：
apt list --upgradable
apt-get upgrade

#这条命令在升级软件包时，会处理软件包依赖关系并安装新的依赖软件包。
apt-get dist-upgrade

apt-get install package_name

#这条命令会删除指定的软件包，但保留配置文件。
apt-get remove package_name
# 彻底删除软件包及其配置文件
apt-get purge package_name


#这条命令会删除系统中不再需要的依赖软件包。
apt-get autoremove

#这条命令会删除 /var/cache/apt/archives 目录中的所有包文件，以释放磁盘空间。
apt-get clean 

#这条命令只会删除过时的软件包文件，而保留最新的版本。
apt-get autoclean

```

git
```bash
sudo apt-get install git

# 可以根据需要，将本机的密钥配置到 github 中，方便 git clone
https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account

1. 生成新的 SSH 密钥并将其添加到 ssh-agent
ssh-keygen -t ed25519 -C "gandrew.sideby@gmail.com"
#ubuntu/.ssh/id_ed25519.pub

#将 SSH 密钥添加到 ssh-agent
eval "$(ssh-agent -s)"     ## 在后台启动 ssh 代理。
ssh-add ~/.ssh/id_ed25519  ## 将 SSH 私钥添加到 ssh-agent。


2. 向你的Github帐户添加新的 SSH 密钥
https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account

```


node
```bash
# 安装 20+ 版本的 nodejs
https://nodejs.org/en/download/package-managernode
https://nodejs.org/en/download/package-manager

sudo apt install ts-node node-typescript
sudo apt install node-typescript
```

npm
```bash
sudo npm install -g pnpm
sudo npm install pm2 -g
```


## 一、安装和配置 postgresql

```
# 安装了 14
apt install postgresql
#brew install postgresql@15
```
>  Homebrew 是 Ruby 编写的 macOS 包管理器，其中 formula（复数形式为 formulae） 是其软件包描述文件。

### 1.1 配置
https://dev.to/johndotowl/postgresql-16-installation-on-ubuntu-2204-51ia

PostgreSQL配置文件存储在/etc/postgresql/<version>/main目录中。
例如，如果您安装 PostgreSQL 14，则配置文件存储在/etc/postgresql/14/main目录中。

https://ubuntu.com/server/docs/install-and-configure-postgresql

sudo -u postgres psql template1
ALTER USER postgres with encrypted password 'memeclub2024localDB';

echo memeclub2024localDB
sudo -u postgres psql postgres

sudo systemctl restart postgresql.service
sudo apt install postgresql-client

memeclub2024ps

ssh ubuntu@52.76.112.159

```bash
psql --host localhost --username postgres --password --dbname postgres


\c postgres
postgres=# SELECT * FROM public."User";
postgres=#
postgres=# DELETE FROM public."Memecoin";
DELETE 5
postgres=# DELETE FROM public."Group";
DELETE 5
postgres=# DELETE FROM public."User";
DELETE 3

```


```bash
                                  List of roles
 Role name |                         Attributes                         | Member of 
-----------+------------------------------------------------------------+-----------
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
```

DATABASE_URL=postgresql://postgres:memeclub2024localDB@localhost:5432/postgres?schema=public

```bash
template1=# \l
                                  List of databases
   Name    |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges   
-----------+----------+----------+-------------+-------------+-----------------------
 postgres  | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | 
 template0 | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
           |          |          |             |             | postgres=CTc/postgres
 template1 | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
           |          |          |             |             | postgres=CTc/postgres
(3 rows)

```


## 数据导出导入

DATABASE_URL=postgresql://postgres:vfqz6Ca7ZUHTgRm9Yyoe@database-meme-1.cluster-cz8a6es2i8of.ap-southeast-1.rds.amazonaws.com:5432/postgres?schema=public

pg_dump -h your-aurora-endpoint -U your-username -d your-database-name -F c -b -v -f backup.dump
pg_dump -h database-meme-1.cluster-cz8a6es2i8of.ap-southeast-1.rds.amazonaws.com -U postgres -d postgres -F c -b -v -f backup.dump


pg_restore -h localhost -U your-local-username -d your-local-database-name -v /local/path/to/backup.dump
pg_restore -h localhost -U postgres -d postgres -v ./backup.dump

memeclub2024localDB


## PM2

pm2 start app.js --name tgbot



## Redis
https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux/

```bash

apt update
apt install redis
systemctl start redis
systemctl stop redis


redis-cli
ping


```