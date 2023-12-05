# For documentation, cf. https://turbo.build/repo/docs/handbook/deploying-with-docker
FROM node:18.19.0-alpine AS base


FROM base AS turbosetup
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm i -g turbo
COPY . .
RUN turbo prune --scope=frontend --docker


FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1
# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=turbosetup /app/out/json/ .
COPY --from=turbosetup /app/out/package-lock.json ./package-lock.json
RUN npm install
# Build the project and its dependencies
COPY --from=turbosetup /app/out/full/ .
# ATTENTION: hack to set the correct environment variables for the production environment! 
COPY --from=turbosetup /app/out/full/apps/frontend/docker/production/.env ./apps/frontend/.env
COPY --from=turbosetup /app/out/full/apps/frontend/docker/production/.env.local ./apps/frontend/.env.local
COPY turbo.json turbo.json
RUN npx turbo run build --filter=frontend


# Production image, copy all the files and run next
# cf. https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/ for infos on dumb-init and the CMD statement
FROM base AS runner
ENV NODE_ENV production
ARG GIT_BRANCH
ENV GIT_BRANCH=${GIT_BRANCH:-unknown}
ARG GIT_COMMIT
ENV GIT_COMMIT=${GIT_COMMIT:-unknown}
RUN echo "The image is based on branch $GIT_BRANCH and commit $GIT_COMMIT"
WORKDIR /app
RUN addgroup --system --gid 1001 homeapp
RUN adduser --system --uid 1001 frontend
USER frontend
COPY --from=installer /app/apps/frontend/next.config.js .
COPY --from=installer /app/apps/frontend/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=frontend:homeapp /app/apps/frontend/.next/standalone ./
COPY --from=installer --chown=frontend:homeapp /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=installer --chown=frontend:homeapp /app/apps/frontend/public ./apps/frontend/public
# ATTENTION: hack to set the correct environment variables for the production environment! 
COPY --from=installer --chown=frontend:homeapp /app/apps/frontend/docker/production/.env ./apps/frontend/.env
COPY --from=installer --chown=frontend:homeapp /app/apps/frontend/docker/production/.env.local ./apps/frontend/.env.local

EXPOSE 3000
CMD node apps/frontend/server.js

