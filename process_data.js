$(document).ready(function () {
    //DOM cache
    var $led_power_switch = $("#led-power-switch");
    var $brightness_level = $("#brightness-level");
    var $gamemode_switch = $("#game-mode-toggle");
    var $musicmode_switch = $("#music-mode-toggle");
    var $brightness_slider = $("#brightness-slider");
    var $color_input = $("#color-input");
    var $color_val = $("#color-val");
    var $music_selected_option = $("#music-mode-select");
    var $music_mode_display = $("#music-mode-display");
    //Misc variables
    var $led_status = false;
    $music_mode_display.text(localStorage.getItem("music_mode"));


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

    function controlLEDS() {
        var $toggle_lights = '';
        // Check if checkbox is checked

        $led_power_switch.change(function () {
            if ($(this).is(":checked")) {
                console.log("LEDs turned on");
                $led_status = true;
                localStorage.setItem("led_status", true);
                //send ajax post request to process_requests.php
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
            } else {
                console.log("LEDs turned off");
                $led_status = false;
                localStorage.setItem("led_status", false);
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
            }
            if (localStorage.getItem("led_status") == true) {
                $led_power_switch.prop("checked", true);
                console.log("LEDs are on");
            }
            else if (localStorage.getItem("led_status") == false) {
                $led_power_switch.prop("checked", false);
                console.log("LEDs are off");
            }
            else {
                console.log("LEDs are off");
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
            }
        });
        $color_input.on("change", function () {
            $current_color = $color_input.val();
            $color_val.text($current_color);
            //convert hex to rgb
            var rgb = hexToRgb($current_color);

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
        });
    }

    function toggleMusicMode() {
        var $set_musicmode = '';
        $musicmode_switch.click(function () {
            if ($(this).prop("checked") == true) {
                $default_music_mode = JSON.stringify({
                    "command": "effect",
                    "effect": {
                        "name": "Music: pulse waves for LED strip (MULTI COLOR)"
                    },
                    "duration": 0,
                    "priority": 64,
                    "origin": "JSON API"
                });

                console.log("Musicmode On");
                if (localStorage.getItem("current_music_mode") === null) {
                    localStorage.setItem("current_music_mode", $default_music_mode);
                }
                $.ajax({
                    url: 'process_requests.php',
                    type: 'POST',
                    contentType: 'application/json',
                    data: localStorage.getItem("current_music_mode"),
                    success: function (data) {
                        console.log(data);
                    }
                });
            } else if ($(this).prop("checked") == false) {
                console.log("Musicmode Off");

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
            }
        });
        //detect change in the selected option
        $music_selected_option.change(function () {
            console.log("music mode changed");
            var $selected_option = $(this).val();
            var $selected_mode = '';
            //get text from selected option
            var $selected_mode_text = $music_selected_option.find("option:selected").text();
            localStorage.setItem("music_mode", $selected_mode_text);

            $music_mode_display.text(localStorage.getItem('music_mode'));
            localStorage.setItem('music_mode_id', $selected_option);
            switch ($selected_option) {
                case "1":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: pulse waves for LED strip (MULTI COLOR)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "2":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: fullscreen pulse (MULTI COLOR)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "3":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: fullscreen pulse (RED)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "4":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: fullscreen pulse (YELLOW)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "5":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: fullscreen pulse (GREEN)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "6":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: fullscreen pulse (BLUE)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "7":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: stereo for LED strip (MULTI COLOR)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "8":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: stereo for LED strip (RED)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "9":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: stereo for LED strip (YELLOW)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "10":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: stereo for LED strip (GREEN)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "11":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: stereo for LED strip (BLUE)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "12":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: quatro for LED strip (MULTI COLOR)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "13":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: quatro for LED strip (RED)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "14":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: quatro for LED strip (YELLOW)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "15":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: quatro for LED strip (GREEN)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
                case "16":
                    $selected_mode = {
                        "command": "effect",
                        "effect": {
                            "name": "Music: quatro for LED strip (BLUE)"
                        },
                        "duration": 0,
                        "priority": 64,
                        "origin": "JSON API"
                    };
                    break;
            }
            localStorage.setItem("current_music_mode", JSON.stringify($selected_mode));
            //send the selected option to the server
            $.ajax({
                url: "process_requests.php",
                type: "POST",
                data: localStorage.getItem("current_music_mode"),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                }
            });
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