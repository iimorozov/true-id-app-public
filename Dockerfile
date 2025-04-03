FROM node:22-alpine AS build

WORKDIR /app
RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml* ./

ARG NPM_TOKEN
RUN if [ -n "$NPM_TOKEN" ]; then \
    echo "@tdg:registry=https://sec-nexus.truedigital.com/repository/trueid-identity-group/" > .npmrc && \
    echo "//sec-nexus.truedigital.com/repository/trueid-identity-group/:_authToken=$NPM_TOKEN" >> .npmrc && \
    echo "[Docker Build] .npmrc created successfully for TrueDigital repository" && \
    cat .npmrc | sed 's/_authToken=.*/_authToken=*****/'; \
    else \
    echo "[Docker Build] WARNING: NPM_TOKEN not provided, .npmrc not created"; \
    fi

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build
RUN rm -f .npmrc

FROM nginx:alpine

ENV API_URL=https://support-stg-now.truevisions.co.th
ENV API_HOST=support-stg-now.truevisions.co.th

COPY --from=build /app/dist /usr/share/nginx/html

COPY default.conf.template /etc/nginx/templates/default.conf.template
