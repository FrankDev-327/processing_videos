FROM node:alpine as development
WORKDIR /usr/src/app
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY orm.ts ./
RUN npm install --legacy-peer-deps
COPY . ./
RUN npm run build

FROM node:alpine as prod
ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/tsconfig.json ./tsconfig.json
COPY --from=development /usr/src/app/orm.ts ./orm.ts
COPY --from=development /usr/src/app/dist ./dist
COPY package.json ./
EXPOSE 4001
CMD npm run migration:run && node dist/src/main