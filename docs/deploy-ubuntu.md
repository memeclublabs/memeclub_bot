# Installation

Ubuntu 22

## 一、 包管理器

```bash
#更新软件包列表：
sudo apt-get update

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
apt-get install git

# 可以根据需要，将本机的密钥配置到 github 中，方便 git clone 
```


node
```bash
# 安装 20+ 版本的 nodejs
https://nodejs.org/en/download/package-managernode

apt install ts-node
```

npm
```bash
npm install -g npm



```





## 一、安装和配置 postgresql

```
# 安装了 14
apt install postgresql
#brew install postgresql@15
```
>  Homebrew 是 Ruby 编写的 macOS 包管理器，其中 formula（复数形式为 formulae） 是其软件包描述文件。

### 1.1 配置

PostgreSQL配置文件存储在/etc/postgresql/<version>/main目录中。
例如，如果您安装 PostgreSQL 14，则配置文件存储在/etc/postgresql/14/main目录中。

https://ubuntu.com/server/docs/install-and-configure-postgresql

ALTER USER postgres with encrypted password 'memeclub2024localDB';

psql --host localhost --username postgres --password --dbname template1

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



