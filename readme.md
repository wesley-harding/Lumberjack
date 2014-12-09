#Lumberjack

Lumberjack is a small javascript library for all of your logging needs. It helps give you insight into what your application logs when you can’t see it.

For example, after you’ve launch your application and it’s in the hands of users, it can be pretty difficult to see what’s going on in your user’s browser. By using Lumberjack, you can send back all of your logs to a central server to monitor errors. In essences, it’s server logs for the browser.

###How to use Lumberjack

1. Include the lumberjack.js
2. Include this code:
    ```html
    <script>
        var logger = new Lumberjack();
    </script>
    ```
3. Anywhere you’d use console, replace it with logger

Note: You’ll probably want to include lumberjack as close to the top as you can.  My goal is to keep is small enough that it would not be distracting inline. This may change in the future.


##Proof of Concept Warning
This is currently a proof of concept. It only has very minimal features and currently only works with `log` and `warn`. `error` is included, but stack traces don’t work correctly. I may be making breaking changes in the near future.

I have only tested it in Chrome, but I actively avoid features that I know will break other browsers.

##Why use Lumberjack?
See what errors the browser is reporting
Doesn’t break if the browser doesn’t support console.log (I’m looking at you internet explorer)
It comes in handy if you don’t have easy access to the console (i.e. older browsers and mobile devices)

##Configurations
passthrough: true, //TODO: Indicate if Lumberjack should pass logging actions to the console for output
history_length: 0, //TODO: Number of logs to keep in memory, 0 indicates infinite
remote_logging: false, //TODO: true to enable remote logging. You much also set remote_url
remote_url: undefined, //TODO: URL of the remote server to log to

Example:

```javascript
var logger = new Lumberjack({
    passthrough: false,
    history_length: 40,
    remote_logging: true,
    remote_url: 'http://example.net'
});
```

##Known Issues
* Stack Traces don’t return correctly for console.error();
* Lots of things aren't built yet
* Playback and recording doesn't work
