const createNotification = () => {
  let message: string[] = [];
  let timeoutId = 0;

  function show(time: number, ...msg: string[]) {
    message = msg;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      message = [];
    }, time);
  }

  function toString() {
    return message.length ? message.join(", ") : "";
  }

  return {
    show,
    toString,
  };
};

export const notification = createNotification();
