# Build
FROM node:18-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build

# Server
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/build ./
COPY --from=build /app/prisma/schema.prisma ./prisma/
COPY --from=build /app/prisma/migrations/ ./prisma/

COPY --from=build /app/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN npm config set update-notifier false

ENTRYPOINT ["entrypoint.sh"]

EXPOSE 5000

CMD ["npm", "start"]
