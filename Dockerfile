FROM node:18-bullseye-slim as base

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

RUN mkdir /app
WORKDIR /app

ADD package.json package-lock.json ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

# Définissez les variables d'environnement
ENV NODE_ENV production
ENV NODE_ENV=production
ENV SESSION_KEY =secretla
ENV MAIL_PASSWORD =Sonatel2023
ENV MAIL_USERNAME =S_SupSMS
ENV DATABASE_URL=mysql://user:passer123@mysql:3306/subsea

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json package-lock.json ./
RUN npm prune --production

# Build the app
FROM base as build

RUN mkdir /app
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

# Définissez les variables d'environnement
ENV NODE_ENV production
ENV NODE_ENV=production
ENV SESSION_KEY =secretla
ENV MAIL_PASSWORD =Sonatel2023
ENV MAIL_USERNAME =S_SupSMS
ENV DATABASE_URL=mysql://user:passer123@mysql:3306/subsea


RUN mkdir /app
WORKDIR /app


COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
ADD . .

CMD ["npm", "run", "start:migrate:prod"]
