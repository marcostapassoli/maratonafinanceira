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
  "/favicon.svg": {
    "type": "image/svg+xml",
    "etag": '"c7-mVPe6jgqDR/uVVUjO6x0ykTguLk"',
    "mtime": "2026-08-28T19:57:52.062Z",
    "size": 199,
    "path": "../public/favicon.svg"
  },
  "/assets/CurrencyInput-Bo-u8sxM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3b4-gGw9L5BAql4uGTzkiKYCiTfeAe4"',
    "mtime": "2026-08-28T19:57:44.249Z",
    "size": 948,
    "path": "../public/assets/CurrencyInput-Bo-u8sxM.js"
  },
  "/assets/MetaExplain-B_B2eUxM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a74-I8qQPZN0ICyNV53zJi14gU3FWEI"',
    "mtime": "2026-08-28T19:57:44.250Z",
    "size": 2676,
    "path": "../public/assets/MetaExplain-B_B2eUxM.js"
  },
  "/assets/PaceCard-CEF9UOWo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"121d-tRMxAto2YuLRpqbB928PGeTblj4"',
    "mtime": "2026-08-28T19:57:44.250Z",
    "size": 4637,
    "path": "../public/assets/PaceCard-CEF9UOWo.js"
  },
  "/assets/arrow-right-BDPd5GrD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6-W7mmstr/VJ1kD8meGOkNDZBQbcU"',
    "mtime": "2026-08-28T19:57:44.249Z",
    "size": 166,
    "path": "../public/assets/arrow-right-BDPd5GrD.js"
  },
  "/assets/atualizar-DPXaj-Bz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24d2-Vz+Cu7HNVYJZaT21QW3QZeuNqBc"',
    "mtime": "2026-08-28T19:57:44.249Z",
    "size": 9426,
    "path": "../public/assets/atualizar-DPXaj-Bz.js"
  },
  "/assets/auth-fTfzw2tJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1089-v5HWm32gXgC43vx1FGyw6QMYxfU"',
    "mtime": "2026-08-28T19:57:44.249Z",
    "size": 4233,
    "path": "../public/assets/auth-fTfzw2tJ.js"
  },
  "/assets/cenarios-DNKDpiJZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"652d6-YRBbsvevcbZRj5POV1+UEv+XobA"',
    "mtime": "2026-08-28T19:57:44.249Z",
    "size": 414422,
    "path": "../public/assets/cenarios-DNKDpiJZ.js"
  },
  "/assets/configuracoes-BpCNJHNi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4a19-oJBZOObNs1ikCjvZxHgua9wYC7Y"',
    "mtime": "2026-08-28T19:57:44.248Z",
    "size": 18969,
    "path": "../public/assets/configuracoes-BpCNJHNi.js"
  },
  "/assets/dialog-B2Y-fuGA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"772d-fqt4gGM6FwEdTtOQjRol+CqfzD0"',
    "mtime": "2026-08-28T19:57:44.250Z",
    "size": 30509,
    "path": "../public/assets/dialog-B2Y-fuGA.js"
  },
  "/assets/historico-Cai-bV1y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"363e-r+JiYUqalYnnP++HciGff6XXNXs"',
    "mtime": "2026-08-28T19:57:44.248Z",
    "size": 13886,
    "path": "../public/assets/historico-Cai-bV1y.js"
  },
  "/assets/index-BlwVO_qr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"18e-yXpl/bTmSnAFHV/IXvGajUL4Bu0"',
    "mtime": "2026-08-28T19:57:44.250Z",
    "size": 398,
    "path": "../public/assets/index-BlwVO_qr.js"
  },
  "/assets/index-D2INO04U.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10af-/0jpSilKi9A+iOsoC3mO0Nx3yBs"',
    "mtime": "2026-08-28T19:57:44.250Z",
    "size": 4271,
    "path": "../public/assets/index-D2INO04U.js"
  },
  "/assets/index-DfUomqdb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3624-bF3OsflXIE//IgWQzbIaNNnqUOI"',
    "mtime": "2026-08-28T19:57:44.250Z",
    "size": 13860,
    "path": "../public/assets/index-DfUomqdb.js"
  },
  "/assets/info-CnTZzUP7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c8-70mu4qK8p3MU3e/Dn4EHWKwRoZU"',
    "mtime": "2026-08-28T19:57:44.250Z",
    "size": 200,
    "path": "../public/assets/info-CnTZzUP7.js"
  },
  "/assets/input-E9TrHemv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"100f-C1ScOl3FhHqqk4LD6xouXPyEu/U"',
    "mtime": "2026-08-28T19:57:44.249Z",
    "size": 4111,
    "path": "../public/assets/input-E9TrHemv.js"
  },
  "/assets/label-DLXmdaQe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"393-mAIqbDyTXD6V9QzHJ+sKbPS5ei0"',
    "mtime": "2026-08-28T19:57:44.249Z",
    "size": 915,
    "path": "../public/assets/label-DLXmdaQe.js"
  },
  "/assets/math-CTe3qPou.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f34-AWsSab5SOvq+LbMUwKJvaELL8DM"',
    "mtime": "2026-08-28T19:57:44.250Z",
    "size": 3892,
    "path": "../public/assets/math-CTe3qPou.js"
  },
  "/assets/onboarding-CgmBS3cY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4825-W+1nOFlDOcASYqqfAKjtraqPcK8"',
    "mtime": "2026-08-28T19:57:44.248Z",
    "size": 18469,
    "path": "../public/assets/onboarding-CgmBS3cY.js"
  },
  "/assets/privacidade-DUyy_SJa.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10a9-+LmGR6J/YtrKRDLFFTgXVxEVH5E"',
    "mtime": "2026-08-28T19:57:44.248Z",
    "size": 4265,
    "path": "../public/assets/privacidade-DUyy_SJa.js"
  },
  "/assets/styles-DJ9LGxOQ.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"164f2-8YLliNFZtdNlTqhytMiLYA1xQBk"',
    "mtime": "2026-08-28T19:57:44.244Z",
    "size": 91378,
    "path": "../public/assets/styles-DJ9LGxOQ.css"
  },
  "/assets/textarea-GFPSHVeN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24a-8OFtwT7Hze/b4nstYeGlMvy3WtM"',
    "mtime": "2026-08-28T19:57:44.249Z",
    "size": 586,
    "path": "../public/assets/textarea-GFPSHVeN.js"
  },
  "/assets/trash-2-BDogA40t.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"149-IRgEB2QzQ/LY1YFqVuFrPdoSwq0"',
    "mtime": "2026-08-28T19:57:44.249Z",
    "size": 329,
    "path": "../public/assets/trash-2-BDogA40t.js"
  },
  "/assets/triangle-alert-DpAq_NCN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10a-S0LNi7796/rqBGkmQG/29KqRHmE"',
    "mtime": "2026-08-28T19:57:44.249Z",
    "size": 266,
    "path": "../public/assets/triangle-alert-DpAq_NCN.js"
  },
  "/assets/index-B5bJxP-t.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a2c18-9IUT1Wr6SYYYgEZqdgAfHuFK9bs"',
    "mtime": "2026-08-28T19:57:44.254Z",
    "size": 666648,
    "path": "../public/assets/index-B5bJxP-t.js"
  },
  "/assets/zod-DonkYukU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"81a0-GeXxa4xHRfGltCn/swAYshVyfRQ"',
    "mtime": "2026-08-28T19:57:44.249Z",
    "size": 33184,
    "path": "../public/assets/zod-DonkYukU.js"
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
const _lazy_hBn8Kl = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_hBn8Kl };
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
