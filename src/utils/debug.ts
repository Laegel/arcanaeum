export const log =
  () =>
  (target: any, key: string | symbol, descriptor: PropertyDescriptor): any => {
    const childFunction = descriptor.value;
    descriptor.value = function(...args: any[]) {
      if (true) {
        console.debug(target, args);
      }
      const result = childFunction.apply(this, args);
      if (true) {
        console.debug(result);
      }
      return result;
    };
    return descriptor;
  };
