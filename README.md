# Congritta Blockchain Bot

My own implementation of cryptocurrency. I built my own blockchain and implemented it as Telegram Bot

## Features

- Every user has a RSA key for signing their transactions;
- All transactions are based on blockchain;
- Every user's balance is cached in __redis__ for avoiding calculating from blockchain every time;
- When transaction received, user receives a notification

## Difference from real blockchains like Ethereium or Bitcoin

- No mining implemented;
- No blockchain nodes. Whole blockchain is stored in one host

## How to:

__Congfigure__: Copy _src/config.example.ts_ to _src/config.ts_ and fill it as you want\
__Install__: `npm install`\
__Run in production__: `npm run build && npm start`\
__Run for development__: `npm run dev`\
__Run eslint__: `npm run lint`
