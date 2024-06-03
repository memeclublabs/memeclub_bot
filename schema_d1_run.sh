
# 1. Create DB
npx wrangler d1 create d1-memeclub-prod

# 2.1 Local
npx wrangler d1 execute d1-memeclub-prod --local --file=./schema.sql
npx wrangler d1 execute d1-memeclub-prod --local --command="SELECT * FROM ArtUser"



# 2.2 Deploy
npx wrangler d1 execute d1-memeclub-prod --file=./schema.sql
npx wrangler d1 execute d1-memeclub-prod --command="SELECT * FROM Customers"
