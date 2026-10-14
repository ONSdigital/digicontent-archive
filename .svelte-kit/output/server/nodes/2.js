import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.Dkdj_27J.js","_app/immutable/chunks/CKiOfQcS.js","_app/immutable/chunks/DloZk2bM.js","_app/immutable/chunks/35LKct3p.js","_app/immutable/chunks/CLgYRCs_.js","_app/immutable/chunks/BxCa-W6P.js","_app/immutable/chunks/M99e0m-r.js","_app/immutable/chunks/B7jLh2fa.js","_app/immutable/chunks/PWRr9wVZ.js"];
export const stylesheets = ["_app/immutable/assets/Em.dD3xOaEF.css","_app/immutable/assets/2.CA9Ke76F.css"];
export const fonts = [];
