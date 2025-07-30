import React from "react";

export type Keys =
    | "title"
    | "content"
    | "tags"
    | "summary"
    | "draft"
    | "alias"
    | "listed"
    | "preview";

const keys: Keys[] = [
    "title",
    "content",
    "tags",
    "summary",
    "draft",
    "alias",
    "listed",
    "preview",
];

const VERSION_KEY = "__version__";
const CURRENT_VERSION = "v2";  // 改这里来手动升级版本（强制清缓存）

export class Cache {
    static with(id?: number) {
        return new Cache(id);
    }

    private id: string;

    constructor(id?: number) {
        this.id = `${id ?? "new"}`;
        this.ensureVersion();
    }

    private ensureVersion() {
        const versionKey = `${this.id}/${VERSION_KEY}`;
        const savedVersion = localStorage.getItem(versionKey);
        if (savedVersion !== CURRENT_VERSION) {
            this.clear();  // 清除旧缓存
            localStorage.setItem(versionKey, CURRENT_VERSION);
        }
    }

    public get(key: Keys) {
        return localStorage.getItem(`${this.id}/${key}`);
    }

    public set(key: Keys, value: string) {
        if (value === "") localStorage.removeItem(`${this.id}/${key}`);
        else localStorage.setItem(`${this.id}/${key}`, value);
    }

    public clear() {
        keys.forEach((key) => {
            localStorage.removeItem(`${this.id}/${key}`);
        });
        localStorage.removeItem(`${this.id}/${VERSION_KEY}`);
    }

    public bumpVersion() {
        localStorage.setItem(`${this.id}/${VERSION_KEY}`, CURRENT_VERSION);
    }

    public useCache<T>(key: Keys, initialValue: T) {
        const [value, setValue] = React.useState<T>(this.get(key) as T ?? initialValue);
        const setCache = (value: T) => {
            this.set(key, value as string);
            setValue(value);
        };
        return [value, setCache] as const;
    }
}

export function useCache<T>(key: Keys, initialValue: T) {
    return new Cache().useCache(key, initialValue);
}
