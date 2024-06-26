
function assertUnref<T>(r: Ref<T>) {
  if (typeof r.value === "undefined") {
    throw new Error("[assertGetRefValue] ref.value is undefined");
  }
  return r.value;
}

export { assertUnref };