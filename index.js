var createPattern = function(path) {
    return { pattern: path, included: true, served: true, watched: false };
};

var initBenchmark = function(files, config) {
    files.unshift(createPattern(__dirname + '/lib/adapter.js'));
    files.unshift(createPattern(__dirname + '/lib/benchmark.js'));
    files.unshift(createPattern(require.resolve('lodash')));
};

initBenchmark.$inject = ['config.files'];

function BenchReporter(baseReporterDecorator) {
    baseReporterDecorator(this);

    this.onRunComplete = function(browsers, resultInfo) {
    };

    this.specSuccess = function(browser, result) {
        var suite = result.benchmark.suite;
        var name = result.benchmark.name;

        this.write(suite + ' ' + name + ' at ' + Math.floor(result.benchmark.hz) + ' ops/sec ± ' + result.benchmark.stats.rme.toFixed(2) +'\n');

        if (result.wasted) {
            var that = this;
            result.wasted.forEach(function (w) {
                var component = w.key;
                var inclusiveWasted = w.inclusiveRenderDuration;
                var renderCount = w.renderCount;
                var avgTime = inclusiveWasted / renderCount;
                that.write('Wasted [' + component + '] renders: ' + renderCount +
                    ', inclusive time: ' + inclusiveWasted.toFixed(4) + ' ms' +
                    ', average time: ' + avgTime.toFixed(4) + ' ms' +
                    '\n');
            });
            this.write('\n');
        }
    };
}

BenchReporter.$inject = ['baseReporterDecorator'];


module.exports = {
    'framework:react-perf': ['factory', initBenchmark],
    'reporter:react-perf-reporter': ['type', BenchReporter]
};
