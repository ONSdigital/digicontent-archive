import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.mEjKANd2.js","_app/immutable/chunks/CKiOfQcS.js","_app/immutable/chunks/DloZk2bM.js","_app/immutable/chunks/BxCa-W6P.js"];
export const stylesheets = ["_app/immutable/assets/0.wq4TLG83.css"];
export const fonts = [];
