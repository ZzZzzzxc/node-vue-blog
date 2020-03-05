const path = require("path");
const SkeletonWebpackPlugin = require("vue-skeleton-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
function resolve(dir) {
  return path.join(__dirname, "./", dir);
}

module.exports = {
  //eslint开发环境是否进行保存时检查
  lintOnSave: false,
  //打包资源引用路径
  publicPath: "/",
  //打包输出路径
  outputDir: __dirname + "/../server-web/public/dist",
  //是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  //生产环境是否构建source map
  productionSourceMap: false,
  css: {
    extract: true // css拆分ExtractTextPlugin插件，默认true - 骨架屏需要为true
  },
  chainWebpack: config => {
    // 删除预加载
    config.plugins.delete("prefetch");
    // 压缩代码
    config.optimization.minimize(true);
    // 分割代码
    config.optimization.splitChunks({
      chunks: "all"
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
    imagesRule.exclude.add(resolve("src/assets/svg"));
    config.module.rule("images").test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
    const myConfig = {};
    myConfig.externals = {
      vue: "Vue",
      vuex: "Vuex",
      "vue-router": "VueRouter",
      axios: "axios",
      moment: "moment",
      valine: "Valine",
      "leancloud-storage": "AV",
      "vue-lazyload": "VueLazyload"
    };
    myConfig.plugins = [];
    // vue骨架屏插件配置
    myConfig.plugins.push(
      new SkeletonWebpackPlugin({
        webpackConfig: {
          entry: {
            app: path.join(__dirname, "./src/utils/skeleton.js")
          }
        },
        minimize: true,
        quiet: true,
        router: {
          mode: "history",
          routes: [
            {
              path: "/",
              skeletonId: "skeleton1"
            },
            {
              path: "/home",
              skeletonId: "skeleton1"
            },
            {
              path: "/archives",
              skeletonId: "skeleton2"
            }
          ]
        }
      })
    );
    myConfig.plugins.push(
      new CompressionPlugin({
        // 正在匹配需要压缩的文件后缀
        test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
        // 大于10kb的会压缩
        threshold: 8192,
        minRatio: 0.8
      })
    );
    return myConfig;
  }
};
