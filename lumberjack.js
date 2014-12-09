/**
 * Lumberjack.js
 *
 * Client side logger that can send logs to remote servers
 *
 * TODO:
 *  - Group
 *  - Profile?
 */

function Lumberjack(configs){
    configs = configs || {};
    /**
     * Configurations
     * @type {boolean|*}
     */
    configs.passthrough     = configs.passthrough    || true;
    configs.history_length  = configs.history_length || 0;
    configs.remote_logging  = configs.remote_logging || false;
    configs.remote_url      = configs.remote_url     || undefined;

    /**
     * Private Variables
     * @type {string[]}
     */
    var history = []; //record history
    var history_index = 0;//Keeps track of how many items are in the history. This should only be incremented. Modulus should have on "display"
    //Simple Function - pretty much passthrough. All handle by simple handler
    var simple = ['log', 'table', 'error', 'warn'];


    /*
     * Mapping and Exporting of Functions
     */
    for(var i = 0; i < simple.length; i++){
        this[simple[i]] = simpleHandler(simple[i]);
    }


    /*
     * Handlers
     */
    function simpleHandler(type){
        //handler functionality
        return function(){
            if(configs.passthrough === true){
                console[type].apply(console,arguments);
            }
            record(type, arguments);
            send(type, arguments);
        }
    }

    /*
     * History Management
     */
    /**
     * Records a new item in the history.
     * This must obey config.history_length
     */
    function record(type, args){
        var insert_index = history_index;

        //when history_length is not zero, enforce ring history
        if(configs.history_length !== 0){
            insert_index = history_index % configs.history_length;
        }

        history[insert_index] = {
             type: type
            ,args: args
        };

        history_index++;
    }

    /**
     * Playback a certain amount of the history to the console
     * @param number Number of items to playback. Undefined and 0 default to all
     */
    function playback(number){
        //This guarantees we will never playback more element
        //than what exists in the history
        var playback_length = Math.min(history_index, configs.history_length);

        //If we have a non-zero number, prefer that
        if(!(number === 0 || number === undefined)){
            playback_length = Math.min(number, playback_length);
        }


        var start_index = 0;
        //when the index is longer than the length, we've made a ring
        //handle this appropriately;
        if(history_index >= configs.history_length) {
            start_index = history_index % configs.history_length;
        }

        for(var i = start_index; i < playback_length; i++){
            console[history[i][type]].apply(console,history[i][args]); //output to console
        }
    }

    /*
     * Remote Logging
     */
    function send(type, arguments){
        //Do nothing is we don't have logging enabled

        if(!(configs.remote_logging !== false || configs.remote_url !== undefined)) return;
        var data = {};
        data[type] = arguments;

        var request = new XMLHttpRequest();
        request.open('POST', configs.remote_url, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.send(JSON.stringify(data));
    }


    /*
     * Exports
     */
    this.playback = playback;
    this.record = record;


    /**
     * Protect window.console method calls, e.g. console is not defined on IE
     * unless dev tools are open, and IE doesn't define console.debug
     *
     * Special thanks to Peter Tseng: http://stackoverflow.com/a/13817235/2132305
     */
    (function () {
        if (!window.console) {
            window.console = {};
        }
        // union of Chrome, FF, IE, and Safari console methods
        var m = [
            "log", "info", "warn", "error", "debug", "trace", "dir", "group",
            "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
            "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
        ];
        // define undefined methods as noops to prevent errors
        for (var i = 0; i < m.length; i++) {
            if (!window.console[m[i]]) {
                window.console[m[i]] = function () {
                };
            }
        }
    })();

};
