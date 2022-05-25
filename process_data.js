$(document).ready(function() {
    //DOM cache
    var $led_on_button = $("#led_on");
    var $led_off_button = $("#led_off");
    var $brightness_panel = $("#brightness-control");
    var $gamemode_switch = $("#game-mode-toggle");
    var $red = $("#red");
    var $blue = $("#blue");
    var $green = $("#green");
    var $lime = $("#lime");
    var $yellow = $("#yellow");
    var $purple = $("purple");
    var $orange = $("#orange");
    //Misc variables
    var $led_status = false;
    var $my_window;
    var timeout = 1000;
    const $brightness_array = [
        25,
        50,
        75,
        100
    ];
    console.log($brightness_array[0].toString());

    function windowOperation($window, $command) {
        $window = window.open($command);
        $window.blur()
        window.focus();
        setTimeout(function() {
            $window.close()
        }, timeout);
    }

    function controlLEDS() {
        var $toggle_lights = '';
        //Detect button click
        $led_on_button.click(function() {
            console.log("LEDs turned on");
            $led_status = true;
            $toggle_lights = 'http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22componentstate%22,%22componentstate%22:%7B%22component%22:%22ALL%22,%22state%22:' + $led_status.toString() + '%7D%7D';
            windowOperation($my_window, $toggle_lights);
        }); // On button clicked

        $led_off_button.click(function() {
            console.log("LEDs turned off");
            $led_status = false;
            $toggle_lights = 'http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22componentstate%22,%22componentstate%22:%7B%22component%22:%22ALL%22,%22state%22:' + $led_status.toString() + '%7D%7D';
            windowOperation($my_window, $toggle_lights);
        }); //Off button clicked
    }

    for (let i = 0; i < $brightness_array.length; i++) {
        $brightness_panel.append("<button class='button' id='brightness_" +
            $brightness_array[i] + "'>" +
            $brightness_array[i] +
            "</button>")
    }

    //DOM Cache (Brightness Buttons)
    var $low = $("#brightness_25");
    var $medium = $("#brightness_50");
    var $high = $("#brightness_75");
    var $highest = $("#brightness_100");

    function controlBrightness() {
        var $set_brightness = '';
        $low.click(function() {
            console.log("Brightness set to 25%");
            $set_brightness = "http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22adjustment%22,%22adjustment%22:%7B%22classic_config%22:false,%22brightness%22:" + $brightness_array[0].toString() + "%7D%7D";
            windowOperation($my_window, $set_brightness);
        });
        $medium.click(function() {
            console.log("Brightness set to 50%");
            $set_brightness = "http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22adjustment%22,%22adjustment%22:%7B%22classic_config%22:false,%22brightness%22:" + $brightness_array[1].toString() + "%7D%7D";
            windowOperation($my_window, $set_brightness);
        });
        $high.click(function() {
            console.log("Brightness set to 75%");
            $set_brightness = "http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22adjustment%22,%22adjustment%22:%7B%22classic_config%22:false,%22brightness%22:" + $brightness_array[2].toString() + "%7D%7D";
            windowOperation($my_window, $set_brightness);
        });
        $highest.click(function() {
            console.log("Brightness set to 100%");
            $set_brightness = "http://192.168.1.117:8090/json-rpc?request=%7B%22command%22:%22adjustment%22,%22adjustment%22:%7B%22classic_config%22:false,%22brightness%22:" + $brightness_array[3].toString() + "%7D%7D";
            windowOperation($my_window, $set_brightness);
        });
    }

    function toggleGamemode() {
        var $set_gamemode = '';
        $gamemode_switch.click(function() {
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
        $red.click(function() {
            $set_gamemode = "http://192.168.1.117:8090/json-rpc?request=%7B%20%20%22command%22:%22color%22,%20%20%22color%22:%5B255,0,0%5D,%20%20%22duration%22:0,%20%20%22priority%22:100,%20%20%22origin%22:%22JSON%20API%22%7D";
            windowOperation($my_window, $set_gamemode);
        });
        $blue.click(function() {
            $set_gamemode = "http://192.168.1.117:8090/json-rpc?request=%7B%20%20%22command%22:%22color%22,%20%20%22color%22:%5B0,0,255%5D,%20%20%22duration%22:0,%20%20%22priority%22:100,%20%20%22origin%22:%22JSON%20API%22%7D";
            windowOperation($my_window, $set_gamemode);
        });
        $green.click(function() {
            $set_gamemode = "http://192.168.1.117:8090/json-rpc?request=%7B%20%20%22command%22:%22color%22,%20%20%22color%22:%5B0,255,5%5D,%20%20%22duration%22:0,%20%20%22priority%22:100,%20%20%22origin%22:%22JSON%20API%22%7D";
            windowOperation($my_window, $set_gamemode);
        });
        $lime.click(function() {
            $set_gamemode = "http://192.168.1.117:8090/json-rpc?request=%7B%20%20%22command%22:%22color%22,%20%20%22color%22:%5B165,255,0%5D,%20%20%22duration%22:0,%20%20%22priority%22:100,%20%20%22origin%22:%22JSON%20API%22%7D";
            windowOperation($my_window, $set_gamemode);
        });
        $yellow.click(function() {
            $set_gamemode = "http://192.168.1.117:8090/json-rpc?request=%7B%20%20%22command%22:%22color%22,%20%20%22color%22:%5B250,255,0%5D,%20%20%22duration%22:0,%20%20%22priority%22:100,%20%20%22origin%22:%22JSON%20API%22%7D";
            windowOperation($my_window, $set_gamemode);
        });
        $orange.click(function() {
            $set_gamemode = "http://192.168.1.117:8090/json-rpc?request=%7B%20%20%22command%22:%22color%22,%20%20%22color%22:%5B245,145,0%5D,%20%20%22duration%22:0,%20%20%22priority%22:100,%20%20%22origin%22:%22JSON%20API%22%7D";
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