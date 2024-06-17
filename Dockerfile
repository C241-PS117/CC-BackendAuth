FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install cors

COPY . .

RUN npx prisma generate

ENV PORT=8080

ENV DATABASE_URL=mysql://Admin:luckydaffayangtau1108@34.34.221.151:3306/ESSY

CMD ["npm", "start"]