# bh-tech-test

This is a project created for BH Technologies' candidate technical test.
It's a full stack application composed of a NestJS backend, an Angular frontend,
a MariaDB database and a RabbitMQ message broker.

## Setup guide

To start this project, you will need Docker with the Docker Compose plugin
installed on your computer.

Then, copy the `.env.example` file in the root of the project
to a new file called `.env` in the same directory. This file contains env vars used by
the compose.yaml file. You can change the values within the `.env` file as you see fit,
but there are sane defaults already defined.

Once this is done simply run `docker compose up` in your terminal and everything will
start up!

Here's a quick-start TL;DR command block to start everything up:
```
cp ./env.example ./env
docker compose up
```
You can add the `-d` argument to the `docker compose` command if you want the
containers to run in the background.

## Last words

I didn't have time to finish everything in the way I wanted. Here's a few drawbacks to the current implementation :
- There is no websocket implementation, instead, data is polled periodically
- The UI isn't super nice (but it's usable)
- There aren't many tests in place