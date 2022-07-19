$(document).ready(function () {
    //DOM cache
    var $led_power_switch = $("#led-power-switch");
    var $brightness_level = $("#brightness-level");
    var $gamemode_switch = $("#game-mode-toggle");
    var $musicmode_switch = $("#music-mode-toggle");
    var $brightness_slider = $("#brightness-slider");
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
        // Check if checkbox is checked
        $led_power_switch.change(function () {
            if ($(this).is(":checked")) {
                console.log("LEDs turned on");
                $led_status = true;
                //send ajax post request to http://192.168.1.117/json-rpc
                $.ajax({
                    url: 'process_requests.php',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "command": "componentstate",
                        "componentstate":
                        {
                            "component": "ALL",
                            "state": $led_status
                        }
                    }),
                    success: function (data) {
                        console.log(data);
                    }
                });
                //$toggle_lights = 'http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22componentstate%22,%22componentstate%22:%7B%22component%22:%22ALL%22,%22state%22:' + $led_status.toString() + '%7D%7D';
                //windowOperation($my_window, $toggle_lights);
            } else {
                console.log("LEDs turned off");
                $led_status = false;
                $.ajax({
                    url: 'process_requests.php',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "command": "componentstate",
                        "componentstate":
                        {
                            "component": "ALL",
                            "state": $led_status
                        }
                    }),
                    success: function (data) {
                        console.log(data);
                    }
                });
                //$toggle_lights = 'http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22componentstate%22,%22componentstate%22:%7B%22component%22:%22ALL%22,%22state%22:' + $led_status.toString() + '%7D%7D';
                //windowOperation($my_window, $toggle_lights);
            }
        });
    }

    function controlBrightness() {
        var $set_brightness = '';
        //Detect brightness slider change
        $brightness_slider.on("change", function () {
            var $brightness_value = $brightness_slider.val();
            $brightness_level.text($brightness_value + "%");
            console.log("Brightness set to " + $brightness_value + "%");
            $.ajax({
                url: 'process_requests.php',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    "command": "adjustment",
                    "adjustment":
                    {
                        "classic_config": false,
                        "brightness": parseInt($brightness_value)
                    }
                }),
                success: function (data) {
                    console.log(data);
                }
                // $set_brightness = "http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22adjustment%22,%22adjustment%22:%7B%22classic_config%22:false,%22brightness%22:" + $brightness_value.toString() + "%7D%7D";
                // windowOperation($my_window, $set_brightness);
            });
        });
    }

    function toggleGamemode() {
        var $set_gamemode = '';
        $gamemode_switch.click(function () {
            if ($(this).prop("checked") == true) {
                console.log("Gamemode On");
                $.ajax({
                    url: 'process_requests.php',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "command": "color",
                        "color": [155, 255, 146],
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    }),
                    success: function (data) {
                        console.log(data);
                    }
                });
                // $set_gamemode = "http://192.168.1.117:8090/json-rpc?request=%7B%20%20%22command%22:%22color%22,%20%20%22color%22:%5B0,37,255%5D,%20%20%22duration%22:0,%20%20%22priority%22:100,%20%20%22origin%22:%22JSON%20API%22%7D";
                // windowOperation($my_window, $set_gamemode);
            } else if ($(this).prop("checked") == false) {
                console.log("Gamemode Off");
                $.ajax({
                    url: 'process_requests.php',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "command": "clear",
                        "priority": 64
                    }),
                    success: function (data) {
                        console.log(data);
                    }
                });
                // $set_gamemode = "http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22clear%22,%22priority%22:100%7D"
                // windowOperation($my_window, $set_gamemode);
            }
        });
        $color_input.on("change", function () {
            $current_color = $color_input.val();
            $color_val.text($current_color);
            //convert hex to rgb
            var rgb = hexToRgb($current_color);
            //console.log(rgb["r"]);

            $.ajax({
                url: 'process_requests.php',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    "command": "color",
                    "color": [parseInt(rgb["r"]), parseInt(rgb["g"]), parseInt(rgb["b"])],
                    "duration": 0,
                    "priority": 64,
                    "origin": "JSON API"
                }),
                success: function (data) {
                    console.log(data);
                }
            });
            // $set_gamemode = "http://192.168.1.117:8090/json-rpc?request=%7B%20%20%22command%22:%22color%22,%20%20%22color%22:%5B" + rgb["r"].toString() + "," + rgb["g"].toString() + "," + rgb["b"].toString() + "%5D,%20%20%22duration%22:0,%20%20%22priority%22:100,%20%20%22origin%22:%22JSON%20API%22%7D";
            // windowOperation($my_window, $set_gamemode);
        });
    }

    function toggleMusicMode() {
        var $set_musicmode = '';
        $musicmode_switch.click(function () {
            if ($(this).prop("checked") == true) {
                console.log("Musicmode On");

                $.ajax({
                    url: 'process_requests.php',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "command": "effect",
                        "effect": {
                            "name": "Music: quatro for LED strip (RED)"
                        },
                        "duration": 0,
                        "priority": 66,
                        "origin": "JSON API"
                    }),
                    success: function (data) {
                        console.log(data);
                    }
                });

                // $set_musicmode = "http://192.168.1.117:8090/json-rpc?request=%7B%20%20%22command%22:%22effect%22,%20%20%22effect%22:%7B%20%20%20%20%22name%22:%22Music:%20stereo%20for%20LED%20strip%20(GREEN)%22%20%20%7D,%20%20%22duration%22:0,%20%20%22priority%22:66,%20%20%22origin%22:%22JSON%20API%22%7D";
                // windowOperation($my_window, $set_musicmode);
            } else if ($(this).prop("checked") == false) {
                console.log("Musicmode Off");

                $.ajax({
                    url: 'process_requests.php',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "command": "clear",
                        "priority": 66
                    }),
                    success: function (data) {
                        console.log(data);
                    }
                });
                // $set_musicmode = "http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22clear%22,%22priority%22:66%7D";
                // windowOperation($my_window, $set_musicmode);
            }
        });
    }


    function run() {
        controlLEDS();
        controlBrightness();
        toggleGamemode();
        toggleMusicMode();
    }

    run();
});