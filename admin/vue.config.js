const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
function resolve(dir) {
  return path.join(__dirname, "./", dir);
}

module.exports = {
  lintOnSave: false,
  publicPath: "/",
  outputDir: __dirname + "/../server-admin/public/dist",
  chainWebpack: config => {
    // 删除预加载
    config.plugins.delete("prefetch");
    // 压缩代码
    config.optimization.minimize(true);
    // 分割代码
    config.optimization.splitChunks({
      chunks: "all",
      //生成块的最小大小
      minSize: 30000,
      //生成块的最大大小
      maxSize: 0,
      //拆分前必须共享模块的最小块数。
      minChunks: 1,
      // 按需加载时并行请求的最大数量
      maxAsyncRequests: 6,
      //入口点的最大并行请求数
      maxInitialRequests: 4,
      //生成块名所用分隔符
      automaticNameDelimiter: "-",
      //生成块名最大字符数
      automaticNameMaxLength: 30,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    });
    config.plugin("define").tap(args => {
      const argv = process.argv;
      const icourt = argv[argv.indexOf("--icourt-mode") + 1];
      args[0]["process.env"].MODE = `"${icourt}"`;
      return args;
    });
    // svg rule loader
    const svgRule = config.module.rule("svg"); // 找到svg-loader
    svgRule.uses.clear(); // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/); // 正则匹配排除node_modules目录
    svgRule // 添加svg新的loader处理
      .test(/\.svg$/)
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });
    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule("images");
    imagesRule.exclude.add(resolve("src/icons"));
    config.module.rule("images").test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
    config.plugins.push(
      new CompressionPlugin({
        algorithm: "gzip",
        // 正在匹配需要压缩的文件后缀
        test: /\.(js|css|svg|woff|ttf|json|html)$/,
        // 大于10kb的会压缩
        threshold: 10240
      })
    );
    config.externals = {
      vue: "Vue",
      vuex: "Vuex",
      "vue-router": "VueRouter",
      axios: "axios",
      moment: "moment",
      "mavon-editor": "MavonEditor",
      echarts: "echarts"
    };
  }
};
