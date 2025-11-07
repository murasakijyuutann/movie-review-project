Place your AWS RDS CA bundle here and reference it via DB_SSL_CA_PATH.

Example (Vercel runtime path):
- Repo path: frontend/certs/global-bundle.pem
- Vercel env var: DB_SSL_CA_PATH=/var/task/certs/global-bundle.pem

If you skip the CA, set DB_SSL=true only and the code will use TLS 1.2+ with system CAs; this works in many regions but the CA bundle is recommended.
