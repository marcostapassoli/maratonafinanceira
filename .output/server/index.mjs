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
    "mtime": "2026-08-27T19:17:10.794Z",
    "size": 199,
    "path": "../public/favicon.svg"
  },
  "/assets/CurrencyInput-1whlbK4u.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3b4-v1cGVyzUvxG93KUl+cHIRAbBDKE"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 948,
    "path": "../public/assets/CurrencyInput-1whlbK4u.js"
  },
  "/assets/MetaExplain-C2OvadiR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a74-yTVIK28R5yjkpxR1q89lnTxYhcY"',
    "mtime": "2026-08-27T19:17:06.315Z",
    "size": 2676,
    "path": "../public/assets/MetaExplain-C2OvadiR.js"
  },
  "/assets/PaceCard-Cjm6hKwY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"121d-ly2UtR0ll9J+hdHruaxRbZWWliw"',
    "mtime": "2026-08-27T19:17:06.315Z",
    "size": 4637,
    "path": "../public/assets/PaceCard-Cjm6hKwY.js"
  },
  "/assets/arrow-right-CXMWrxRb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6-iYv9pyDH0U66lDhfKV620SJezIw"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 166,
    "path": "../public/assets/arrow-right-CXMWrxRb.js"
  },
  "/assets/atualizar-4WK4riMb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24d2-iAcyVz1B8BlA8Wb0wRXg5jFWfOM"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 9426,
    "path": "../public/assets/atualizar-4WK4riMb.js"
  },
  "/assets/auth-BW00Cxp9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"20e6-G4rtiZ2rvGCO7cvcH+cA8N4s/gs"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 8422,
    "path": "../public/assets/auth-BW00Cxp9.js"
  },
  "/assets/cenarios-CVzeiEkt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"652d6-5oFEib6b2Cm9dMrBdAy2n7dTH3U"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 414422,
    "path": "../public/assets/cenarios-CVzeiEkt.js"
  },
  "/assets/configuracoes-1EH8TWZ0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4a19-KsGDO8A3H3O1/yw+EwVUKCGrl6M"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 18969,
    "path": "../public/assets/configuracoes-1EH8TWZ0.js"
  },
  "/assets/dialog-BUwUPb9E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"772d-vnJ7D7NerGHfQNs+EyB9ICpXubc"',
    "mtime": "2026-08-27T19:17:06.315Z",
    "size": 30509,
    "path": "../public/assets/dialog-BUwUPb9E.js"
  },
  "/assets/historico-kzifeF0E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"363e-P9g7TFoBPAILTjwiE7Mzfmwuv78"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 13886,
    "path": "../public/assets/historico-kzifeF0E.js"
  },
  "/assets/index-BKTO-g97.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3624-E48vmQcVnKhZqW629SiV/Ox0Z7I"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 13860,
    "path": "../public/assets/index-BKTO-g97.js"
  },
  "/assets/index-CxfICuk4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"18e-yHXs05EqBbB0P+gOVsetlPkR7Bw"',
    "mtime": "2026-08-27T19:17:06.317Z",
    "size": 398,
    "path": "../public/assets/index-CxfICuk4.js"
  },
  "/assets/index-RiJyN8F6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10af-hPF+RO1MiDhq081mKC7yartpF3w"',
    "mtime": "2026-08-27T19:17:06.315Z",
    "size": 4271,
    "path": "../public/assets/index-RiJyN8F6.js"
  },
  "/assets/info-B5MzGeR8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c8-PaNHPa6hSoZ+qMUB2JVU45z3dlQ"',
    "mtime": "2026-08-27T19:17:06.315Z",
    "size": 200,
    "path": "../public/assets/info-B5MzGeR8.js"
  },
  "/assets/input-CEJ8df27.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"100f-XxbIq6t2rFg5ivDEW3VZ3vNhcPU"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 4111,
    "path": "../public/assets/input-CEJ8df27.js"
  },
  "/assets/label-D7kqJavp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"393-H8yty5A90VybBCcQXwX/84wxNHc"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 915,
    "path": "../public/assets/label-D7kqJavp.js"
  },
  "/assets/math-CTe3qPou.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f34-AWsSab5SOvq+LbMUwKJvaELL8DM"',
    "mtime": "2026-08-27T19:17:06.317Z",
    "size": 3892,
    "path": "../public/assets/math-CTe3qPou.js"
  },
  "/assets/onboarding-Dkv1cEAY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4825-Sx8F3ftej79eTs4KwhUWMvZxMrE"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 18469,
    "path": "../public/assets/onboarding-Dkv1cEAY.js"
  },
  "/assets/privacidade-lbpHszHJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10a9-SZOYbPD3grhxpwJyHZGoVGJ+5m8"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 4265,
    "path": "../public/assets/privacidade-lbpHszHJ.js"
  },
  "/assets/styles-BHys4J7Q.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"1651e-eIBAJeRNJ14x93smpXqJkEuwC5M"',
    "mtime": "2026-08-27T19:17:06.313Z",
    "size": 91422,
    "path": "../public/assets/styles-BHys4J7Q.css"
  },
  "/assets/textarea-BtxAWYsk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24a-F+aODJAPKdMHD5L1KtkmXvnZBTI"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 586,
    "path": "../public/assets/textarea-BtxAWYsk.js"
  },
  "/assets/trash-2-CyAT1q00.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"149-k3+ohSe/ESAdrvne+ZGNJtxQ4WQ"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 329,
    "path": "../public/assets/trash-2-CyAT1q00.js"
  },
  "/assets/triangle-alert-BkKiIr-y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10a-syV240enNma4D4fF9Wv0jde+neE"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 266,
    "path": "../public/assets/triangle-alert-BkKiIr-y.js"
  },
  "/assets/index-C_talA5z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a2c18-IgStGsN5ADflmSYjQBahyvlyvEE"',
    "mtime": "2026-08-27T19:17:06.318Z",
    "size": 666648,
    "path": "../public/assets/index-C_talA5z.js"
  },
  "/assets/zod-l1Pjr2Jz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"81a0-H+9Q8xfq3naLqvLT8AJyJb3uhps"',
    "mtime": "2026-08-27T19:17:06.314Z",
    "size": 33184,
    "path": "../public/assets/zod-l1Pjr2Jz.js"
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
