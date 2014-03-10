;(function(){
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];

    currentVid = null

    var wrapperCache = $( '#vid-wrapper' )

    var onethird = parseInt(wrapperCache.css("width"))/3 //console.log($( '#vid-wrapper' ).css("left") + " : " +)

    var leftVolume = 0, rightVolume = 0, panPos = 0

    
    
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
        slaveRight: document.getElementById('right-video'),
        slaveLeft: document.getElementById('left-video'),
        init: function() {
            Vid.listeners();
            Vid.master.load();
        },
        listeners: function() {
            Vid.master.oncanplaythrough = function() {

                if(PC.popMaster) Popcorn.destroy( PC.popMaster );

                console.log('Master Can Play')
                vidState.master.ready = true;
                Vid.slaveRight.load();
                
                switch(currentVid){

                    case 'nana_yaa':

                    PC.popMaster = Popcorn( "#master-video", {
                        defaults: {
                            subtitle: {
                                target: "subtitles"
                            }
                        }
                    });
                    PC.popMaster.parseSRT("assets/subtitles/Nana_Yaa.srt")
                    break;

                    case 'nana_ako':

                    PC.popMaster = Popcorn( "#master-video", {
                        defaults: {
                            subtitle: {
                                target: "subtitles"
                            }
                        }
                    });
                    PC.popMaster.parseSRT("assets/subtitles/Nana_Ako.srt")
                    break;

                }



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
                Vid.slaveLeft.play();
                Vid.slaveRight.play();
                vidState.master.playing = true;
            }

            $('#main-nav a').on('click', function() {
                $('#main-nav a').css('color','white')
                var id = $(this).attr('id');
                $(this).css('color','#ff0000')
                console.log(id)
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

            panPos =  (parseInt(wrapperCache.css('left')) + onethird) / onethird

            if(panPos > 0) {
                Vid.slaveRight.volume = 0
                Vid.slaveLeft.volume = Math.abs(panPos)
            } 

            if(panPos < 0) {
                Vid.slaveLeft.volume = 0
                Vid.slaveRight.volume = Math.abs(panPos)

            } 

            window.requestAnimationFrame(Vid.sync);
        },
        switchVideo: function(src) {
            currentVid = src
            $( '#vid-wrapper' ).css('display','block');
            Vid.master.pause();
            Vid.slaveRight.pause();
            Vid.slaveLeft.pause();
            vidState.master.playing = false;
            vidState.slaveRight.playing = false;
            vidState.slaveLeft.playing = false;

            $('.panel').fadeOut(1000, function(){
                Vid.master.src = 'assets/video/' + src + '_center.mp4';
                Vid.slaveRight.src = 'assets/video/' + src + '_right.mp4';
                Vid.slaveLeft.src = 'assets/video/' + src + '_left.mp4'
                Vid.master.load();
            });
            PC.init(src)
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
 
        init: function(clip) {
            if(PC.popMaster) Popcorn.destroy( PC.popMaster );
            if(PC.popLeft) Popcorn.destroy( PC.popLeft );
            if(PC.popRight) Popcorn.destroy( PC.popRight );

            switch(clip){
                case 'heide':

                PC.popleft= Popcorn('#left-video')

                PC.popLeft.code({
                    start: 1,
                    end: 61,
                    onStart: $('.nav-icons-left').fadeIn(500),
                    onEnd: $('.nav-icons-left').fadeOut(500)
                });

                 PC.popLeft.code({
                    start: 78,
                    end: 128,
                    onStart: $('.nav-icons-left').fadeIn(500),
                    onEnd: $('.nav-icons-left').fadeOut(500)
                }); 

                  PC.popLeft.code({
                    start: 131,
                    end: 240,
                    onStart: $('.nav-icons-left').fadeIn(500),
                    onEnd: $('.nav-icons-left').fadeOut(500)
                });                              
                break;
 
                PC.popRight= Popcorn('#right-video')

                PC.popRight.code({
                    start: 1,
                    end: 61,
                    onStart: $('.nav-icons-right').fadeIn(500),
                    onEnd: $('.nav-icons-right').fadeOut(500)
                });

                 PC.popRight.code({
                    start: 78,
                    end: 128,
                    onStart: $('.nav-icons-right').fadeIn(500),
                    onEnd: $('.nav-icons-right').fadeOut(500)
                }); 

                  PC.popRight.code({
                    start: 131,
                    end: 240,
                    onStart: $('.nav-icons-right').fadeIn(500),
                    onEnd: $('.nav-icons-right').fadeOut(500)
                });                              
                break; 

            }


        },

        goLeft: function(){

        },

        goRight: function(){

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