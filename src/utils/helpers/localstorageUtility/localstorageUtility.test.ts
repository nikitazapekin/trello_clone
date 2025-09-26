import { expect } from "@jest/globals";

import { LocalstorageUtils, STORAGE_KEYS } from "./localstorageUtility";

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("LocalstorageUtils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("setItem", () => {
    it("should store string value in localStorage", () => {
      const key = STORAGE_KEYS.ACCESS_TOKEN;
      const value = "test value";

      LocalstorageUtils.setItem(key, value);
      const storedValue = localStorage.getItem(key);

      expect(storedValue).toBe(JSON.stringify(value));
    });

    it("should store object value in localStorage", () => {
      const key = STORAGE_KEYS.ACCESS_TOKEN;
      const value = { name: "test", id: 123 };

      LocalstorageUtils.setItem(key, value);
      const storedValue = localStorage.getItem(key);

      expect(storedValue).toBe(JSON.stringify(value));
    });

    it("should throw error when localStorage fails", () => {
      jest.spyOn(localStorage, "setItem").mockImplementation(() => {
        throw new Error("Mock error");
      });

      const key = STORAGE_KEYS.ACCESS_TOKEN;
      const value = "test value";

      expect(() => LocalstorageUtils.setItem(key, value)).toThrow("Localstorage error");
    });
  });

  describe("getItem", () => {
    it("should retrieve string value from localStorage", () => {
      const key = STORAGE_KEYS.ACCESS_TOKEN;
      const value = "test value";

      localStorage.setItem(key, JSON.stringify(value));

      const result = LocalstorageUtils.getItem<string>(key);

      expect(result).toBe(value);
    });

    it("should retrieve object value from localStorage", () => {
      const key = STORAGE_KEYS.ACCESS_TOKEN;
      const value = { name: "test", id: 123 };

      localStorage.setItem(key, JSON.stringify(value));

      const result = LocalstorageUtils.getItem<typeof value>(key);

      expect(result).toEqual(value);
    });
  });

  describe("removeItem", () => {
    it("should remove item from localStorage", () => {
      const key = STORAGE_KEYS.ACCESS_TOKEN;

      localStorage.setItem(key, "test value");

      LocalstorageUtils.removeItem(key);
      const result = localStorage.getItem(key);

      expect(result).toBeNull();
    });
  });

  describe("clear", () => {
    it("should clear all items from localStorage", () => {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, "test value 1");
      localStorage.setItem("another-key", "test value 2");
      LocalstorageUtils.clear();
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
      expect(localStorage.getItem("another-key")).toBeNull();
    });
  });
});
