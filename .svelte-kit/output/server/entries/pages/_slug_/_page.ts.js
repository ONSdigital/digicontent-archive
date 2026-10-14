import { error } from "@sveltejs/kit";
async function load({ params, fetch }) {
  const path = `https://cdn.jsdelivr.net/gh/ONSdigital/digicontent-archive@main/_scraped_jsons/${params.slug}.json`;
  try {
    const page = await (await fetch(path)).json();
    return {
      page
    };
  } catch {
    error(404, "Page not found");
  }
}
export {
  load
};
