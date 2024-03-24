
interface Stored<Value> {
  value: Value;
}

function useLocalStorage<Value>(key: string, defaultValue: Value) {
  const data = ref<Value>(init());

  function init() {
    try {
      const stored = localStorage.getItem(key) as string;
      const { value } = JSON.parse(stored) as Stored<Value>;
      return value;
    } catch (_error) {
      // If the stored value is altered by a user action in developer tools
      // or by a other code and violates the `Stored<Value>` contract,
      // the possible ensuing error will be caught and handled by using the
      // provided `defaultValue` argument.
      localStorage.setItem(key, JSON.stringify({ value: defaultValue }));
      return defaultValue;
    }
  }

  return computed({
    get() {
      return data.value as Value;
    },
    set(value: Value) {
      (data.value as any) = value;
      localStorage.setItem(key, JSON.stringify({ value }));
    },
  });
}

export { useLocalStorage };
