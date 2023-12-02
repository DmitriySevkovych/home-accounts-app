# Homeapp reverse proxy

## Traefik

See [Docker compose file](./docker-compose.yml) for a working setup that uses configuration files.

Resources on encryption (TLS):

-   https://pentacent.medium.com/lets-encrypt-for-your-docker-app-in-less-than-5-minutes-24e5b38ca40b

Resources on middleware:

-   BasicAuth for an additional (temporary) layer of protection: https://doc.traefik.io/traefik/middlewares/http/basicauth/

General Traefik docs:

-   https://doc.traefik.io/traefik/getting-started/concepts/

### Serving `robots.txt` through Traefik

Traefik itself can not serve files. Therefore Traefik is configured to route all `/robots.txt` requests to a separate container, whose only purpose is to serve the project's `robots.txt` file. [Cf. this reddit for more details.](https://www.reddit.com/r/Traefik/comments/od9vij/ubiquitous_robottxt/).

---

## NGINX (obsolete! Using Traefik instead)

### NGINX configuration

-   https://stackoverflow.com/questions/74185594/how-to-deploy-a-next-js-app-on-https-ssl-connection-with-docker
-   https://dev.to/danielkun/nginx-everything-about-proxypass-2ona

## SSL certificate

Let's encrypt and `certbot`. How to use `certbot` on your own:

-   https://certbot.eff.org/instructions?ws=other&os=ubuntufocal
