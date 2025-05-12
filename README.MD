###Backend##

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed


pnpm install
pnpm run generate
pnpm run migrate
pnpm run seed
pnpm run dev

###Frontend###
npm install



rm prisma/dev.db ##Borrar base de datos 

npx prisma migrate dev --name init #Crea nuevamente la base de datos