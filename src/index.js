import { request } from 'xhr-stream-dl';


class Api {

  constructor(server) {
    this.cmd = Command;
    this._server = 'http://' + server;
  }

  alignmentHeader(url) {
    return new Command(this._server, 'alignmentHeader', { url });
  }

  baiReadDepth(url) {
    return new Command(this._server, 'baiReadDepth', { url });
  }

  craiReadDepth(url) {
    return new Command(this._server, 'craiReadDepth', { url });
  }

  alignmentStatsStream(url, regions) {

    //const regArr = regions.map(function(d) { return d.name+ ":"+ d.start + '-' + d.end;});
    //const regStr = JSON.stringify(regions.map(function(d) { return {start:d.start,end:d.end,chr:d.name};}));
    return new Command(this._server, 'alignmentStatsStream', { url, regions: JSON.stringify(regions) });
  }
}


class Command {
  constructor(server, endpoint, params) {

    this._server = server;
    this._endpoint = endpoint;
    this._params = params;

    this._callbacks = {
      'data': null,
      'end': null,
      'error': null,
      'queue': null,
      'exit': null,
    };
  }

  on(eventName, callback) {
    if (this._callbacks[eventName] !== undefined) {
      this._callbacks[eventName] = callback;
    }
    else {
      const valid = Object.keys(this._callbacks).join(', ');
      throw new Error(`Invalid event name "${eventName}". Valid options are [${valid}]`);
    }
  }

  off(eventName) {
    delete this._callbacks[eventName];
  }

  run() {
    const query = encodeURI(this._server + '/' + this._endpoint + encodeParams(this._params));
    //console.log(query);
    this._stream = request(query);

    this._stream.onData(this._callbacks['data']);
    this._stream.onEnd(this._callbacks['end']);
    this._stream.onError(this._callbacks['error']);
  }
}


function encodeParams(obj) {

  const keys = Object.keys(obj);

  const params = Object.keys(obj).map((key, i) => {
    let sep = '&';
    if (i === 0) {
      sep = '?';
    }

    // TODO: might need this
    //let value = encodeURIComponent(String(obj[key]));
    const value = String(obj[key]);

    return sep + key + '=' + value;
  });

  return params.join('');
}


export {
  Api,
};
