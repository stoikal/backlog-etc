export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || "";

  const query = getQuery(event);
  const url = new URL("http://127.0.0.1:8080/api/v1/" + path);
  console.log(url.toString())
  Object.entries(query).forEach(([key, val]) => {
    if (val !== undefined) url.searchParams.set(key, String(val));
  });

  return proxyRequest(event, url.toString());
});
