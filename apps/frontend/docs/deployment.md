# Deployment docs

## Containerization

A handy command for finding and removing dangling Docker images:
`docker rmi $(docker images --quiet --filter=dangling=true)`

### Setting environment variables through `Dockerfile` and `docker-compose`

The client-side environment variables need to be set at build-time. This renders it impossible to set them _after_ a Docker image has been built. The current solution I have found (proposed by Vercel) involves using a `Makefile` and multiple `docker-compose` files to build a Docker image _per target environment_, cf. https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env

An alternative approach (also from Vercel) involves setting build-time `ARG`s and overriding `ENV`s with them, cf. https://github.com/vercel/next.js/tree/canary/examples/with-docker-compose

Yet another, but even hackier, approach not from Vercel: https://dev.to/itsrennyman/manage-nextpublic-environment-variables-at-runtime-with-docker-53dl
