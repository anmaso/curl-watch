# curl-watch

Repeadtely fetch from url passed as parameter and counts number of occurrences, last occurence and duration of last period

This is useful when monitoring responses from a load balanced service, to observe different responses

Example

```
$ node curl-watch.js http://1.2.3.4/path

http:/1.2.3.4/path
X: 9 responses, last seen 190 secs ago, for 7 seconds
C: 190 responses, last seen 0 secs ago, for 189 seconds
```
