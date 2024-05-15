
function useProvideRef<T>(name: string, value: T) {
  const data = ref(value);

  provide(name, data);

  return data;
}

function useProvideComputed<T>(name: string, getter: () => T) {
  const data = computed(getter);

  provide(name, data);

  return data;
}

export { useProvideRef, useProvideComputed };
