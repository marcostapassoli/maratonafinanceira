globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { t as FastResponse } from "./_libs/srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs").then((n) => n.t)) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.svg": {
		"type": "image/svg+xml",
		"etag": "\"c7-mVPe6jgqDR/uVVUjO6x0ykTguLk\"",
		"mtime": "2026-08-26T23:57:22.277Z",
		"size": 199,
		"path": "../public/favicon.svg"
	},
	"/assets/CurrencyInput-CCNSvdc0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e3-jGjkH+FBanjAGwIc1CL5OaQ0Crs\"",
		"mtime": "2026-08-26T23:57:15.039Z",
		"size": 995,
		"path": "../public/assets/CurrencyInput-CCNSvdc0.js"
	},
	"/assets/MetaExplain-JpCmOQ7X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b04-c1r2xrGpyypsC3MQ/IraOKXoBGE\"",
		"mtime": "2026-08-26T23:57:15.040Z",
		"size": 2820,
		"path": "../public/assets/MetaExplain-JpCmOQ7X.js"
	},
	"/assets/PaceCard-CiJKUjPu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1276-P27YfC2HZz0V5qwbbEYoicYCTkc\"",
		"mtime": "2026-08-26T23:57:15.041Z",
		"size": 4726,
		"path": "../public/assets/PaceCard-CiJKUjPu.js"
	},
	"/assets/arrow-right-Tz2vwARX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-uGZCODoIQs2YsGRzRntAAcBIGKc\"",
		"mtime": "2026-08-26T23:57:15.049Z",
		"size": 165,
		"path": "../public/assets/arrow-right-Tz2vwARX.js"
	},
	"/assets/atualizar-C239q5uY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2616-XPTRtDde+yg+zTAwia5ueSE/IoU\"",
		"mtime": "2026-08-26T23:57:15.051Z",
		"size": 9750,
		"path": "../public/assets/atualizar-C239q5uY.js"
	},
	"/assets/auth-BREgt6g3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2368-7O5uNsrkiYaaw29RSBtGVrJ8p74\"",
		"mtime": "2026-08-26T23:57:15.058Z",
		"size": 9064,
		"path": "../public/assets/auth-BREgt6g3.js"
	},
	"/assets/cenarios-C21MWnU-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61c72-4pp6GPm843jua7lFRG+BDke9Bas\"",
		"mtime": "2026-08-26T23:57:15.060Z",
		"size": 400498,
		"path": "../public/assets/cenarios-C21MWnU-.js"
	},
	"/assets/configuracoes-DKJ0pzQd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b90-VGlmSPkCikLouYx6quS3LZPiMzw\"",
		"mtime": "2026-08-26T23:57:15.062Z",
		"size": 19344,
		"path": "../public/assets/configuracoes-DKJ0pzQd.js"
	},
	"/assets/createLucideIcon-DLXC7Pi_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"33c0-4vXx0eLM+x8gJ0r8oPk+WxwcPnM\"",
		"mtime": "2026-08-26T23:57:15.063Z",
		"size": 13248,
		"path": "../public/assets/createLucideIcon-DLXC7Pi_.js"
	},
	"/assets/dialog-DAwkYDRl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"756f-5UQvW+eNTtwCznPrwr4amZYoK/Y\"",
		"mtime": "2026-08-26T23:57:15.066Z",
		"size": 30063,
		"path": "../public/assets/dialog-DAwkYDRl.js"
	},
	"/assets/dist-BBqinpdx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10c6-bLxjp7G/MzI60A4i+3CGx7pxgzw\"",
		"mtime": "2026-08-26T23:57:15.068Z",
		"size": 4294,
		"path": "../public/assets/dist-BBqinpdx.js"
	},
	"/assets/dist-Cjn3I6zt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a4-4xNSpd3s0ZAD9ltfXEOTs0njD2k\"",
		"mtime": "2026-08-26T23:57:15.076Z",
		"size": 420,
		"path": "../public/assets/dist-Cjn3I6zt.js"
	},
	"/assets/historico-CyvkcTKQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"37ca-eExAv9k6TIIQjZbZhu9Dx1UPoT8\"",
		"mtime": "2026-08-26T23:57:15.077Z",
		"size": 14282,
		"path": "../public/assets/historico-CyvkcTKQ.js"
	},
	"/assets/index-CpXUW0Db.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6625e-gYgFic3tjoZRLUkRRUpLEngEOSc\"",
		"mtime": "2026-08-26T23:57:15.034Z",
		"size": 418398,
		"path": "../public/assets/index-CpXUW0Db.js"
	},
	"/assets/info-bNVcigwS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cc-HjXbMn8rdcFysZGcve6Y/HZ2Xf4\"",
		"mtime": "2026-08-26T23:57:15.083Z",
		"size": 204,
		"path": "../public/assets/info-bNVcigwS.js"
	},
	"/assets/input-CljtbgqI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fd8-ahV0IzvZB57i+ala2zJqfVZuZ74\"",
		"mtime": "2026-08-26T23:57:15.084Z",
		"size": 4056,
		"path": "../public/assets/input-CljtbgqI.js"
	},
	"/assets/label-DrknXE7j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3de-xH/FbwuLUDkCw+vaxbZWbuti/ag\"",
		"mtime": "2026-08-26T23:57:15.090Z",
		"size": 990,
		"path": "../public/assets/label-DrknXE7j.js"
	},
	"/assets/math-tO60Wy2_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ed2-N/4oqZG2h+0Q2l6yf1Vs+cEmMFk\"",
		"mtime": "2026-08-26T23:57:15.090Z",
		"size": 3794,
		"path": "../public/assets/math-tO60Wy2_.js"
	},
	"/assets/onboarding-YMXT4HQb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"49d7-vzbHc8k59KbECX6aeDkgpKXZBC8\"",
		"mtime": "2026-08-26T23:57:15.094Z",
		"size": 18903,
		"path": "../public/assets/onboarding-YMXT4HQb.js"
	},
	"/assets/privacidade-DUSUaoIl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1179-8SnCdGt7BC98GA5RclvzVNW8wtY\"",
		"mtime": "2026-08-26T23:57:15.097Z",
		"size": 4473,
		"path": "../public/assets/privacidade-DUSUaoIl.js"
	},
	"/assets/routes-Bd_Dv4lC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"36e0-BBNJ/EdKDxPEnBTh11krWDetDWo\"",
		"mtime": "2026-08-26T23:57:15.100Z",
		"size": 14048,
		"path": "../public/assets/routes-Bd_Dv4lC.js"
	},
	"/assets/styles-t1PU_5Tv.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"15e4b-j4MxnHNjaujWFOIePt/YX3dYGV4\"",
		"mtime": "2026-08-26T23:57:15.124Z",
		"size": 89675,
		"path": "../public/assets/styles-t1PU_5Tv.css"
	},
	"/assets/textarea-Cj3k9ly5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"28b-K130TniZI4yIhE/1KM6/4mF8T/I\"",
		"mtime": "2026-08-26T23:57:15.104Z",
		"size": 651,
		"path": "../public/assets/textarea-Cj3k9ly5.js"
	},
	"/assets/trash-2-Cv4JAA5Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-CZ4BadRy/eTpqOWj8zWZ4Nc64WE\"",
		"mtime": "2026-08-26T23:57:15.109Z",
		"size": 328,
		"path": "../public/assets/trash-2-Cv4JAA5Y.js"
	},
	"/assets/triangle-alert-r4ZZqdRT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-Mj0R3UuTKMEHZSP+6Vixety9IoA\"",
		"mtime": "2026-08-26T23:57:15.111Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-r4ZZqdRT.js"
	},
	"/assets/utils-3l_1SNtQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"368ca-AYX0uBLJ0BSIfwXHv6lU3Rsx3io\"",
		"mtime": "2026-08-26T23:57:15.113Z",
		"size": 223434,
		"path": "../public/assets/utils-3l_1SNtQ.js"
	},
	"/assets/zod-uY2R0tLd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f15-vxFyoPq972y1mw6IojJEAYjCyzA\"",
		"mtime": "2026-08-26T23:57:15.118Z",
		"size": 32533,
		"path": "../public/assets/zod-uY2R0tLd.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_hBn8Kl = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_hBn8Kl
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
