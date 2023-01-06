#!/bin/bash

export NODE_ENV="development"
export CONSOLA_LEVEL=5

node --loader ts-node/esm --no-warnings --watch ./src
