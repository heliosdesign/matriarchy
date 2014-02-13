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
        slaveRight: {},
        slaveLeft: {}
    };

    var Vid = {
        master: document.getElementById('master-video'),
        slaveRight: document.getElementById('slave-right-video'),
        slaveLeft: document.getElementById('slave-left-video'),
        init: function() {
            Vid.listeners();
            Vid.master.load();
        },
        listeners: function() {
            Vid.master.oncanplaythrough = function() {
                console.log('Master Can Play')
                vidState.master.ready = true;
                Vid.slaveRight.load();
            }

            Vid.master.onwaiting = function() {
                console.log('Master is waiting for buffer');
                vidState.master.playing = false;
                if (vidState.slaveRight.playing) {
                    Vid.slaveRight.pause();
                    vidState.slaveRight.playing = false;
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
                if (!vidState.slaveRight.playing) {
                    Vid.slaveRight.play();
                    vidState.slaveRight.playing = true;
                }
                Vid.sync();
            }

            Vid.slaveRight.oncanplaythrough = function() {
                console.log('Right slave can play.');
                vidState.slaveRight.ready = true;
                Vid.slaveLeft.load();
            }

            Vid.slaveLeft.oncanplaythrough = function() {
                console.log('Left slave can play.');
                vidState.slaveLeft.ready = true;
                Vid.master.play();
                vidState.master.playing = true;
            }

            $('#main-nav a').on('click', function() {
                var id = $(this).attr('id');
                Vid.switchVideo(id); 
            });
        },
        sync: function() {

            if (Math.abs(Vid.master.currentTime - Vid.slaveRight.currentTime) > 0.2 && Vid.master.currentTime < Vid.slaveRight.duration) {
                Vid.slaveRight.currentTime = Vid.master.currentTime;
            }

            if (Math.abs(Vid.master.currentTime - Vid.slaveLeft.currentTime) > 0.2 && Vid.master.currentTime < Vid.slaveLeft.duration) {
                Vid.slaveLeft.currentTime = Vid.master.currentTime;
            }
        
            window.requestAnimationFrame(Vid.sync);
        },
        switchVideo: function(src) {
            Vid.master.pause();
            Vid.slaveRight.pause();
            Vid.slaveLeft.pause();
            vidState.master.playing = false;
            vidState.slaveRight.playing = false;
            vidState.slaveLeft.playing = false;

            $('.panel').fadeOut(1000, function(){
                Vid.master.src = 'assets/video/' + src + '_master.webm';
                Vid.slaveRight.src = 'assets/video/' + src + '_slave_right.webm';
                Vid.slaveLeft.src = 'assets/video/' + src + '_slave_left.webm'
                Vid.master.load();
            });
        }
    };

    var Handlers = {
        init: function() {
            $('#left-panel').hover(function() {
                $( '#vid-wrapper' ).addClass('show-left');
            }, function() {
                $( '#vid-wrapper' ).removeClass('show-left');
            });

            $('#right-panel').hover(function() {
                $( '#vid-wrapper' ).addClass('show-right');
            }, function() {
                $( '#vid-wrapper' ).removeClass('show-right');
            });
        }
    }

    var PC = {
        popMaster: Popcorn('#master-video'),
        popRight: Popcorn('#slave-right-video'),
        popLeft: Popcorn('#slave-left-video'),
        init: function() {
           PC.popMaster.code({
                start: 1,
                end: 3,
                onStart: PC.starting,
                onEnd: PC.ending,
                target: 'master'
            });
        },
        starting: function(options) {
            console.log(options);
        },
        ending: function(options) {

        }
    }

    Vid.init();
    Handlers.init();
    PC.init();

})();