
# 1. Create DB
npx wrangler d1 create d1-art404-prod

# 2.1 Local
npx wrangler d1 execute d1-art404-prod --local --file=./schema.sql
npx wrangler d1 execute d1-art404-prod --local --command="SELECT * FROM ArtUser"



# 2.2 Deploy
npx wrangler d1 execute d1-art404-prod --file=./schema.sql
npx wrangler d1 execute d1-art404-prod --command="SELECT * FROM Customers"
