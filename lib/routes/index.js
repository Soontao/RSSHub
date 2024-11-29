const config = require("@/config").value;
const art = require("art-template");
const path = require("path");
const v8 = require("v8");
const os = require("os");

module.exports = async (ctx) => {
  ctx.set({
    "Content-Type": "text/html; charset=UTF-8",
    "Cache-Control": "no-cache",
  });

  const routes = Object.keys(ctx.debug.routes).sort(
    (a, b) => ctx.debug.routes[b] - ctx.debug.routes[a]
  );
  const hotRoutes = routes.slice(0, 30);
  let hotRoutesValue = "";
  hotRoutes.forEach((item) => {
    hotRoutesValue += `${ctx.debug.routes[item]}  ${item}<br>`;
  });

  const paths = Object.keys(ctx.debug.paths).sort(
    (a, b) => ctx.debug.paths[b] - ctx.debug.paths[a]
  );
  const hotPaths = paths.slice(0, 30);
  let hotPathsValue = "";
  hotPaths.forEach((item) => {
    hotPathsValue += `${ctx.debug.paths[item]}  ${item}<br>`;
  });

  let hotErrorRoutesValue = "";
  if (ctx.debug.errorRoutes) {
    const errorRoutes = Object.keys(ctx.debug.errorRoutes).sort(
      (a, b) => ctx.debug.errorRoutes[b] - ctx.debug.errorRoutes[a]
    );
    const hotErrorRoutes = errorRoutes.slice(0, 30);
    hotErrorRoutes.forEach((item) => {
      hotErrorRoutesValue += `${ctx.debug.errorRoutes[item]}  ${item}<br>`;
    });
  }

  let hotErrorPathsValue = "";
  if (ctx.debug.errorPaths) {
    const errorPaths = Object.keys(ctx.debug.errorPaths).sort(
      (a, b) => ctx.debug.errorPaths[b] - ctx.debug.errorPaths[a]
    );
    const hotErrorPaths = errorPaths.slice(0, 30);
    hotErrorPaths.forEach((item) => {
      hotErrorPathsValue += `${ctx.debug.errorPaths[item]}  ${item}<br>`;
    });
  }

  const ips = Object.keys(ctx.debug.ips).sort(
    (a, b) => ctx.debug.ips[b] - ctx.debug.ips[a]
  );
  const hotIPs = ips.slice(0, 50);
  let hotIPsValue = "";
  hotIPs.forEach((item) => {
    hotIPsValue += `${ctx.debug.ips[item]}  ${item}<br>`;
  });

  let showDebug;
  if (!config.debugInfo || config.debugInfo === "false") {
    showDebug = false;
  } else {
    showDebug =
      config.debugInfo === true || config.debugInfo === ctx.query.debug;
  }
  const { disallowRobot } = config;
  const { total_heap_size } = v8.getHeapStatistics();

  ctx.body = art(path.resolve(__dirname, "../views/welcome.art"), {
    showDebug,
    disallowRobot,
    debug: [
      config.nodeName
        ? {
          name: "node name",
          value: config.nodeName,
        }
        : null,
      {
        name: "Git Hash",
        value: require("@/utils/version"),
      },
      {
        name: "Platform/Arch",
        value: `${os.platform()} ${os.arch()}`,
      },
      {
        name: "Request Amount",
        value: ctx.debug.request,
      },
      {
        name: "Cache Hit Ratio",
        value: ctx.debug.request
          ? (ctx.debug.hitCache / ctx.debug.request).toFixed(2)
          : 0,
      },
      {
        name: "Heap Size",
        value: (total_heap_size / 2 ** 20).toFixed(0) + " MB",
      },
      {
        name: "Hot Routes",
        value: hotRoutesValue,
      },
      {
        name: "Hot Paths",
        value: hotPathsValue,
      },
      {
        name: "Hot IP",
        value: hotIPsValue,
      },
      {
        name: "Hot Error Routes",
        value: hotErrorRoutesValue,
      },
      {
        name: "Hot Error Paths",
        value: hotErrorPathsValue,
      },
    ],
  });
};
