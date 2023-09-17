Commands for creating a self-signed TLS key + certificate (e.g. for development):

```
openssl genrsa -out apps/backend/src/cert/key.pem
openssl req -new -key apps/backend/src/cert/key.pem -out apps/backend/src/cert/csr.pem
openssl x509 -req -days 365 -in apps/backend/src/cert/csr.pem -signkey apps/backend/src/cert/key.pem -out apps/backend/src/cert/cert.pem
```

&rarr; self-signing the certificates this way leads to `net::ERR_CERT_AUTHORITY_INVALID` when fetching the API from the browser.

&rarr; use `mkcert -install` to create a local certificate authority and use `mkcert` to create and sign the SSL key + certificate.

---

Commands for creating Let's Encrypt TLS certificate using Certbot -> follow https://dev.to/omergulen/step-by-step-node-express-ssl-certificate-run-https-server-from-scratch-in-5-steps-5b87
