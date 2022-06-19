FROM node:16-buster-slim as builder

COPY package.json ./

RUN npm i --force && mkdir /ng-app && cp -R ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

RUN npm install -g @angular/cli

RUN ng build --prod


FROM klovercloud/node-web-server:12.13.1

WORKDIR /usr/src/app/public

COPY --from=builder /ng-app/dist/ci-console/. .

ENV PORT 8080

EXPOSE 8080
