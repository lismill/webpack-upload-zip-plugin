const fs = require("fs")
const archiver = require("archiver")
const FormData = require("form-data")
const request = require("request")

/**
 * 1. 压缩文件夹
 * 2. 上传到服务器
 * @param path 上传文件的目录
 */
class UploadZipPlugin {
    constructor(options) {
        this.options = Object.assign({ path: "./version", version_key: "version", version_code: "1.0", url: "./upload" }, options);
    }
    apply(compiler) {
        compiler.hooks.done.tap("Hello World Plugin", (stats) => {
            console.log("Hello World!", stats.hash, compiler.options.output.path);
            /**
             * 压缩为文件夹
             */
            this.ZipDirectory(compiler.options.output.path, stats.hash).then((complete_path) => {
                console.log(`ZIP::: succeeded, path: ${complete_path}`);
                /**
                 * 执行上传操作
                 */
                this.ZipRequest(complete_path, compiler.options.output.path);
            });
        });
    }
    /**
     * 压缩为文件夹
     */
    ZipDirectory(path = "", hash = "") {
        return new Promise((resolve) => {
            /**
             * 存放目录是否存在
             */
            // console.log('__dirname', __dirname)
            // console.log('__dirname', __dirname)
            if (fs.existsSync(this.options.path)) {
                console.log("Directory exists!");
            }
            else {
                fs.mkdir(this.options.path, { recursive: true }, (err) => {
                    if (err)
                        throw err;
                });
            }
            /**
             * 设置参数，解压文件夹
             */
            const version_name = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}-` + hash;
            const complete_path = `${this.options.path}/${version_name}.zip`;
            console.log("complete_path", complete_path);
            const output = fs.createWriteStream(complete_path);
            const archive = archiver("zip");
            // close
            output.on("close", () => resolve(complete_path));
            // end
            output.on("end", () => console.log("Data has been drained"));
            // error
            archive.on("error", (err) => console.log(err));
            // 将输出流存档到文件
            archive.pipe(output);
            // 压缩的文件夹的路径
            archive.directory(path + "/", false);
            // 完成归档
            archive.finalize();
        });
    }
    /**
     * 执行上传操作
     */
    ZipRequest(complete_path, output_path) {
        onsole.log(`ZIP::: uploading... path: ${output_path.replace(/dist/, '') + complete_path.replace(/.\//, '')}`)
        const formData = {
            // file: fs.createReadStream(complete_path),
            file: fs.createReadStream(output_path.replace(/dist/, '') + complete_path.replace(/.\//, '')),
            [this.options.version_key]: this.options.version_code
        };

        console.log(`ZIP::: uploading... params: ${JSON.stringify({
            method: "POST",
            url: this.options.url,
            // file: complete_path,
            file: output_path.replace(/dist/, '') + complete_path.replace(/.\//, '/'),
            [this.options.version_key]: this.options.version_code
        })}`);

        request.post({ url: this.options.url, formData: formData }, function optionalCallback(err, httpResponse) {
            if (err) {
                console.log(`ZIP::: upload error, ${err}`);
            } else {
                if (httpResponse.body && httpResponse.body.code === 0) {
                    console.log(`ZIP::: upload error, ${httpResponse.body}`);
                } else {
                    console.log(`ZIP::: upload succeeded, ${httpResponse.body}`,)
                }
            }
        });
    }
}
module.exports = UploadZipPlugin;
