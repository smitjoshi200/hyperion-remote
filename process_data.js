$(document).ready(function () {
    //DOM cache
    var $led_on_button = $("#led_on");
    var $led_off_button = $("#led_off");
    var $brightness_level = $("#brightness-level");
    var $gamemode_switch = $("#game-mode-toggle");
    var $brightness_slider = $("#brightness-slider");
    var $red = $("#red");
    var $blue = $("#blue");
    var $green = $("#green");
    var $lime = $("#lime");
    var $yellow = $("#yellow");
    var $orange = $("#orange");
    var $color_input = $("#color-input");
    var $color_val = $("#color-val");
    //Misc variables
    var $led_status = false;
    var $my_window;
    var timeout = 100;

    $color_input.on("change", function () {
        $current_color = $color_input.val();
        $color_val.text($current_color);
        //comvert hex to rgb
        var rgb = hexToRgb($current_color);
        console.log(rgb["r"]);
    });
    function hexToRgb($hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec($hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }



    function windowOperation($window, $command) {
        $window = window.open($command);
        $window.blur()
        window.focus();
        setTimeout(function () {
            $window.close()
        }, timeout);
    }

    function controlLEDS() {
        var $toggle_lights = '';
        //Detect button click
        $led_on_button.click(function () {
            console.log("LEDs turned on");
            $led_status = true;
            $toggle_lights = 'http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22componentstate%22,%22componentstate%22:%7B%22component%22:%22ALL%22,%22state%22:' + $led_status.toString() + '%7D%7D';
            windowOperation($my_window, $toggle_lights);
        }); // On button clicked

        $led_off_button.click(function () {
            console.log("LEDs turned off");
            $led_status = false;
            $toggle_lights = 'http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22componentstate%22,%22componentstate%22:%7B%22component%22:%22ALL%22,%22state%22:' + $led_status.toString() + '%7D%7D';
            windowOperation($my_window, $toggle_lights);
        }); //Off button clicked
    }

    function controlBrightness() {
        var $set_brightness = '';
        //Detect brightness slider change
        $brightness_slider.on("change", function () {
            var $brightness_value = $brightness_slider.val();
            $brightness_level.text($brightness_value + "%");
            console.log("Brightness set to " + $brightness_value + "%");
            $set_brightness = "http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22adjustment%22,%22adjustment%22:%7B%22classic_config%22:false,%22brightness%22:" + $brightness_value.toString() + "%7D%7D";
            windowOperation($my_window, $set_brightness);
        });
    }

    function toggleGamemode() {
        var $set_gamemode = '';
        $gamemode_switch.click(function () {
            if ($(this).prop("checked") == true) {
                console.log("Gamemode On");
                $set_gamemode = "http://192.168.1.117:8090/json-rpc?request=%7B%20%20%22command%22:%22color%22,%20%20%22color%22:%5B0,37,255%5D,%20%20%22duration%22:0,%20%20%22priority%22:100,%20%20%22origin%22:%22JSON%20API%22%7D";
                windowOperation($my_window, $set_gamemode);
            } else if ($(this).prop("checked") == false) {
                console.log("Gamemode Off");
                $set_gamemode = "http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22clear%22,%22priority%22:100%7D"
                windowOperation($my_window, $set_gamemode);
            }
        });
        $color_input.on("change", function () {
            $current_color = $color_input.val();
            $color_val.text($current_color);
            //convert hex to rgb
            var rgb = hexToRgb($current_color);
            console.log(rgb["r"]);
            $set_gamemode = "http://192.168.1.117:8090/json-rpc?request=%7B%20%20%22command%22:%22color%22,%20%20%22color%22:%5B" + rgb["r"].toString() + "," + rgb["g"].toString() + "," + rgb["b"].toString() + "%5D,%20%20%22duration%22:0,%20%20%22priority%22:100,%20%20%22origin%22:%22JSON%20API%22%7D";
            windowOperation($my_window, $set_gamemode);
        });
    }

    function run() {
        controlLEDS();
        controlBrightness();
        toggleGamemode();
    }

    run();
});