<h1 align="center">Tech Assassment: Advanced Stock Price Checker</h1>

<div align="center">
  🧑🏻‍💻👩🏼‍💻👨🏿‍💻 🎬🍿🧃 🙋🏼‍♀️🙋🏾‍♂️🙋🏼
</div>
<div align="center">
  <strong>This repository contains a stock price checker application built using Node.js and NestJS. The app utilizes the Finnhub API to fetch stock data and expose it to developers via API.</strong>
</div>
<div align="center">
  Modern, clean API written with Nest.js and Prisma
</div>

<br />

<div align="center">
  <!-- Node version -->
  <a href="https://nodejs.org/dist/latest-v18.x/docs/api/">
    <img src="https://img.shields.io/badge/node-20.x-blue?style=flat-square"
      alt="Node version" />
  </a>
  <!-- Yarn version -->
  <a href="https://yarnpkg.com/">
    <img src="https://img.shields.io/badge/yarn-1.x-blue?style=flat-square"
      alt="Yarn version" />
  </a>
  <!-- PostgreSQL version -->
  <a href="https://nextjs.org/docs">
    <img src="https://img.shields.io/badge/PostgreSQL-14-blue?style=flat-square"
      alt="NestJS Version" />
  </a>
  <!-- Redis version -->
  <a href="https://mui.com/material-ui/">
    <img src="https://img.shields.io/badge/Redis-6.2-blue?style=flat-square"
      alt="Prettier enabled" />
  </a>
  <!-- Prettier -->
  <a href="https://prettier.io/">
    <img src="https://img.shields.io/badge/prettier-enabled-brightgreen?style=flat-square"
      alt="Prettier enabled" />
  </a>
  <!-- Coding -->
  <a href="https://npmjs.org/package/choo">
    <img src="https://img.shields.io/badge/Coding-❤️-pink?style=flat-square"
      alt="Coding awesome" />
  </a>
</div>

## Introduction

The task description did not mandate the utilization of the technologies I employed (Mono-repo, Redis, multi-services, queues), as a minimalist implementation could fit within 300 lines of code. However, I chose to apply them out of sheer curiosity and to showcase a scalable, versatile implementation in terms of both size and performance.

## Table of Contents

- [Features](#features)
- [Roadmap](#roadmap)
- [Future improvements](#future-improvements)
- [Folder structure](#folder-structure)
- [Installation](#installation)

## Features

- Search stocks by symbol.
- Continous update in the background.
- Scalable, asynchronous background jobs.
- API Documentation

## Roadmap

- [x] Setup codebase with mono-repo
- [x] Apply commitlint with conventional commits
- [x] Implement in multi-service architecture
- [x] Use Redis for message queue
- [x] Use PostgreSQL for data storage
- [x] Use Prisma for database access
- [x] Fetch external API in background
- [x] Validate Dtos
- [x] Handle and track error
- [x] Apply logging
- [x] Provide health check
- [x] Provide API Documentation
- [x] Write unit tests for back-end functionality
- [ ] Write end-to-end tests for the server
- [x] Generate code coverage and static analysis
- [x] Make dockerized development environment
- [ ] Create CI/CD pipeline, validate, build and deploy the application with it
- [ ] Create production-ready Docker image

## Future improvements

- Replace underlying server with fastify
- Integrate user management and authentication
- Use RPC for inter-service communication
- Make external api calls in a way that it respects the rate limit

## Folder structure

- [apps/](./advanced-stock-price-checker/apps) - contains the main applications
  - [api/](./advanced-stock-price-checker/apps/api) - public service to provide endpoints for the stock price checker
  - [stock-checker/](./advanced-stock-price-checker/apps/stock-checker) - background service to fetch stock data
- [libs/](./advanced-stock-price-checker/libs) - contains the shared libraries
  - [common/](./advanced-stock-price-checker/libs/common) - contains the shared DTOs, interfaces, and enums
  - [database/](./advanced-stock-price-checker/libs/database) - contains the database access layer
  - [finnhub/](./advanced-stock-price-checker/libs/finnhub) - contains the Finnhub API client
- [node_modules/](./advanced-stock-price-checker/node_modules) - contains the node modules
- [prisma/](./advanced-stock-price-checker/prisma) - contains the database schema and migrations
  - [migrations/](./advanced-stock-price-checker/prisma/migrations) - contains the database migrations
  - [schema.prisma](./advanced-stock-price-checker/prisma/schema.prisma) - contains the database schema (tables, relations, etc.)
- [.env.example](./advanced-stock-price-checker/.env.example) - contains the example environment variables. Copy it to `.env.local` and fill it with the missing credentials.
- [.envrc](./advanced-stock-price-checker/.envrc) - apply project specific environment variables (e.g. node version)
- [Dockerfile](./advanced-stock-price-checker/Dockerfile) - unified Dockerfile for the api and stock-checker services
- [docker-compose.yml](./advanced-stock-price-checker/docker-compose.yml) - contains the configuration for the development environment

## Installation

The codebase can be made ready for development by the following steps:

1. **Provide environment <sup>(optional)</sup>**

   The application is powered by the following:

   - Node.js 20.x | Install [manually](https://nodejs.org/dist/latest-v20.x/docs/api/) or with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
   - Yarn 3.x | [Installation Guide](https://classic.yarnpkg.com/lang/en/docs/install/)
   - Docker | [Installation Guide](https://docs.docker.com/get-docker/)

2. **Clone repository**

   Clone the repository

   ```bash
   git clone git@github.com:csakbalint/stock-price-checker.git
   # or
   git clone https://github.com/csakbalint/stock-price-checker.git
   ```

3. **Setup environment variables**

   Copy the `.env.example` and create a new file called `.env.local`

   ℹ️ Ask me for the missing credentials if you cannot get them.

4. **Install dependencies**

   Simply execute the following command in order to get the necessary node modules

   ```
   yarn install
   ```

5. **Start the environment**

   The software needs external resources to operate correctly. Execute the following command to start it.

   ```
   docker-compose up -d db redis
   ```

   ℹ️ I recommend to use the `-d` flag to run these containers in the background.

6. **Launch bullboard <sup>(optional)</sup>**

   Bullboard is a dashboard for Bull, a Redis-based queue for Node.js. It is used to monitor the background jobs. You can access it on the http://localhost:4000.

7. **Launch the application**

   In order to launch the application call the following command.

   ```
   docker-compose up api stock-checker
   ```

   ℹ️ The application will be hosted on the http://localhost:3000.

   🎉 Done! You are ready to go!
