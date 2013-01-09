(function() {

  define([], function() {
    var LOGGER;
    LOGGER = {};
    LOGGER.options = {
      log_level: 'all'
    };
    LOGGER.history = {};
    LOGGER.can_log = function(type) {
      var log_level, return_value;
      return_value = false;
      log_level = LOGGER.options.log_level;
      if (log_level === 'all' || log_level === true) {
        return_value = true;
      } else if (log_level instanceof Array) {
        if (log_level.indexOf(type) > -1) return_value = true;
      } else if (log_level === null || log_level === void 0 || log_level === 'none' || log_level === false) {
        return_value = false;
      } else {
        if (log_level === type) return_value = true;
      }
      return return_value;
    };
    LOGGER.log = function(type) {
      var args, cur_date, log_history;
      args = Array.prototype.slice.call(arguments);
      if (!(type != null) || arguments.length === 1) {
        type = 'debug';
        args.splice(0, 0, 'debug');
      }
      if (!LOGGER.can_log(type)) return false;
      cur_date = new Date();
      args.push({
        'Date': cur_date,
        'Milliseconds': cur_date.getMilliseconds(),
        'Time': cur_date.getTime()
      });
      log_history = LOGGER.history;
      log_history[type] = log_history[type] || [];
      log_history[type].push(args);
      if (window.console) console.log(Array.prototype.slice.call(args));
      return true;
    };
    LOGGER.options.log_types = ['debug', 'error', 'info', 'warn'];
    LOGGER.options.setup_log_types = function() {
      var log_type, _i, _len, _ref, _results;
      LOGGER.log('logger', 'setupt_log_types()', 'Called setup log types!');
      _ref = LOGGER.options.log_types;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        log_type = _ref[_i];
        _results.push((function(log_type) {
          return LOGGER[log_type] = function() {
            var args;
            args = Array.prototype.slice.call(arguments);
            args.splice(0, 0, log_type);
            return LOGGER.log.apply(null, args);
          };
        })(log_type));
      }
      return _results;
    };
    LOGGER.options.setup_log_types();
    if (window) {
      if (window.console && LOGGER.options) {
        if (LOGGER.options.log_level === 'none' || LOGGER.options.log_level === null) {
          console.log = function() {
            return {};
          };
        }
      }
      if (!(window.console != null)) {
        window.console = {
          log: function() {
            return {};
          }
        };
      }
      window.onerror = function(msg, url, line) {
        LOGGER.error(msg, url, line);
        return false;
      };
    }
    return LOGGER;
  });

}).call(this);
