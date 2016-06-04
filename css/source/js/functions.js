// Functions
// @author Dario Ruellan <druellan@sfidastudios.com>

/**
 *
 * @param  {array/obj} settings
 */
function id_function(settings) {

    var self = this;

    var defaultSettings = {

    };
    settings = $.extend(true, defaultSettings, settings);


    //  -- 8< -- Private functions

    function create() {

    }


    //  -- 8< -- Public functions

    self.destroy = function() {

    };


    // -- 8< -- Public variables

    self.settings = settings;
}