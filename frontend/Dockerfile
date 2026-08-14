FROM node 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

EXPOSE 3001

CMD [ "npx", "serve", "-s", "build" ]
