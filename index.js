let URL = process.argv[2];
if (!URL.startsWith('http') ) {
    URL = 'http://' + URL;
}

const timeDiff = (t2, t1) => Math.floor((t2 - t1) / 1000);

class ResponseMonitor {
  constructor(url) {
    this.url = url;
    this.history = [];
    this.lastResponse = null;
    this.responseCounts = new Map();
    this.responses = new Map();
  }

  async fetchOrError(url) {
    try {
      const response = await fetch(this.url);
      const body = await response.text();
      return body.trim();
    } catch (error) {
      return "<error>";
    }
  }

  async cycle() {
    const body = await this.fetchOrError(this.url);

    let differentResponse;
    if (this.lastResponse != body) {
      differentResponse = new Date().getTime();
    }
    this.updateResponseCount(body, differentResponse);
    this.lastResponse = body;
    this.displayResponseCounts();
  }
  async start() {
    setInterval(this.cycle.bind(this), 1000);
  }

  updateResponseCount(responseBody, differentResponseTime) {
    const response = this.responses.get(responseBody) || { count: 0, firstSeen: new Date().getTime() };
    if (differentResponseTime) {
      response.firstSeen = differentResponseTime;
    }
    response.count += 1;
    response.lastSeen = new Date().getTime();
    this.responses.set(responseBody, response);
  }

  displayResponseCounts() {
    console.log(URL);
    for (const [responseBody, response] of this.responses) {
      const displayResponse = `${responseBody.substring(0, 50)}${responseBody.length > 50 ? "..." : ""}`;
      const time = new Date().getTime();
      const ago = timeDiff(time, response.lastSeen);
      const duration = timeDiff(response.lastSeen, response.firstSeen);
      console.log(
        `${displayResponse}: ${response.count} responses, last seen ${ago} secs ago, for ${duration} seconds`,
      );
    }
    console.log("\n");
  }
}

const monitor = new ResponseMonitor(URL);
monitor.start();
