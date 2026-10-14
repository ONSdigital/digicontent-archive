async function load({ fetch }) {
  return { jsons: await (await fetch("/data/index.json")).json() };
}
export {
  load
};
