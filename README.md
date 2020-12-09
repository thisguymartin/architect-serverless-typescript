# architect-serverless-typescript 🏗λ


This is a serverless [Architect](https://arc.codes/) framework built in typescript 

> Architect provides everything you need to build fast, modern, massively scalable cloud apps with low code, clear and terse config, zero ceremony, and no lock-in.

## Usage 🔬

_Currently being consumed by these project(s) of mine, will try and keep this list updated_

- [Serverless Weather 🌦](https://github.com/rahman95/serverless-weather)

## Tech 🧰

- Architect
- Typescript
- AWS-SDK
- commitizen
- github actions

## What gets provisioned? 🔍

- API Gateway
- Lambda
- Queue

## Deployment 🚀

- Run `yarn build` to run TSC to compile TS code to plain JS
- Run `yarn start` arc sandbox, then visit `http://localhost:3333` to view your Lambda/queue running locally.
- Run `yarn deploy:arc` deploy to Staging environment.
- Run `yarn deploy:arc-production` deploy to Production environment.
- Run `arc:destroy` destroy a previously-deployed architect app environment. By default, the staging environment of your app is destroyed.
