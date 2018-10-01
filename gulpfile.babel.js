// @flow
/* eslint-disable import/no-nodejs-modules, no-console */
import { exec } from 'child_process'
import path from 'path'
import gulp from 'gulp'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from './project/webpack.config.babel'

const resolve = (file: string) => path.resolve(__dirname, file)

gulp.task('buildjs', (cb) => webpack(webpackConfig, cb))

gulp.task('runWatch', (cb) => {
  const compiler = webpack({ ...webpackConfig, bail: false }, cb)
  compiler.watch({ poll: 1000, ignored: /node_modules/ }, (err, stats) => {
    const { startTime, endTime } = stats
    const elapsed = endTime - startTime

    console.log(`Finished in ${elapsed} secs`)
    if (err) {
      console.log('Error detected:', err)
    }
  })
})

gulp.task('runServer', () => {
  const server = new WebpackDevServer(
    webpack({ ...webpackConfig, bail: false }),
    webpackConfig.devServer
  )

  server.listen(9898, 'localhost', (err) => {
    if (!err) {
      console.log('Listening at localhost:9898')
    } else {
      console.error(`webpack-dev-server failed to start: ${err}`)
    }
  })
})

gulp.task('copyRoot', (cb) => {
  [
    'index.html',
    'toolkit-minimal.min.css',
    'fonts/toolkit-entypo.eot',
    'fonts/toolkit-entypo.ttf',
    'fonts/toolkit-entypo.woff',
    'fonts/toolkit-entypo.woff2',
  ].forEach((fileName) => {
    const src = resolve(`project/${fileName}`)
    const dest = resolve(`build/${fileName}`)

    exec(`cp ${src} ${dest}`)
  })

  cb()
})

gulp.task('copyToServer', (cb) => {
  const src = resolve('build/*')
  const dest = resolve('../server/public')
  const cmd = `cp -r ${src} ${dest}`

  exec(cmd)
  cb()
})

gulp.task('run', [ 'copyRoot', 'runServer' ])
gulp.task('build', [ 'copyRoot', 'buildjs', 'copyToServer' ])

gulp.task('default', [ 'build' ])