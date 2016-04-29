Injectify condition [![Build Status](https://travis-ci.org/ftdebugger/injectify-condition.svg?branch=master)](https://travis-ci.org/ftdebugger/injectify-condition) ![npm downloads](https://img.shields.io/npm/dm/injectify-condition.svg "npm downloads")
===========================================================================================================================================================================================================================================================

Remove conditional code from template

Install
-------

```
npm install --save-dev injectify-condition
```

Usage
-----

Configure `gulp`:

```js
var gulp = require("gulp"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
     
require('injectify-condition/inject');
    
gulp.task('js', function () {
    var options = {
        injectify: {
            condition: {
                'is-mobile': true,
                'is-desktop': false
            }
        }
    };
    var bundleStream = browserify('./src/index.js')
        .transform(require("injectify"))
        .bundle();

    return bundleStream
        .pipe(source('index.js'))
        .pipe(gulp.dest('dist'));
});
```

And write some template

```handlebars
{{#is-mobile}}
    This template will be rendered
{{else}}
    This code will be removed
{{/is-mobile}}
```

You can pass helper to `if` and `unless` statements

```handlebars
{{#unless (is-mobile)}}
    This code will be removed for is-mobile=true
{{/unless}}
```

You can pass variables as params and hashes to helpers

```handlebars
{{my-awesome-helper (is-desktop) touch=(is-mobile)}}

will be transform into 

{{my-awesome-helper false touch=true}}
```

Webpack
-------

```js
module.exports = {
    module: {
        loaders: [
            {
                test: /\.hbs/,
                loader: 'injectify',
                query: JSON.stringify({
                    condition: {
                        'is-mobile': true,
                        'is-desktop': false
                    }
                })
            }
        ]
    }
}
```