# pokeapi

Another fun little project done when I was a little bored. Scraped the pokeApi for a bunch of pokemon, setup a quick and dirty apollo-server instance, and does some in memory manipulation of all of the pokemon for querying.

### running

You likely won't have to do the first step of scraping as I've already done that, and pokemon data doesn't really change.

```sh
npm scrape
```

When that's done you should be able to run the following and visit `localhost:4000/graphql` to start querying.

```sh
npm start
```
