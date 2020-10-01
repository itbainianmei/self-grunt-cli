const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')
const _cwd = process.cwd()
module.exports = grunt => {
    let config = {
        // default
        
    }
    try{
        const loadConfig = require(`${_cwd}/pages.config.js`)
        config = Object.assign({},config,loadConfig)
    }catch(e){

    }
    grunt.initConfig({
        clean:{
            main:['dist']
        },
        sass:{
            options:{
                sourceMap:true,
                outputStyle:'expanded',
                implementation:sass,
            },
            main:{
                expand:true,
                cwd:'src/assets/styles',
                src:'*.scss',
                dest:'dist/assets/styles',
                ext:'.css'
            }
        },
        swigtemplates:{
            options:{
                data:config,
                templateDir:'src'
            },
            main:{
                src:'src/**/*.html',
                dest:'dist/'
            }
        },
        babel:{
            options:{
                sourceMap:true,
                presets:['@babel/preset-env']
            },
            main:{
                expand:true,
                cwd:'src/assets/scripts',
                src:'*.js',
                dest:'dist/assets/scripts',
            }
        },
        imagemin:{
            main:{
                expand:true,
                cwd:'src/assets/images',
                src:'**',
                dest:'dist/assets/images'
            },
            mainFonts:{
                expand:true,
                cwd:'src/assets/fonts',
                src:'**',
                dest:'dist/assets/fonts'
            }
        },
        copy:{
            main:{
                expand:true,
                cwd:'public',
                src:'**',
                dest:'dist/public'
            }
        },
        useminPrepare: {
            html: 'dist/**/*.html',
            options: {
                dest: 'dist',
                root: ['dist', '.']
            }
        },
        // 资源合并 // 处理html中css、js 引入合并问题
        usemin: {
            html: 'dist/**/*.html',
        },
        htmlmin:{
            options:{
                removeComments:true,
                collapseWhitespace:true,
                minifyCSS:true,
                minifyJS:true
            },
            main:{
                expand:true,
                cwd:'dist',
                src:'*.html',
                dest:'dist'
            }
        },
        browserSync:{
            main:{
                notify:false,
                bsFils:{
                    src:['dist','src','public'],
                },
                options:{
                    watchTask:true,
                    server:{
                        baseDir:['dist','src','public'],
                        routes:{
                            "/node_modules":"node_modules"
                        }
                    }
                }
            }
        },
        watch:{
            buildScss:{
                files:'src/assets/styles/*.scss',
                tasks:['sass']
            },
            buildJs:{
                files:'src/assets/scripts/*.js',
                tasks:['babel']
            }
        }
    })
   
    loadGruntTasks(grunt)//自动加载所有插件
    grunt.registerTask('compile',['babel','swigtemplates','sass'])
    grunt.registerTask('build',[
        'clean',
        'copy',
        'compile',
        'imagemin',
        'useminPrepare',
        'usemin',
        'htmlmin'
    ])
    grunt.registerTask('dev',['clean','compile','browserSync','watch'])
}