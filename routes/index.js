const { RichEmbed } = require("discord.js");

const {
  runner: wotdRunner,
  render: wotdRender
} = require("../commands/fun/wotd");

const {
  runner: hnRunner,
  getEmbeds: hnGetEmbeds
} = require("../commands/utility/hacker-news");

const { runner: doraemonRunner } = require("../commands/fun/doraemon-today");

const { runner: jokeRunner } = require("../commands/fun/joke");

const {
  runner: jsTrendingRunner,
  render: jsTrendingRender
} = require("../commands/utility/javascript-trending");

const {
  runner: steamDealsRunner,
  render: steamDealsRender
} = require("../commands/utility/steam-deals");

const {
  runner: randomAnimeRunner,
  render: randomAnimeRender
} = require("../commands/utility/random-anime");

const {
  runner: disboardStatusRunner,
  render: disboardStatusRender
} = require("../commands/utility/disboard-status");

const {
  runner: netflixRecommenderRunner,
  render: netflixRecommenderRender
} = require("../commands/utility/netflix-recommender");

const {
  WOTD_CHANNEL_ID,
  WOTD_KEY,
  HN_CHANNEL_ID,
  HN_KEY,
  JT_CHANNEL_ID,
  JT_KEY,
  SD_CHANNEL_ID,
  SD_KEY,
  RA_CHANNEL_ID,
  RA_KEY,
  NR_CHANNEL_ID,
  NR_KEY,
  DS_CHANNEL_ID,
  DS_KEY
} = process.env;

const root = (req, res) => {
  res.render("index");
};

const joke = async (req, res) => {
  const { setup, punchline } = await jokeRunner();

  res.render("joke", { description: `${setup} ${punchline}` });
};

const doraemon = async (req, res) => {
  const { image, description } = await doraemonRunner();
  res.render("doraemon", { image, description });
};

const javascript_trending = async (req, res, client) => {
  if (req.query.key === JT_KEY) {
    const result = await jsTrendingRunner();

    client.channels
      .get(JT_CHANNEL_ID)
      .send(
        new RichEmbed()
          .setColor(`#ff6600`)
          .setDescription(`**Trending Javascript Repositories Today**`)
      );

    jsTrendingRender(result).forEach(value => {
      client.channels
        .get(JT_CHANNEL_ID)
        .send(new RichEmbed().setColor(`#008000`).setDescription(value));
    });

    return client.channels
      .get(JT_CHANNEL_ID)
      .send(
        new RichEmbed()
          .setColor(`#ff6600`)
          .setTimestamp()
          .setFooter(`Source: Github Trending`)
      )
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
};

const steam_deals = async (req, res, client) => {
  if (req.query.key === SD_KEY) {
    const result = await steamDealsRunner();

    if (result && result.titles && result.titles.length) {
      client.channels
        .get(SD_CHANNEL_ID)
        .send(
          new RichEmbed()
            .setColor(`#ff6600`)
            .setDescription(`**STEAM Deals Today**`)
        );

      steamDealsRender(result).forEach(({ footer, thumbnail, description }) => {
        client.channels.get(SD_CHANNEL_ID).send(
          new RichEmbed()
            .setColor(`#008000`)
            .setFooter(footer)
            .setImage(thumbnail)
            .setDescription(description)
        );
      });

      return client.channels
        .get(SD_CHANNEL_ID)
        .send(
          new RichEmbed()
            .setColor(`#ff6600`)
            .setTimestamp()
            .setFooter(`Source: gg.deals`)
        )
        .then(() => {
          res.sendStatus(200);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    } else {
      return client.channels
        .get(SD_CHANNEL_ID)
        .send(
          new RichEmbed()
            .setColor(`#ff6600`)
            .setDescription("Unfortunately there are no deals for today :(")
        )
        .then(() => {
          res.sendStatus(200);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    }
  } else {
    res.sendStatus(400);
  }
};

const wotd = async (req, res, client) => {
  if (req.query.key === WOTD_KEY) {
    const _wotd = await wotdRunner();

    return client.channels
      .get(WOTD_CHANNEL_ID)
      .send(wotdRender(_wotd))
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
};

const random_anime = async (req, res, client) => {
  if (req.query.key === RA_KEY) {
    const animeInfo = await randomAnimeRunner();

    return client.channels
      .get(RA_CHANNEL_ID)
      .send(
        new RichEmbed()
          .setColor(`RANDOM`)
          .attachFiles([animeInfo.thumbnail])
          .setDescription(randomAnimeRender(animeInfo))
          .setFooter(animeInfo.description)
      )
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
};

const netflix_recommender = async (req, res, client) => {
  if (req.query.key === NR_KEY) {
    const jsonRes = await netflixRecommenderRunner();

    const imgSrc = `https://img.reelgood.com/content/movie/${jsonRes.id}/poster-780.jpg`;

    return client.channels
      .get(NR_CHANNEL_ID)
      .send(
        new RichEmbed()
          .setColor(`RANDOM`)
          .setTitle(jsonRes.title)
          .attachFiles([imgSrc])
          .setDescription(netflixRecommenderRender(jsonRes))
      )
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
};

const hn = async (req, res, client) => {
  if (req.query.key === HN_KEY) {
    const titles = await hnRunner();

    client.channels
      .get(HN_CHANNEL_ID)
      .send(hnGetEmbeds(titles).one)
      .catch(() => {
        res.sendStatus(500);
      });

    client.channels
      .get(HN_CHANNEL_ID)
      .send(hnGetEmbeds(titles).two)
      .catch(() => {
        res.sendStatus(500);
      });

    return client.channels
      .get(HN_CHANNEL_ID)
      .send(hnGetEmbeds(titles).three)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
};

const disboard_status = async (req, res, client) => {
  if (req.query.key === DS_KEY) {
    const { text, ready } = await disboardStatusRunner();

    if (ready) {
      return client.channels
        .get(DS_CHANNEL_ID)
        .send(disboardStatusRender({ text, ready }))
        .then(() => {
          res.sendStatus(200);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    } else {
      res.sendStatus(200);
    }
  } else {
    res.sendStatus(400);
  }
};

module.exports = {
  root,
  wotd,
  hn,
  joke,
  javascript_trending,
  steam_deals,
  random_anime,
  disboard_status,
  netflix_recommender,
  doraemon
};
