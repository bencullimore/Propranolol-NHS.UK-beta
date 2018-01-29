(function ($, root) {
  "use strict";
  root.NHSUK = root.NHSUK || {};
  NHSUK.Modules = NHSUK.Modules || {};

  NHSUK.modules = {
    find: function (container) {
      var modules,
          moduleSelector = '[data-module]',
          container = container || $('body');

      modules = container.find(moduleSelector);

      // Container could be a module too
      if (container.is(moduleSelector)) {
        modules = modules.add(container);
      }

      return modules;
    },

    start: function (container) {
      var modules = this.find(container);

      for (var i = 0, l = modules.length; i < l; i++) {
        var module,
            element = $(modules[i]),
            type = camelCaseAndCapitalise(element.data('module')),
            started = element.data('module-started');

        if (typeof NHSUK.Modules[type] === "function" && !started) {
          module = new NHSUK.Modules[type]();
          module.start(element);
          element.data('module-started', true);
        }
      }

      // eg selectable-table to SelectableTable
      function camelCaseAndCapitalise(string) {
        return capitaliseFirstLetter(camelCase(string));
      }

      // http://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase
      function camelCase(string) {
        return string.replace(/-([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });
      }

      // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
      function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    }
  }
})(jQuery, window);
