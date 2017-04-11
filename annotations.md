# Annotations

## Add annotations with curl
  curl -X POST http://\<ip>:\<port>/events/ -d '{"what": "Title", "tags": ["tag"], "data" : "data"}'
  - what: title
  - tags: add tags
  - data: data
  - when: time(unix timestamp). when is an optional key which is set to the current Unix timestamp if when is not set.
  Source: http://graphite.readthedocs.io/en/latest/events.html

## Add annotations in grafana
  1. To open the annotations panel, click the settings icon in the top bar and select Annotations.
  2. Set the datasource to ‘you source’ and use the ‘Graphite event tags’ input box to filter by tags.
  - Individual wildcards also work to display all events.
  Source: https://www.hostedgraphite.com/docs/advanced/annotations-and-events.html#grafana-annotations
