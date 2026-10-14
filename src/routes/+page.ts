import { resolve } from "$app/paths"

export async function load({ fetch }) {
    return { jsons: await (await fetch(resolve('/data/index.json'))).json()};
}