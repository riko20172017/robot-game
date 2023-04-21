class Resources {
    resourceCache: any;
    readyCallbacks: any[];
    constructor() {
        this.resourceCache = {};
        this.readyCallbacks = [];

        (<any>window).resources = this
    }

    // Load an image url or an array of image urls
    load(arrOfUrl: string[]) {
        if (arrOfUrl instanceof Array) {
            arrOfUrl.forEach(function (this: Resources, url: string) {
                this._load(url);
            }, this);
        }
        else {
            this._load(arrOfUrl);
        }
    }

    _load(url: string) {
        if (this.resourceCache[url]) {
            return this.resourceCache[url];
        }
        else {
            let self = this
            var img = new Image();
            img.onload = function () {
                self.resourceCache[url] = img;

                if (self.isReady()) {
                    self.readyCallbacks.forEach(function (func) { func(); });
                }
            };
            this.resourceCache[url] = false;
            img.src = url;
        }
    }

    get(url: string) {
        return this.resourceCache[url];
    }

    isReady() {
        var ready = true;
        for (var k in this.resourceCache) {
            if (this.resourceCache.hasOwnProperty(k) &&
                !this.resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    onReady(func: Function) {
        this.readyCallbacks.push(func);
    }
}

export default Resources