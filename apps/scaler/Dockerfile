FROM node:16

WORKDIR /app

COPY ../../package.json .
COPY ../../yarn.lock .
COPY ../../prisma ./prisma
COPY ../../.env .

RUN yarn install
RUN yarn prisma generate

COPY ../../dist/apps/scaler .

CMD ["node", "main.js"]