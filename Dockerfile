


FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache \
  python3 \
  make \
  g++

RUN npm ci --production

COPY dist dist/

EXPOSE 3000

CMD ["node", "dist/app.js"]

