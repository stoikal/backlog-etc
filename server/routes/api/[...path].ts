export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || "";

  const query = getQuery(event);
  const base = useRuntimeConfig(event).apiProxyTarget;
  const url = new URL(base + "/" + path);
  Object.entries(query).forEach(([key, val]) => {
    if (val !== undefined) url.searchParams.set(key, String(val));
  });

  return proxyRequest(event, url.toString());
});
