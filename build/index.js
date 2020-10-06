"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
const lodash_1 = __importDefault(require("lodash"));
const timers = new Map();
class Timer {
    constructor(id) {
        this.id = id;
        this.milliseconds = 0;
        this.debounceExecute = (...args) => {
            if (this.id) {
                timers.delete(this.id);
            }
            return this.debounceCallback(...args);
        };
        this.type = "timeout";
    }
    debounce(callback, wait) {
        if (!this.lDebounce) {
            this.debounceCallback = callback;
            this.lDebounce = lodash_1.default.debounce(this.debounceExecute, wait);
        }
        return this.lDebounce;
    }
    clear() {
        if (!this.nodeTimeout) {
            return this;
        }
        if (this.type === "timeout") {
            clearTimeout(this.nodeTimeout);
        }
        else {
            clearInterval(this.nodeTimeout);
        }
        return this;
    }
    destroy() {
        this.clear();
        if (this.id) {
            timers.delete(this.id);
        }
    }
    interval(callback) {
        this.nodeTimeout = setInterval(callback.bind(this, this), this.milliseconds);
        this.type = "interval";
        return this;
    }
    wait(milliseconds) {
        this.milliseconds = milliseconds;
        return this;
    }
    then(callback) {
        setTimeout(callback, this.milliseconds);
        return this;
    }
    catch(callback) {
        this.catchCallback = callback;
        return this;
    }
}
exports.Timer = Timer;
exports.default = (id) => {
    if (!id) {
        return new Timer();
    }
    if (timers.has(id)) {
        return timers.get(id);
    }
    const t = new Timer(id);
    timers.set(id, t);
    return t;
};
