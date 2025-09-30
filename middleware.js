let counter = 0;

export function counterMiddleware(req, res, next) {
  counter++;
  req.counter = counter;
  next();
}

export function loggerMiddleware(req, res, next) {
  const counter = req.counter || 0;
  const method = req.method.toUpperCase();
  const path = req.path;
  const query = isEmpty(req.query) ? "" : JSON.stringify(req.query);
  const body = isEmpty(req.body) ? "" : JSON.stringify(req.body);

  console.log(`${counter}) ${method} ${path} ${query} ${body}`);
  next();
}

const isEmpty = (obj) => {
  if (!obj) {
    return true;
  }
  return Object.keys(obj).length === 0;
};
