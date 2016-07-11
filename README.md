# karma-react-perf

> A [Karma](http://karma-runner.github.io/) plugin to run [Benchmark.js v2](http://benchmarkjs.com/) with
[react-addons-perf](https://facebook.github.io/react/docs/perf.html)

## Installation

```shell
npm install karma-react-perf --save-dev
```

## Karma Configuration

```javascript
module.exports = function(config) {
    config.set({
        // Other Karma config here...
        frameworks: ['react-perf'],
        reporters: ['react-perf-reporter']
    });
};
```

## Expose Perf
karma-react-perf rely on global variable called perf. There are several ways to do that.

* use webpack's [expose loader](https://github.com/webpack/expose-loader)
```javascript
import 'expose?Perf!react-addons-perf'
```

or

```javascript
loaders: [
  {
    test: require.resolve("react-addons-perf"),
    loader: "expose?Perf"
  }
]
```

* assign Perf to window

```javascript
import Perf from 'react-addons-perf'
window.Perf = Perf
```

## Writing tests

You can test single component:

```javascript
let element = document.createElement('div');
element.setAttribute('id', 'react-app');
document.body.appendChild(element);

suite('Calendar performance', function () {
    benchmark('without props', {
        fn () {
            ReactDOM.render(<Calendar />, element);
        },
        teardown() {
           ReactDOM.unmountComponentAtNode(element);
        }
    });

    const props = { value: '22.05.2016' };
    benchmark('with constant props', {
        fn () {
            ReactDOM.render(<Calendar {...props} />, element);
        },
        teardown() {
            ReactDOM.unmountComponentAtNode(element);
        }
    });

    benchmark('with random props', {
        fn () {
            ReactDOM.render(<Calendar value={ Math.random() } />, element);
        },
         teardown() {
            ReactDOM.unmountComponentAtNode(element);
        }
    })
});
```

...or performance of your entire application on some redux actions

```javascript
let element = document.createElement('div');
element.setAttribute('id', 'react-app');
document.body.appendChild(element);
let store = createStore(initialState);
ReactDOM.render(<Provider store={ store }><App /></Provider>, element);

suite('app performance', function () {
    benchmark('change code', function () {
        store.dispatch(actions.changeValue());
    });
});

```

Run Karma:

```shell
karma start
```

Then, you'll then see output that looks like:

```
app performance change code at 44 ops/sec ± 2.56
Wasted [SmsVerification > SmsCountdown] renders: 241, inclusive time: 49.2250 ms, average time: 0.2043 ms
Wasted [BankDetails > Label] renders: 482, inclusive time: 33.9650 ms, average time: 0.0705 ms
Wasted [Radio > Button] renders: 241, inclusive time: 31.5100 ms, average time: 0.1307 ms
Wasted [SmsCountdown > Label] renders: 241, inclusive time: 20.9150 ms, average time: 0.0868 ms
Wasted [Captcha > Icon] renders: 241, inclusive time: 19.4850 ms, average time: 0.0809 ms
Wasted [InscribeText > ResizeSensor] renders: 490, inclusive time: 9.7900 ms, average time: 0.0200 ms
```

Wasted time info can give you information about components, that you can somehow optimize.

"Wasted" time is spent on components that didn't actually render anything, e.g. the render stayed the same, so the DOM wasn't touched.

### Timeouts

As large suites of Benchmarks take a long time to run, you _may_ need to increase Karma's timeout from it's default of 60000.

```javascript
captureTimeout: 60000
```

### Suite options

Suite options are the same as in Benchmark.js.

See the [Benchmark.js Suite constructor API docs](http://benchmarkjs.com/docs#Suite) for a full list of options.

```javascript
suite('Array iteration', function() {
    benchmark('_.each', {
        fn: function () {
            _.each(this.list, function(number) {
                return number;
            });
        },
        setup: function() {
            this.list = [5, 4, 3];
        },
        teardown: function() {
            this.list = null;
        }
    });
}, {
    onCycle: function(event) {
        var suite = this;
        var benchmark = event.target;
        console.log('Cycle completed for ' + suite.name + ': ' + benchmark.name);
    }
});
```


### Benchmark options

Benchmark options are the same as in Benchmark.js.

See the [Benchmark.js Benchmark constructor API docs](http://benchmarkjs.com/docs#Benchmark) for a full list of options.


# TODO

* import react-addons-perf automatically
