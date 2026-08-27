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
    "mtime": "2026-08-27T00:14:17.051Z",
    "size": 199,
    "path": "../public/favicon.svg"
  },
  "/assets/CurrencyInput-Ged3qdQn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3b4-47UEMZ0zhsh8GPJByiJozRZ9pnI"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 948,
    "path": "../public/assets/CurrencyInput-Ged3qdQn.js"
  },
  "/assets/MetaExplain-BJre5iiE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a74-TmgwxoVL67y0TcXowX98FdvxKX4"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 2676,
    "path": "../public/assets/MetaExplain-BJre5iiE.js"
  },
  "/assets/PaceCard-C8eyj4di.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"121d-OWT/2N/9L+D+ciQ7aX3eDFD7zds"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 4637,
    "path": "../public/assets/PaceCard-C8eyj4di.js"
  },
  "/assets/arrow-right-Y2P3T5no.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a6-a9uC2eVJWqTuD9VZaDO+SLcvSW0"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 166,
    "path": "../public/assets/arrow-right-Y2P3T5no.js"
  },
  "/assets/atualizar-B2PaCovq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24d2-8O9/wge/hk+T+htScg09rDBDAoA"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 9426,
    "path": "../public/assets/atualizar-B2PaCovq.js"
  },
  "/assets/auth-BkTr_q46.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"20e6-FxP+LPO6x5APCXt6YEELm4BfaEw"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 8422,
    "path": "../public/assets/auth-BkTr_q46.js"
  },
  "/assets/cenarios-Bsu9RaV6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"652d6-ROd6JaJlzASlQ+hzXOyMiSqF+io"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 414422,
    "path": "../public/assets/cenarios-Bsu9RaV6.js"
  },
  "/assets/configuracoes-BlYlXjEx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4a19-4fVFwIhb37WHVgTsjiWgaGvoQIc"',
    "mtime": "2026-08-27T00:14:09.081Z",
    "size": 18969,
    "path": "../public/assets/configuracoes-BlYlXjEx.js"
  },
  "/assets/dialog-fShWQEex.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"772d-K8pMM4i38NVUThhxJkIMRdvH25Y"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 30509,
    "path": "../public/assets/dialog-fShWQEex.js"
  },
  "/assets/historico-Bj90puKB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"363e-PzJ1EGMGLX+MMbOY1HkBIIoxEeg"',
    "mtime": "2026-08-27T00:14:09.081Z",
    "size": 13886,
    "path": "../public/assets/historico-Bj90puKB.js"
  },
  "/assets/index-Cus-dz4n.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"35de-rPrL0mwl6nX4XlMVXmXW7PlM+D0"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 13790,
    "path": "../public/assets/index-Cus-dz4n.js"
  },
  "/assets/index-D9jrNCHr.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10af-ZUXLWHCnLUAJA0VX9Q8FNOXh6Po"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 4271,
    "path": "../public/assets/index-D9jrNCHr.js"
  },
  "/assets/index-DoYbanA5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"18e-4MI2S61LugAIl69SY/jaH/MmY/w"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 398,
    "path": "../public/assets/index-DoYbanA5.js"
  },
  "/assets/info-D2FUMzm8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c8-HtpydvcfhBJ0BhMkWJvEGWlyqKg"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 200,
    "path": "../public/assets/info-D2FUMzm8.js"
  },
  "/assets/input-Ug0pPt_8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"100f-8TXRJuifHajVsH2OB4j2F7KSsD0"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 4111,
    "path": "../public/assets/input-Ug0pPt_8.js"
  },
  "/assets/label-Da_WL8iW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"393-qmoqSqs6Kk+d+23YTC3Trkiw5fw"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 915,
    "path": "../public/assets/label-Da_WL8iW.js"
  },
  "/assets/math-CTe3qPou.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f34-AWsSab5SOvq+LbMUwKJvaELL8DM"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 3892,
    "path": "../public/assets/math-CTe3qPou.js"
  },
  "/assets/onboarding-CwLhLwDT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"4825-Zgx1RcUt+llCqig3REQJ2/pN1fI"',
    "mtime": "2026-08-27T00:14:09.081Z",
    "size": 18469,
    "path": "../public/assets/onboarding-CwLhLwDT.js"
  },
  "/assets/privacidade-4Xk53nBx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10a9-oVQ17wE30Zg4X4Nb0rCWm0ZkYhQ"',
    "mtime": "2026-08-27T00:14:09.081Z",
    "size": 4265,
    "path": "../public/assets/privacidade-4Xk53nBx.js"
  },
  "/assets/styles-BHys4J7Q.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"1651e-eIBAJeRNJ14x93smpXqJkEuwC5M"',
    "mtime": "2026-08-27T00:14:09.077Z",
    "size": 91422,
    "path": "../public/assets/styles-BHys4J7Q.css"
  },
  "/assets/textarea-BOBSVcAK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"24a-0Na9pmq4vSR0K6a9n/7GX24vmJk"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 586,
    "path": "../public/assets/textarea-BOBSVcAK.js"
  },
  "/assets/trash-2-Cp1rvyGi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"149-upeMLK43RCllYZQ7i72hGtbX+4M"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 329,
    "path": "../public/assets/trash-2-Cp1rvyGi.js"
  },
  "/assets/triangle-alert-DDI-PLdU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10a-aerFhWJrRmufjB39I6VU/rRsGLw"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 266,
    "path": "../public/assets/triangle-alert-DDI-PLdU.js"
  },
  "/assets/index-BTWsLzvM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a2c18-h/g51+DCfeIQEeRs47gUROPSSr0"',
    "mtime": "2026-08-27T00:14:09.086Z",
    "size": 666648,
    "path": "../public/assets/index-BTWsLzvM.js"
  },
  "/assets/zod-CmsZsTd7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"81a0-uJXf5I9GioCM6qrPE+mjxstx54k"',
    "mtime": "2026-08-27T00:14:09.082Z",
    "size": 33184,
    "path": "../public/assets/zod-CmsZsTd7.js"
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
