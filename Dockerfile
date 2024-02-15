

# Dockerfile

FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache \
  python3 \
  make \
  g++

RUN npm ci --production

# Add SQLite database file to the image
COPY dist dist/
VOLUME /data
EXPOSE 3000

CMD ["node", "dist/app.js"]

