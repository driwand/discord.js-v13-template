# Discord.JS V13 Template

This template is using SQLite (with TypeOrm) as database for the bot settings.

## Used Packages And Environment

 - [DiscordJs >=v13](https://discord.js.org/#/)
 - [NodeJs >=16](https://nodejs.org/en/)
 - [TypeScript >=4.5.5](https://www.npmjs.com/package/typescript)

## Configuration File

Create .env with the following variables

```
  BOT_OWNER_IDS=123456,654321
  BOT_TOKEN=botToken
```

## Usage

To run the bot for production

```bash
  npm run start:prod
```

For background production

```bash
  npm run pm2
```

Run for development

```bash
  npm run start:dev
```

## License

[MIT](https://github.com/driwand/discord.js-v13-template/blob/main/LICENCE)
