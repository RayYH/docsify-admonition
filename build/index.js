'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var CONFIG = {
    style: 'admonition',
    note: {
        label: 'Note',
        className: 'note'
    },
    hint: {
        label: 'Hint',
        className: 'hint'
    },
    caution: {
        label: 'Caution',
        className: 'caution'
    },
    danger: {
        label: 'Danger',
        className: 'danger'
    },
    error: {
        label: 'Error',
        className: 'error'
    },
    attention: {
        label: 'Attention',
        className: 'attention'
    }
};

function mergeObjects(obj1, obj2) {
    var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    for (var property in obj2) {
        try {
            if (obj2.hasOwnProperty(property) && obj2[property].constructor === Object && level < 1) {
                obj1[property] = mergeObjects(obj1[property], obj2[property], level + 1);
            } else {
                obj1[property] = obj2[property];
            }
        } catch (e) {
            if (obj2.hasOwnProperty(property)) {
                obj1[property] = obj2[property];
            }
        }
    }

    return obj1;
}

var install = function install(hook, vm) {
    var options = mergeObjects(CONFIG, window.$docsify.admonition);

    var findSetting = function findAlertSetting(input, key, fallback, callback) {
        var match = (input || '').match(new RegExp(key + ':(([\\s\\w\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]*))'));

        if (!match) {
            return callback ? callback(fallback) : fallback;
        }

        return callback ? callback(match[1]) : match[1];
    };

    hook.afterEach(function (html, next) {
        var modifiedHtml = html.replace(/<\s*blockquote[^>]*>(?:<p>|[\S\n]*)?\[!([\w\s]*)((?:\|[\w*:[\s\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*)*?)\]\[([^\]]*)\]([\s\S]*?)(?:<\/p>)?<\s*\/\s*blockquote>/g, function (match, key, settings, heading, value) {
            var config = options[key.toLowerCase()];

            if (!config) {
                return match;
            }

            // settings
            var style = findSetting(settings, 'style', options.style);
            var isLabelVisible = findSetting(settings, 'labelVisibility', 'visible', function (value) {
                return value !== 'hidden';
            });
            var label = findSetting(settings, 'label', config.label);
            var className = findSetting(settings, 'className', config.className);

            // global configuration
            if (options.labelVisibility === 'hidden') {
                isLabelVisible = false;
            }

            if ((typeof label === 'undefined' ? 'undefined' : _typeof(label)) === 'object') {
                var foundLabel = Object.keys(label).filter(function (key) {
                    return vm.route.path.indexOf(key) > -1;
                });

                if (foundLabel && foundLabel.length > 0) {
                    label = label[foundLabel[0]];
                } else {
                    isLabelVisible = false;
                }
            }

            return '<div class="' + style + ' ' + className + '">\n<p class = "admonition-title">\n    ' + (isLabelVisible ? label : '') + ' ' + heading + '\n</p>\n<p>' + value + '</p>\n</div>';
        });
        next(modifiedHtml);
    });
};

window.$docsify = window.$docsify || {};
window.$docsify.plugins = [].concat(install, window.$docsify.plugins);