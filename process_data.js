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
    var $game_mode_container = $("#game-options-container");
    var $music_mode_container = $("#music-options-container");
    var $remote_container = $("#remote-container");
    //Misc variables
    var $led_status = false;
    var $current_status;
    var $current_brightness;
    var $current_gamemode
    var current_color = '';
    var current_red;
    var current_green;
    var current_blue;

    $music_mode_display.text(localStorage.getItem("music_mode"));
    ///----------------------------------------------------------
    ///----------------------------------------------------------
    //Send ajax request on page load to get the current status of the led

    $.ajax({
        url: "process_requests.php",
        type: "POST",
        data: JSON.stringify({
            "command": "serverinfo"
        }),
        contentType: "application/json",
        success: function (data) {
            var server_info = JSON.parse(data);
            //Get the current status of the led
            // The status of the led is stored in the info.components array at index 8
            $current_status = server_info.info.components[8].enabled;
            if ($current_status == true) {
                $led_power_switch.prop("checked", true);
                $led_status = true;
                $remote_container.css("display", "block");
            } else {
                $led_power_switch.prop("checked", false);
                $led_status = false;
                $remote_container.css("display", "none");
            }

            //Get the current brightness of the led
            $current_brightness = server_info.info.adjustment[0].brightness;
            //Set the brightness level
            $brightness_level.text($current_brightness + "%");
            $brightness_slider.val($current_brightness);

            //Get the current gamemode status of the led
            $current_gamemode = server_info.info.activeLedColor.length;
            //Set the gamemode switch
            if ($current_gamemode == 1) {
                $gamemode_switch.prop("checked", true);
                current_color = server_info.info.activeLedColor[0]["RGB Value"];
                current_red = current_color[0];
                current_green = current_color[1];
                current_blue = current_color[2];
                var current_rgb_to_hex = rgbToHex(current_red, current_green, current_blue);
                $color_input.val(current_rgb_to_hex);
            } else {
                $gamemode_switch.prop("checked", false);
            }

            //Get the current music mode status of the led
            $current_musicmode = server_info.info.activeEffects.length;
            //Set the music mode switch
            if ($current_musicmode == 1) {
                $musicmode_switch.prop("checked", true);
                //Set the music mode display
                $music_mode_display.text(server_info.info.activeEffects[0].name);
                //console.log(server_info.info.activeEffects[0].name);
            } else {
                $musicmode_switch.prop("checked", false);
            }
            //console.log(server_info);

        }
    });


    $color_input.on("change", function () {
        $current_color = $color_input.val();
        $color_val.text($current_color);
        //comvert hex to rgb
        var rgb = hexToRgb($current_color);
        console.log("Current color set to: " + "{r : " + rgb.r + ", g : " + rgb.g + ", b : " + rgb.b + "}");
    });
    function hexToRgb($hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec($hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    //function to convert rgb to hex
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function controlLEDS() {
        var $toggle_lights = '';
        // Check if checkbox is checked

        $led_power_switch.change(function () {
            if ($(this).is(":checked")) {
                console.log("LEDs turned on");
                $led_status = true;
                localStorage.setItem("led_status", true);
                $remote_container.css("display", "block");
                //send ajax post request to process_requests.php
                $.ajax({
                    url: 'process_requests.php',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "command": "componentstate",
                        "componentstate":
                        {
                            "component": "LEDDEVICE",
                            "state": $led_status
                        }
                    }),
                    success: function (data) {
                        //console.log(data);
                    }
                });
            } else {
                console.log("LEDs turned off");
                $led_status = false;
                localStorage.setItem("led_status", false);
                $remote_container.css("display", "none");
                $.ajax({
                    url: 'process_requests.php',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "command": "componentstate",
                        "componentstate":
                        {
                            "component": "LEDDEVICE",
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
                    //console.log(data);
                }
            });
        });
    }

    function toggleGamemode() {
        var $set_gamemode = '';
        $gamemode_switch.click(function () {
            if ($(this).prop("checked") == true) {
                $game_mode_container.slideDown();
                $music_mode_container.slideUp();

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
                        //console.log(data);
                    }
                });
            } else if ($(this).prop("checked") == false) {
                console.log("Gamemode Off");
                $game_mode_container.slideUp();
                if ($musicmode_switch.prop("checked") == true) {
                    $music_mode_container.slideUp();
                }
                $.ajax({
                    url: 'process_requests.php',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "command": "clear",
                        "priority": 64
                    }),
                    success: function (data) {
                        //console.log(data);
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
                    //console.log(data);
                }
            });
        });
    }

    function toggleMusicMode() {
        var $set_musicmode = '';
        $musicmode_switch.click(function () {
            if ($(this).prop("checked") == true) {
                $music_mode_container.slideDown();
                $game_mode_container.slideUp();
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
                        // console.log(data);
                    }
                });
            } else if ($(this).prop("checked") == false) {
                console.log("Musicmode Off");
                $music_mode_container.slideUp();
                $.ajax({
                    url: 'process_requests.php',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "command": "clear",
                        "priority": 64
                    }),
                    success: function (data) {
                        //console.log(data);
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
                    //console.log(data);
                }
            });
        });

    }

    function detectModeChange() {
        // if game mode is clicked and set as checked, uncheck music mode
        $gamemode_switch.click(function () {
            if ($gamemode_switch.is(':checked')) {
                console.log("Game mode is checked");

                $musicmode_switch.attr('checked', false);
                console.log("Music mode is unchecked");
            }
        });
        // if music mode is clicked and set as checked, uncheck game mode   
        $musicmode_switch.click(function () {
            if ($musicmode_switch.is(':checked')) {
                console.log("Music mode is checked");
                $gamemode_switch.attr('checked', false);
                console.log("Game mode is unchecked");
            }
        });
    }


    function run() {
        controlLEDS();
        controlBrightness();
        toggleGamemode();
        toggleMusicMode();
        detectModeChange();
    }

    run();
});