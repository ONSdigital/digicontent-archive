export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "digicontent-scrape-app/_app",
	assets: new Set([".DS_Store",".nojekyll","data/index.json","favicon.ico","img/header.png","img/og.png","web.config"]),
	mimeTypes: {".json":"application/json",".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.UzNKh25l.js",app:"_app/immutable/entry/app.CZC9F9wL.js",imports:["_app/immutable/entry/start.UzNKh25l.js","_app/immutable/chunks/Boaj8GD2.js","_app/immutable/chunks/DloZk2bM.js","_app/immutable/chunks/OA8UcISh.js","_app/immutable/chunks/M99e0m-r.js","_app/immutable/entry/app.CZC9F9wL.js","_app/immutable/chunks/9t48UgFk.js","_app/immutable/chunks/DloZk2bM.js","_app/immutable/chunks/35LKct3p.js","_app/immutable/chunks/CKiOfQcS.js","_app/immutable/chunks/M99e0m-r.js","_app/immutable/chunks/B7jLh2fa.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/[slug]",
				pattern: /^\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
