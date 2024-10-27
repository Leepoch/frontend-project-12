start-frontend:
    make -C frontend start

start-backend:
    npx start-server

lint:
    make -C frontend lint

install:
    npm ci

build:
    npm run build

start:
    npm run start