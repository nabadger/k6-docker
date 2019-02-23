# Overview

Uses [k6](https://k6.io/) to perform tests against urls defined in a `json` file.

This can be used for post-deployment tests (i.e. is the site up) and also load-tests.

The domain is configurable separate from the URLs that we test - enables testing across dev/staging/prod which tend to have different domains.

# Usage

Edit `./scripts/url-paths.json` 

```json
[
	"/healthz",
	"/readiness",
	"/some-404-which-results-in-error"
]
```
Now run it - be sure to set the `HOSTNAME` environment variable.

Note that we just append the url to the hostname.

```
docker-compose run -e HOSTNAME=https://<some-domain> -v $(pwd)/scripts:/scripts k6 run /scripts/http_get.js
```