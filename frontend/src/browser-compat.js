// Browser compatibility fixes
// Fix for "Cannot redefine property: userAgent" error

(function() {
  // Override Object.defineProperty for navigator.userAgent to prevent errors
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (obj === navigator && prop === 'userAgent') {
      // If someone tries to redefine userAgent, just return without error
      if (descriptor.configurable === false) {
        return obj;
      }
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  // Also fix Object.defineProperties
  const originalDefineProperties = Object.defineProperties;
  Object.defineProperties = function(obj, props) {
    if (obj === navigator && props.userAgent) {
      // If userAgent is being redefined, skip it
      const filteredProps = { ...props };
      delete filteredProps.userAgent;
      return originalDefineProperties.call(this, obj, filteredProps);
    }
    return originalDefineProperties.call(this, obj, props);
  };
})();
