## Turplan.no Data API

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/45f2eaf117c1437481c1e31aaff0ac2c)](https://www.codacy.com/app/larsensolutions/turplan-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=larsensolutions/turplan-api&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/45f2eaf117c1437481c1e31aaff0ac2c)](https://www.codacy.com/app/larsensolutions/turplan-api?utm_source=github.com&utm_medium=referral&utm_content=larsensolutions/turplan-api&utm_campaign=Badge_Coverage)

### Purpose of the API
[UT.no](https://ut.no) provides a great service to search for possible hikes in Norway. However, it only provides an overview over the hikes, and it is not possible to plan a hike in details using the app (in a convenient way, anyways). This could be especially useful for multi day hikes.

[UT.no](https://ut.no) uses the [nasjonalturbase.no API](http://www.nasjonalturbase.no/) to store data, which is public and open. Because of this, it is possible to extend [UT.no](https://ut.no) functionality and create a planning tool that can use the hike data already available.

This API should first enable the possiblity to create hike plans. Basically, a plan would give oppertunity to split the hike route into legs (parts) and attach more data like stops along the way, interesting sights etc.

### Getting started

Download [Docker for Mac or Windows.](https://www.docker.com/products/docker)

Run locally

```
$ docker-compose up
```

Run tests
```
docker-compose run api npm run test
```

Run coverage
```
docker-compose run api npm run cover
```
