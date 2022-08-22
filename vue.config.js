const CompressionPlugin = require("compression-webpack-plugin");//gz 压缩文件 生成.gz文件
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;




module.exports = {
    publicPath:'/',
    productionSourceMap: false,//打包不生成map文件
    // configureWebpack:{
        
    //     plugins: [
    //         new BundleAnalyzerPlugin(),
    //         new CompressionPlugin({
    //             test: productionGzipExtensions, // 所有匹配此{RegExp}的资产都会被处理
    //             threshold: 512, // 只处理大于此大小的资产。以字节为单位
    //             minRatio: 0.8, // 只有压缩好这个比率的资产才能被处理
    //             deleteOriginalAssets: false // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
    //         }),
    //     ]
    // },
    devServer: {
        proxy: {
            '/merchant': { 
                target: 'http://139.196.84.48:8866', 
            }
        }
    }
}