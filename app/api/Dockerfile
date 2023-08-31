FROM node:18.16.1-alpine

WORKDIR /usr/app

COPY ./ /usr/app

RUN npm install --force

RUN npm run build

CMD ["npm","run","start:dev"]