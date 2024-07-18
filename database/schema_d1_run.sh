
# 1. Create DB
npx wrangler d1 create d1-memeclub-dev
npx wrangler d1 create d1-memeclub-prod

# 2.1 Local
npx wrangler d1 execute d1-memeclub-dev --local --file=./schema.sql
npx wrangler d1 execute d1-memeclub-dev --local --command="SELECT * FROM Customers"


# 2.2 Deploy
npx wrangler d1 execute d1-memeclub-prod --remote --file=./schema.sql
npx wrangler d1 execute d1-memeclub-prod --remote --command="SELECT * FROM User"
