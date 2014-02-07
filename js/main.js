;(function(){
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

    var vidState = {
        master: {},
        slave: {}
    };

    var Vid = {
        master: document.getElementById('master-video'),
        slave: document.getElementById('slave-video'),
        init: function() {
            Vid.listeners();
            Vid.master.load();
        },
        listeners: function() {
            Vid.master.oncanplaythrough = function() {
                console.log('Master Can Play')
                vidState.master.ready = true;
                Vid.slave.load();
            }

            Vid.master.onwaiting = function() {
                console.log('Master is waiting for buffer');
                vidState.master.playing = false;
                if (vidState.slave.playing) {
                    Vid.slave.pause();
                    vidState.slave.playing = false;
                }
                window.cancelAnimationFrame();
            }

            Vid.master.onstalled = function() {
                console.log('stalled');
            }

            Vid.master.onplaying = function() {
                console.log('Master is playing');
                if ($('.panel').is(':hidden')) {
                    $('.panel').fadeIn(1000);
                }
                if (!vidState.slave.playing) {
                    Vid.slave.play();
                    vidState.slave.playing = true;
                }
                Vid.sync();
            }

            Vid.slave.oncanplaythrough = function() {
                console.log('Slave can play.')
                vidState.slave.ready = true;
                Vid.master.play();
                vidState.master.playing = true;
            }

            $('#main-nav a').on('click', function() {
                var id = $(this).attr('id');
                Vid.switchVideo(id); 
            });
        },
        sync: function() {

            if (Math.abs(Vid.master.currentTime - Vid.slave.currentTime) > 0.2 && Vid.master.currentTime < Vid.slave.duration) {
                Vid.slave.currentTime = Vid.master.currentTime;
            }
        
            window.requestAnimationFrame(Vid.sync);
        },
        switchVideo: function(src) {
            Vid.master.pause();
            Vid.slave.pause();
            vidState.master.playing = false;
            vidState.slave.playing = false;

            $('.panel').fadeOut(1000, function(){
                Vid.master.src = 'assets/video/' + src + '_master.webm';
                Vid.slave.src = 'assets/video/' + src + '_slave.webm';
                Vid.master.load();
            });
        }
    };

    Vid.init();

})();