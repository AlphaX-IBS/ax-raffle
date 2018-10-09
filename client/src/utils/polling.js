export const poll = async (fn, time) => {
  await fn();
  console.log(time);
  setTimeout(() => poll(fn, time), time);
};

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));