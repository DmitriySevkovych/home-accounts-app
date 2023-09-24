# Deployment docs

## Containerization

### Setting environment variables through `Dockerfile` and `docker-compose`

To be able to set environment variables *after* a Docker image has been built, a hack is necessary, cf. [`Dockerfile`](../Dockerfile). Otherwise the containerized frontend always loads the .env files present at image build time. Here is an example of the hack implemented by vercel:
- https://github.com/vercel/next.js/tree/canary/examples/with-docker-compose

An alternative approach (also from Vercel) involves using a `Makefile` and multiple `docker-compose` files, cf link below. If using this solution, it is unclear how to gracefully integrate with `turbo` (without cluttering) the project with more configuration.
- https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env

Yet another, but even hackier, approach not from Vercel:
- https://dev.to/itsrennyman/manage-nextpublic-environment-variables-at-runtime-with-docker-53dl