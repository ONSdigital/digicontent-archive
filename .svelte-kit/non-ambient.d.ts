
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/[slug]";
		RouteParams(): {
			"/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { slug?: string };
			"/[slug]": { slug: string }
		};
		Pathname(): "/" | `/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/.nojekyll" | "/data/chartbuilder_imgs/309cb5d6.png" | "/data/chartbuilder_imgs/58c9d16f.png" | "/data/chartbuilder_imgs/6417dc19.png" | "/data/chartbuilder_imgs/6b681373.png" | "/data/chartbuilder_imgs/91763b25.png" | "/data/chartbuilder_imgs/d4b73af4.png" | "/data/index.json" | "/data/scraped_jsons/a-million-fewer-people-are-gaining-health-benefits-from-nature-since-2020.json" | "/data/scraped_jsons/baby-names-since-1904-how-has-yours-performed.json" | "/data/scraped_jsons/gdp-and-events-in-history-how-the-covid-19-pandemic-shocked-the-uk-economy.json" | "/data/scraped_jsons/how-popular-is-your-birthday.json" | "/data/scraped_jsons/the-uk-contribution-to-the-eu-budget.json" | "/data/scraped_jsons/uk-population-pyramid-interactive.json" | "/data/scraped_jsons/understanding-ai-uptake-and-sentiment-among-people-and-businesses-in-the-uk-june-2023.json" | "/favicon.ico" | "/img/header.png" | "/img/og.png" | "/web.config" | string & {};
	}
}