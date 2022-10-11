FROM node:16

WORKDIR /app

COPY ../../package.json .
COPY ../../yarn.lock .

RUN yarn install

COPY ../../dist/apps/scaler .

CMD ["node", "main.js"]