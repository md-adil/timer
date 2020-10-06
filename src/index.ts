import _ from "lodash";

const timers: Map<string, Timer> = new Map();

export type TimerCallback = (context: Timer) => void;
export type DebounceCallback = (...args: any[]) => any;
export type SuccessCallback<T> = () => PromiseLike<T>;
export type CatchCallback<T> = () => PromiseLike<T>;

export class Timer<T = any> {
    private nodeTimeout?: NodeJS.Timeout;
    private milliseconds = 0;
    private debounceCallback?: DebounceCallback;
    private lDebounce?: any;
    private hasInterval = false;
    private successCallback?: SuccessCallback<T>;

    constructor(private readonly id?: string) {}

    debounce(callback: DebounceCallback) {
        if (!this.lDebounce) {
            this.debounceCallback = callback;
            this.lDebounce = _.debounce(
                this.debounceExecute,
                this.milliseconds
            );
        }
        return this.lDebounce;
    }

    stop() {
        if (this.hasInterval) {
            clearInterval(this.nodeTimeout!);
            if (this.successCallback) {
                this.successCallback();
            }
        } else if (this.nodeTimeout) {
            clearTimeout(this.nodeTimeout);
        }
        return this;
    }

    destroy() {
        this.stop();
        if (this.id) {
            timers.delete(this.id);
        }
    }

    interval(callback: TimerCallback, ...args: any[]) {
        this.hasInterval = true;
        this.nodeTimeout = setInterval(
            callback.bind(this, ...args),
            this.milliseconds
        );
        return this;
    }

    wait(milliseconds: number) {
        this.milliseconds = milliseconds;
        return this;
    }

    private debounceExecute = (...args: any) => {
        if (this.id) {
            timers.delete(this.id);
        }
        return this.debounceCallback!(...args);
    };

    then(callback: SuccessCallback<T>) {
        if (this.hasInterval) {
            this.successCallback = callback;
            return this;
        }
        this.nodeTimeout = setTimeout(callback, this.milliseconds);
        return this;
    }

    catch(callback: CatchCallback<Error>) {
        return this;
    }
}

export default <T = any>(id?: string): Timer<T> => {
    if (!id) {
        return new Timer();
    }
    if (timers.has(id)) {
        return timers.get(id)!;
    }

    const t = new Timer(id);
    timers.set(id, t);
    return t;
};
