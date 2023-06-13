#!/bin/sh
set -ex

npm run prisma:db:push

exec "$@"
