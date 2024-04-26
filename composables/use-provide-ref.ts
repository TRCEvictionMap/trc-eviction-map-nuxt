
function useProvideRef<T>(name: string, value: T) {
  const data = ref(value);

  provide(name, value);

  return data;
}

export { useProvideRef };
