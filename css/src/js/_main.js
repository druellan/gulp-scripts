// Main JS
// @author Dario Ruellan <druellan@sfidastudios.com>
// @uses jQuery

var DEBUG = true;

if(!DEBUG){
    if(!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for(var i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
}

(function($){

	// Starting tasks here --

})(jQuery);
