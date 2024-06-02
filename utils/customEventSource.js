import RNEventSource from 'react-native-event-source';

class CustomEventSource {
  constructor(url, options) {
    this.url = url;
    this.options = options;
    this.eventSource = null;
    this.listeners = {};

    this.init();
  }

  init() {
    const headers = this.options.headers || {};

    this.eventSource = new RNEventSource(this.url, {
      headers,
    });

    this.eventSource.onmessage = (event) => {
      this.dispatchEvent('message', event);
    };

    this.eventSource.onerror = (event) => {
      this.dispatchEvent('error', event);
    };

    this.eventSource.onopen = (event) => {
      this.dispatchEvent('open', event);
    };
  }

  addEventListener(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  removeEventListener(type, listener) {
    if (!this.listeners[type]) return;

    const index = this.listeners[type].indexOf(listener);
    if (index > -1) {
      this.listeners[type].splice(index, 1);
    }
  }

  dispatchEvent(type, event) {
    if (!this.listeners[type]) return;

    this.listeners[type].forEach((listener) => listener(event));
  }

  close() {
    this.eventSource.close();
  }
}

export default CustomEventSource;
