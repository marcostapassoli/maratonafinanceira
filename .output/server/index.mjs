globalThis.__nitro_main__ = import.meta.url;
import "./_libs/unenv.mjs";

import { H as HookableCore } from "./_libs/hookable.mjs";
import { d as defineLazyEventHandler, H as HTTPError, a as H3Core } from "./_libs/h3.mjs";
import { d as FastResponse } from "./_libs/srvx.mjs";


import "./_libs/rou3.mjs";





function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const assets = {
  "/assets/CurrencyInput-CltnMr-_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3b4-TynW86Ii6fDXAqiQL4l3USm0YGw"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 948,
    "path": "../public/assets/CurrencyInput-CltnMr-_.js"
  },
  "/assets/MetaExplain-D--6C-lX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a74-OMKcP9/rfR/PL1gpmjbEDB+WjW4"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 2676,
    "path": "../public/assets/MetaExplain-D--6C-lX.js"
  },
  "/assets/PaceCard-Cce5k73J.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"121d-KlWeSJQsqyW3ZjCIvFXHVs75nOo"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 4637,
    "path": "../public/assets/PaceCard-Cce5k73J.js"
  },
  "/assets/atualizar-D87KubRS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24d2-V5OyhC/pDj+tyvEfHYcL9BwDGe0"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 9426,
    "path": "../public/assets/atualizar-D87KubRS.js"
  },
  "/assets/arrow-right-p6pRF7FY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6-yAyrxRZQokwhXy3dCd3l6mDQLsY"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 166,
    "path": "../public/assets/arrow-right-p6pRF7FY.js"
  },
  "/assets/auth-CzgfWZ4c.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1089-osB+vRHDLrA2prWzBlAYUrMPr+I"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 4233,
    "path": "../public/assets/auth-CzgfWZ4c.js"
  },
  "/assets/configuracoes-C0EIU41P.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4a19-46CwL0jbl5P0aeMSKBQhSn+lgG0"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 18969,
    "path": "../public/assets/configuracoes-C0EIU41P.js"
  },
  "/favicon.svg": {
    "type": "image/svg+xml",
    "etag": '"c7-mVPe6jgqDR/uVVUjO6x0ykTguLk"',
    "mtime": "2026-11-12T18:10:25.325Z",
    "size": 199,
    "path": "../public/favicon.svg"
  },
  "/assets/cenarios-DkR1Gqi_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"652d6-Q3T6iBZlLxxCYtqD2UeHyRBWgZU"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 414422,
    "path": "../public/assets/cenarios-DkR1Gqi_.js"
  },
  "/assets/historico-By-Fkk1r.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"363e-rL20zpexsECInYFA6rh5qmS696A"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 13886,
    "path": "../public/assets/historico-By-Fkk1r.js"
  },
  "/assets/index-B1g7KqeV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"18e-Xjdtna6OG1wH7/yB5wQjwJHVvTk"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 398,
    "path": "../public/assets/index-B1g7KqeV.js"
  },
  "/assets/dialog-LoPZGzTJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"772d-kYf8el0/mKJKYfwrmZn85GunM4Q"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 30509,
    "path": "../public/assets/dialog-LoPZGzTJ.js"
  },
  "/assets/index-DYK2PJ7e.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3624-d1yEYOA2cm7ywlrMcmpwpNGXTc8"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 13860,
    "path": "../public/assets/index-DYK2PJ7e.js"
  },
  "/assets/info-BqWv6jCq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c8-lWZlGtG56w1J+a1QXfDtcDyI6Fc"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 200,
    "path": "../public/assets/info-BqWv6jCq.js"
  },
  "/assets/index-XX__sNbc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10af-gRzc0R7jeLKQEAj/F/fIJwahC4M"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 4271,
    "path": "../public/assets/index-XX__sNbc.js"
  },
  "/assets/input-C9UfgmzS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"100f-v/2J7x5IRbc37jVvjQn+wAWBr74"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 4111,
    "path": "../public/assets/input-C9UfgmzS.js"
  },
  "/assets/label-SZVOCHzt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"393-MVi3kfmRAWHaOY5nCuFw1osMN/M"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 915,
    "path": "../public/assets/label-SZVOCHzt.js"
  },
  "/assets/math-CTe3qPou.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f34-AWsSab5SOvq+LbMUwKJvaELL8DM"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 3892,
    "path": "../public/assets/math-CTe3qPou.js"
  },
  "/assets/onboarding-D2T4120z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4825-BgLvpo4vAHaBl9QAo5aZ2MM+LpE"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 18469,
    "path": "../public/assets/onboarding-D2T4120z.js"
  },
  "/assets/privacidade-BcKB-aO7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10a9-mXmzZ3iqLaz5XOs+H43p0kqmsX4"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 4265,
    "path": "../public/assets/privacidade-BcKB-aO7.js"
  },
  "/assets/styles-DJ9LGxOQ.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"164f2-8YLliNFZtdNlTqhytMiLYA1xQBk"',
    "mtime": "2026-11-12T18:10:22.815Z",
    "size": 91378,
    "path": "../public/assets/styles-DJ9LGxOQ.css"
  },
  "/assets/textarea-DfAuTNhB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24a-uHbvGn02Rmw/LhX1QWs1XwTWuk4"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 586,
    "path": "../public/assets/textarea-DfAuTNhB.js"
  },
  "/assets/trash-2-C_HBWt9Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"149-84/ovtReTnJmB6BzBAcucAqpz0s"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 329,
    "path": "../public/assets/trash-2-C_HBWt9Q.js"
  },
  "/assets/triangle-alert-CR0amd5n.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10a-/PvNrDM/pnFBCKPONQHaVkG6d8M"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 266,
    "path": "../public/assets/triangle-alert-CR0amd5n.js"
  },
  "/assets/index-BQsa5Ggk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a367e-ckrhfLXDCumBtu0UeUoRRwqZtt4"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 669310,
    "path": "../public/assets/index-BQsa5Ggk.js"
  },
  "/assets/zod-CMDE_dnP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"81a0-NaiYfLqFs0vyNon5K5vlgd4GbEk"',
    "mtime": "2026-11-12T18:10:22.823Z",
    "size": 33184,
    "path": "../public/assets/zod-CMDE_dnP.js"
  }
};
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key, value);
  }
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_RfVFMN = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_RfVFMN };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
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
    if (routeRules?.routeRuleMiddleware.length) {
      middleware.push(...routeRules.routeRuleMiddleware);
    }
    if (route?.data?.middleware?.length) {
      middleware.push(...route.data.middleware);
    }
    return middleware;
  };
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function useNitroHooks() {
  const nitroApp = useNitroApp();
  const hooks = nitroApp.hooks;
  if (hooks) {
    return hooks;
  }
  return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
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
        if (res) {
          return res;
        }
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
const cloudflareModule = createHandler({ fetch(cfRequest, env, context, url) {
  if (env.ASSETS && isPublicAssetURL(url.pathname)) {
    return env.ASSETS.fetch(cfRequest);
  }
} });
export {
  cloudflareModule as default
};
