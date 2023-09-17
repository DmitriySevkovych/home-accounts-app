# For documentation, cf. https://turbo.build/repo/docs/handbook/deploying-with-docker
FROM node:18.17.0-alpine AS base


FROM base AS turbosetup
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm i -g turbo
COPY . .
RUN turbo prune --scope=backend --docker


FROM base AS installer
RUN apk add dumb-init
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=turbosetup /app/out/json/ .
COPY --from=turbosetup /app/out/package-lock.json ./package-lock.json
RUN npm install
# Build the project and its dependencies
COPY --from=turbosetup /app/out/full/ .
COPY turbo.json turbo.json
RUN npx turbo run build --filter=backend


# Production image, copy all the files and run next
# cf. https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/ for infos on dumb-init and the CMD statement
FROM base AS runner
COPY --from=installer /usr/bin/dumb-init /usr/bin/dumb-init
ENV NODE_ENV production
WORKDIR /app
RUN addgroup --system --gid 1001 homeapp
RUN adduser --system --uid 1001 backend
USER backend
COPY --from=installer --chown=backend:homeapp /app .
EXPOSE 8090
CMD ["dumb-init", "node", "apps/backend/dist/index.js"]

