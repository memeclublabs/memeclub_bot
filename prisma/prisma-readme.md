
# Migration 从配置文件到数据库

根据环境变量和配置文件schema.dbPrisma，生成 SQL 语句并应用到数据库。

运行以下命令，使用创建数据库架构所需的 SQL 创建迁移文件：
```
npx dbPrisma migrate dev --name init
```
1. 加载环境变量
2. 加载 dbPrisma/schema.dbPrisma
3. Applying migration `20240722080717_init`
4. 将 migration 脚本应用到数据库


# 二、导入初始化数据


```
npx dbPrisma db seed
```

备注： 需要根据文档做一些配置
https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding