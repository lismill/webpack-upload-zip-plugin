# webpack-upload-zip-plugin

## 介绍
编译完成后，解压文件夹为 zip 包，携带参数进行上传。

## 使用方法
`package.json`
```
npm i webpack-upload-zip-plugin --save-dev
```

`vue.config.js`

```
const UploadZipPlugin = require("webpack-upload-zip-plugin");

plugins: [
  new UploadZipPlugin({
    version_key: "version_code",
    version_code: "1.0",
    url: process.env.NODE_ENV === "development" ? "https://xxx.com/upload" : "https://xxx.com/upload"
  }),
]
```

## 参数说明

| 参数         | 说明                                                 | 默认值    |
| ------------ | ---------------------------------------------------- | --------- |
| path         | 压缩后的zip包存放位置，文件名默认：年-月-日-hash.zip | ./version |
| version_key  | 传递给后端的版本号字段名                             | version   |
| version_code | 传递给后端的版本号字段值                             | 1.0       |
| url          | 上传地址                                             | ./upload  |

