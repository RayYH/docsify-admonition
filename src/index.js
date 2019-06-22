const CONFIG = {
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

function mergeObjects(obj1, obj2, level = 0) {
    for (const property in obj2) {
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

const install = function (hook, vm) {
    const options = mergeObjects(CONFIG, window.$docsify.admonition);

    const findSetting = function findAlertSetting(input, key, fallback, callback) {
        const match = (input || '').match(new RegExp(`${key}:(([\\s\\w\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]*))`));

        if (!match) {
            return callback ? callback(fallback) : fallback;
        }

        return callback ? callback(match[1]) : match[1];
    };

    hook.afterEach(function (html, next) {
        const modifiedHtml = html.replace(/<\s*blockquote[^>]*>(?:<p>|[\S\n]*)?\[!([\w\s]*)((?:\|[\w*:[\s\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*)*?)\]\[([\w\s\-\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*)\]([\s\S]*?)(?:<\/p>)?<\s*\/\s*blockquote>/g, function (match, key, settings, heading, value) {
            const config = options[key.toLowerCase()];

            if (!config) {
                return match;
            }

            // settings
            const style = findSetting(settings, 'style', options.style);
            let isLabelVisible = findSetting(settings, 'labelVisibility', 'visible', (value) => value !== 'hidden');
            let label = findSetting(settings, 'label', config.label);
            const className = findSetting(settings, 'className', config.className);

            // global configuration
            if(options.labelVisibility === 'hidden') {
                isLabelVisible = false;
            }



            if (typeof label === 'object') {
                const foundLabel = Object.keys(label).filter(function (key) {
                    return vm.route.path.indexOf(key) > -1;
                });

                if (foundLabel && foundLabel.length > 0) {
                    label = label[foundLabel[0]];
                } else {
                    isLabelVisible = false;
                }
            }

            return (
                `<div class="${style} ${className}">
<p class = "admonition-title">
    ${isLabelVisible ? label : ''} ${heading}
</p>
<p>${value}</p>
</div>`
            );
        });
        next(modifiedHtml);
    });
};

window.$docsify = window.$docsify || {};
window.$docsify.plugins = [].concat(install, window.$docsify.plugins);