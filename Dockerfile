FROM node:12 as build-deps

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY assets ./assets
COPY babel.config.json webpack.config.js tsconfig.json ./
RUN ./node_modules/.bin/webpack --config webpack.config.js  --mode production

FROM python:3.9-buster
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/1.1.4/get-poetry.py | python - --version 1.1.4
WORKDIR /usr/src/app/
COPY pyproject.toml poetry.lock ./
ENV PATH="/root/.poetry/bin:$PATH"
RUN POETRY_VIRTUALENVS_CREATE=false poetry install --no-root --no-dev
COPY . ./
COPY --from=build-deps /usr/src/app/assets/bundles /usr/src/app/assets/bundles
COPY --from=build-deps /usr/src/app/webpack-stats.json /usr/src/app/webpack-stats.json

RUN ./manage.py collectstatic
