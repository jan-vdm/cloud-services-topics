FROM node:16

WORKDIR /app

COPY ../../package.json .
COPY ../../yarn.lock .
COPY ../../prisma ./prisma
COPY ../../.env .

RUN ls -a
RUN yarn install
RUN npx prisma generate

COPY ../../dist/apps/monitor .
COPY ../../dist/libs ../

CMD ["node", "main.js"]