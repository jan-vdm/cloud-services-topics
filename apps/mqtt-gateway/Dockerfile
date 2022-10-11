FROM node:16

WORKDIR /app

COPY ../../package.json .
COPY ../../yarn.lock .

RUN yarn install

COPY ../../dist/apps/mqtt-gateway .

EXPOSE 1883
CMD ["node", "main.js"]