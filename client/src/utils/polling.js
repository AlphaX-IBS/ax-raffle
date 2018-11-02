export const poll = async (fn, time) => {
  await fn();
  // console.log(time);
  return setTimeout(() => poll(fn, time), time);
};

export const sleep = ms =>
  new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(ms);
    }, ms);
  });
