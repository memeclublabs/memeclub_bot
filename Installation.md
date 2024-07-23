# Installation

## 一、安装和配置 postgresql

```
brew install postgresql@15
```
>  Homebrew 是 Ruby 编写的 macOS 包管理器，其中 formula（复数形式为 formulae） 是其软件包描述文件。

### 1.1 安装后说明

1. 默认已经初始化一个数据库集群

This formula has created a default database cluster with:
initdb --locale=C -E UTF-8 /usr/local/var/postgresql@16
For more details, read:
https://www.postgresql.org/docs/16/app-initdb.html

2. 命令不好默认安装到PATH 
postgresql@16 is keg-only, which means it was not symlinked into /usr/local,
because this is an alternate version of another formula. 

If you need to have postgresql@16 first in your PATH, run:
```echo 'export PATH="/usr/local/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc```

3. 编译需要的环境变量（可选）

For compilers to find postgresql@16 you may need to set:
```
export LDFLAGS="-L/usr/local/opt/postgresql@16/lib"
export CPPFLAGS="-I/usr/local/opt/postgresql@16/include"
```

4. 作为服务开机启动 
 
To start postgresql@16 now and restart at login:
```brew services start postgresql@16```
```brew services stop postgresql@16```
```
brew services restart postgresql@16
```

Or, if you don't want/need a background service you can just run:
LC_ALL="C" /usr/local/opt/postgresql@16/bin/postgres -D /usr/local/var/postgresql@16


### 1.2 基本使用


```bash
# 指定用户连接PostgreSQL
psql -U postgres

# 指定数据库连接PostgreSQL
psql -d postgres

# 参数参考
psql -h 127.0.0.1 -p 5432 -U ken -d postgres
```

```bash
# 查看所有用户
\du

 Role name |                         Attributes
-----------+------------------------------------------------------------
 andrew    | Superuser, Create role, Create DB, Replication, Bypass RLS

# 查看所有数据库
\l
                                             List of databases
   Name    | Owner  | Encoding | Locale Provider | Collate | Ctype | ICU Locale | ICU Rules | Access privileges
-----------+--------+----------+-----------------+---------+-------+------------+-----------+-------------------
 postgres  | andrew | UTF8     | libc            | C       | C     |            |           |
 template0 | andrew | UTF8     | libc            | C       | C     |            |           | =c/andrew        +
           |        |          |                 |         |       |            |           | andrew=CTc/andrew
 template1 | andrew | UTF8     | libc            | C       | C     |            |           | =c/andrew        +
           |        |          |                 |         |       |            |           | andrew=CTc/andrew
(3 rows)

# 切换当前数据库
\c {dbname}

# 查看当前库下所有的表
\dt

# 查看指定表
\d {tablename}


# 查看数据目录
SHOW data_directory;
    data_directory
------------------------------
 /usr/local/var/postgresql@16

# 退出psql
\q
```

```bash
# 创建数据库
CREATE DATABASE testDB;

# 创建表(记得使用\c命令切换数据库)
CREATE TABLE t1(id int,body varchar(100));

# 创建用户
CREATE USER testUser WITH PASSWORD 'Test#1357';

# 修改密码
ALTER USER testUser WITH PASSWORD 'Test#2468';

# 指定用户添加指定角色
ALTER USER testUser createdb;

# 赋予指定账户指定数据库所有权限
GRANT ALL PRIVILEGES ON DATABASE testDB TO testUser;

# 移除指定账户指定数据库所有权限
REVOKE ALL PRIVILEGES ON DATABASE testDB TO testUser;

```

### 1.3 配置远程访问

**账户与数据目录**

PostgreSQL程序文件以及数据文件默认属于postgres账户/brew安装时的账户，使用其他账户无操作权限，需要切换到对应账户，才能执行修改配置的相关操作

```bash
# 切换账户（图形化界面安装需要此步骤）
su postgres

# 进入PostgreSQL数据目录（brew）
#cd /opt/homebrew/var/postgresql@15/
#cd /usr/local/Cellar/postgresql@16/
根据 SHOW data_directory; 命令查询，16的数据目录在
cd /usr/local/var/postgresql@16


# 进入PostgreSQL数据目录（dmg）
cd /Library/PostgreSQL/15/data/
```

> 例如本人系统账户为 andrew， 本地测试不需要创建一个 postgresql 账户，可以忽略本配置
> 

**修改监听地址，运行远程链接**

```bash
# 修改postgresql.conf
vi postgresql.conf 

# 修改监听地址
listen_addresses= '*'

# 查看配置情况
cat postgresql.conf | grep "listen_addresses"
```

**放开客户端限制**

```bash
# 修改pg_hba.conf  
vi pg_hba.conf  

# 追加配置（md5指的加密方式，也可以选择scram-sha-256等）
host  all  all 0.0.0.0/0 md5

# 查看配置情况
cat  pg_hba.conf | grep "host"
```



```bash
psql -d postgres

ALTER USER andrew WITH PASSWORD 'memeclub@local#DB';

\q 

psql postgres -c "SHOW hba_file;"
#/usr/local/var/postgresql@16/pg_hba.conf
# 修改 pg_hba.conf，将 trust 改为 scram-sha-256

#https://blog.csdn.net/fxtxz2/article/details/140312962
```



