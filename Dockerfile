FROM node:20

ARG APP

ENV APP=${APP}

WORKDIR /app

COPY package*.json yarn.lock tsconfig*.json ./

RUN yarn install

COPY . .

RUN yarn prisma generate

# Technically running migration is not needed for stock-checker
CMD ["/bin/bash", "-c", "yarn migrations:run;yarn start:dev ${APP}"]