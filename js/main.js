;(function(){
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];

    currentVid = null;

    var wrapperCache = $( '#vid-wrapper' )

    var onethird = parseInt(wrapperCache.css("width"))/3 //console.log($( '#vid-wrapper' ).css("left") + " : " +)

    var leftVolume = 0, rightVolume = 0, panPos = 0;
    var windowWidth = window.innerWidth || document.documentElement.clientWidth|| document.getElementsByTagName('body')[0].clientWidth;

    
    
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

            
            //     console.log('TESTING LISTENER');
            // }, false);
            
           Vid.master.addEventListener('canplaythrough', function(){

                if(PC.popMaster) Popcorn.destroy( PC.popMaster );

                console.log('Master Can Play')
                vidState.master.ready = true;
                Vid.slaveRight.load();

                PC.popMaster = Popcorn( "#master-video", {
                    defaults: {
                        subtitle: {
                            target: "subtitles"
                        }
                    }
                });
                
                switch(currentVid){

                    case 'heide':

                    PC.popMaster.code({
                        start: 8,
                        end: 60,
                        onStart: function(){$('.nav-icons-left').fadeIn(500)} ,
                        onEnd: function(){$('.nav-icons-left').fadeOut(500)}
                    });

                     PC.popMaster.code({
                        start: 77,
                        end: 129,
                        onStart: function(){$('.nav-icons-left').fadeIn(500)},
                        onEnd: function(){$('.nav-icons-left').fadeOut(500)}
                    }); 

                      PC.popMaster.code({
                        start: 131,
                        end: 240,
                        onStart: function(){$('.nav-icons-left').fadeIn(500)},
                        onEnd: function(){$('.nav-icons-left').fadeOut(500)}
                    });   

                    PC.popMaster.code({
                        start: 53,
                        end: 133,
                        onStart: function(){$('.nav-icons-right').fadeIn(500)} ,
                        onEnd: function(){$('.nav-icons-right').fadeOut(500)}
                    });

                     PC.popMaster.code({
                        start: 165,
                        end: 240,
                        onStart: function(){$('.nav-icons-right').fadeIn(500)} ,
                        onEnd: function(){$('.nav-icons-right').fadeOut(500)}
                    });                   
                    break;

                    case 'helen':

                    PC.popMaster.code({
                        start: 36,
                        end: 128,
                        onStart: function(){$('.nav-icons-left').fadeIn(500)} ,
                        onEnd: function(){$('.nav-icons-left').fadeOut(500)}
                    });

                     PC.popMaster.code({
                        start: 148,
                        end: 157,
                        onStart: function(){$('.nav-icons-left').fadeIn(500)},
                        onEnd: function(){$('.nav-icons-left').fadeOut(500)}
                    }); 


                    PC.popMaster.code({
                        start: 41,
                        end: 170,
                        onStart: function(){$('.nav-icons-right').fadeIn(500)} ,
                        onEnd: function(){$('.nav-icons-right').fadeOut(500)}
                    });
                  
                    break;

                    case 'nana_yaa':


                    PC.popMaster.code({
                        start: 0,
                        end: 69,
                        onStart: function(){$('.nav-icons-left').fadeIn(500)} ,
                        onEnd: function(){$('.nav-icons-left').fadeOut(500)}
                    }); 


                    PC.popMaster.code({
                        start: 0,
                        end: 57,
                        onStart: function(){$('.nav-icons-right').fadeIn(500)} ,
                        onEnd: function(){$('.nav-icons-right').fadeOut(500)}
                    });


                    PC.popMaster.parseSRT("assets/subtitles/Nana_Yaa.srt")
                    break;

                    case 'nana_ako':


                    PC.popMaster.code({
                        start: 19,
                        end: 56,
                        onStart: function(){$('.nav-icons-left').fadeIn(500)} ,
                        onEnd: function(){$('.nav-icons-left').fadeOut(500)}
                    }); 


                    PC.popMaster.code({
                        start: 10,
                        end: 91,
                        onStart: function(){$('.nav-icons-right').fadeIn(500)} ,
                        onEnd: function(){$('.nav-icons-right').fadeOut(500)}
                    });

                    PC.popMaster.parseSRT("assets/subtitles/Nana_Ako.srt")

                    break;

                }



            }, false);

            Vid.master.onwaiting = function() {
                console.log('Master is waiting for buffer');
                vidState.master.playing = false;
                if (vidState.slaveRight.playing) {
                    Vid.slaveRight.pause();
                    vidState.slaveRight.playing = false;
                }
                //window.cancelAnimationFrame();
            }

            Vid.master.onstalled = function() {
                console.log('stalled');
            }

            Vid.master.addEventListener('canplaythrough', function(){
                console.log('Master is playing');
                if ($('#vid-wrapper').is(':hidden')) {
                    $('#vid-wrapper').fadeIn(1000);
                }

                // if (!vidState.slaveRight.playing) {
                //     Vid.slaveRight.play();
                //     vidState.slaveRight.playing = true;
                // }
                Vid.sync();
            }, false);

            Vid.slaveRight.addEventListener('canplaythrough', function(){
                if (!vidState.slaveRight.ready) {
                    console.log('Right can play.');
                    vidState.slaveRight.ready = true;
                }

                if (!vidState.slaveLeft.ready)
                    Vid.slaveLeft.load();
            }, false);

            Vid.slaveLeft.addEventListener('canplaythrough', function(){
                
                if (!vidState.slaveLeft.ready) {
                    console.log('Left can play.');
                    vidState.slaveLeft.ready = true;
                    Vid.master.play();
                    // Vid.slaveLeft.play();
                    // Vid.slaveRight.play();
                    vidState.master.playing = true;
                }
            }, false);

            $('#main-nav a').on('click', function() {
                $('#main-nav a').css('color','white')
                var id = $(this).attr('id');
                if(id !='matriarchy'){
                    $(this).css('color','#ff0000')                  
                }

                console.log(id)
                Vid.switchVideo(id); 
            });
        },

        sync: function() {

            // var vidWrapper = document.getElementById('vid-wrapper');
            // var computedLeft = parseInt(window.getComputedStyle(vidWrapper).getPropertyValue('left'), 10);

            // var syncIt = false;
            // if (computedLeft > -windowWidth/2) {
            //     syncIt = 'slaveLeft';
            // } else if (computedLeft < -(windowWidth+windowWidth/2)) {
            //     syncIt = 'slaveRight';
            // } else {
            //     if (!Vid.slaveLeft.paused) {
            //         Vid.slaveLeft.pause();
            //     }
            //     if (!Vid.slaveRight.paused) {
            //         Vid.slaveRight.pause();
            //     }
            // }

            //console.log(computedLeft);
            // if (syncIt) {

                // if (Math.abs(Vid.master.currentTime - Vid[syncIt].currentTime) > 0.5 && Vid.master.currentTime < Vid[syncIt].duration) {
                //     console.log(Vid[syncIt].currentTime + ' | ' + Vid.master.currentTime);
                //     Vid[syncIt].currentTime = Vid.master.currentTime;
                // }

                // if (Vid[syncIt].paused) {
                //     Vid[syncIt].currentTime = Vid.master.currentTime;
                //     console.log('Start playing %s.', syncIt);
                //     Vid[syncIt].play();
                // }
                // if (Math.abs(Vid.master.currentTime - Vid.slaveLeft.currentTime) > 0.5 && Vid.master.currentTime < Vid.slaveLeft.duration) {    
                //     Vid.slaveLeft.currentTime = Vid.master.currentTime;
                // }

                

                 
            // }

            panPos = (parseInt(wrapperCache.css('left')) + onethird) / onethird;

            if (panPos > 0) {
                Vid.slaveRight.volume = 0
                Vid.slaveLeft.volume = Math.abs(panPos)
            } 

            if (panPos < 0) {
                Vid.slaveLeft.volume = 0
                Vid.slaveRight.volume = Math.abs(panPos)
            }

            window.requestAnimationFrame(Vid.sync);
        },
        switchVideo: function(src) {
            currentVid = src

            console.log(src)
            $( '#vid-wrapper' ).css('display','block');

            if(src== 'matriarchy'){

                $('.nav-icons-right').fadeIn(500)
                $('.nav-icons-left').fadeOut(500)

                $('#matriarchy-cover').fadeIn(1000) 

                $('#landing-text').css('display','block')
                $('#subtitles').css('display','none')

            } else {
                $('#subtitles').css('display','block')
                $('.nav-icons-right').css('display','none')
                $('.nav-icons-left').css('display','none')
                $('#landing-text').css('display','none')
                $('#matriarchy-cover').fadeOut(1000)  
            }
            
            Vid.master.pause();
            Vid.slaveRight.pause();
            Vid.slaveLeft.pause();
            vidState.master.playing = false;
            vidState.slaveRight.playing = false;
            vidState.slaveLeft.playing = false;

            vidState.slaveLeft.ready = false;
            vidState.slaveRight.ready = false;
            vidState.master.ready = false;

            
            if(src!= 'matriarchy'){
            $('#vid-wrapper').fadeOut(1000, function(){
                Vid.master.src = 'assets/video/' + src + '_center.mp4';
                Vid.slaveRight.src = 'assets/video/' + src + '_right.mp4';
                Vid.slaveLeft.src = 'assets/video/' + src + '_left.mp4';
                Vid.master.load();
            });
                PC.init(src)
            } else{
                Vid.master.src = '';
                Vid.slaveRight.src = '';
                Vid.slaveLeft.src = '';              
            }
            
        }
    };

    var Handlers = {
        init: function() {
            var tmL, tmR;
            console.log("handlers init")
            $('#left-panel').hover(function() {
                if (tmL) {clearTimeout(tmL);}
                $( '#vid-wrapper' ).addClass('show-left');
                Vid.slaveLeft.currentTime = Vid.master.currentTime;
                Vid.slaveLeft.play();
            }, function() {
                if (tmL) {clearTimeout(tmL);}
                $( '#vid-wrapper' ).removeClass('show-left');
                tmL = setTimeout(function() {
                    Vid.slaveLeft.pause();
                }, 5000);
            });

            $('#right-panel').hover(function() {
                if (tmR) {clearTimeout(tmR);}
                $( '#vid-wrapper' ).addClass('show-right');
                Vid.slaveRight.currentTime = Vid.master.currentTime;
                Vid.slaveRight.play();
            }, function() {
                if (tmR) {clearTimeout(tmR);}
                $( '#vid-wrapper' ).removeClass('show-right');
                tmR = setTimeout(function() {
                    Vid.slaveRight.pause();
                }, 5000);
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

                    // PC.popleft = Popcorn('#left-video')

                    // PC.popLeft.code({
                    //     start: 8,
                    //     end: 60,
                    //     onStart: $('.nav-icons-left').fadeIn(500),
                    //     onEnd: $('.nav-icons-left').fadeOut(500)
                    // });

                    //  PC.popLeft.code({
                    //     start: 77,
                    //     end: 129,
                    //     onStart: $('.nav-icons-left').fadeIn(500),
                    //     onEnd: $('.nav-icons-left').fadeOut(500)
                    // }); 

                    //   PC.popLeft.code({
                    //     start: 131,
                    //     end: 240,
                    //     onStart: $('.nav-icons-left').fadeIn(500),
                    //     onEnd: $('.nav-icons-left').fadeOut(500)
                    // });                              

 
                    // PC.popRight= Popcorn('#right-video')

                    // PC.popRight.code({
                    //     start: 1,
                    //     end: 61,
                    //     onStart: $('.nav-icons-right').fadeIn(500),
                    //     onEnd: $('.nav-icons-right').fadeOut(500)
                    // });

                    //  PC.popRight.code({
                    //     start: 78,
                    //     end: 128,
                    //     onStart: $('.nav-icons-right').fadeIn(500),
                    //     onEnd: $('.nav-icons-right').fadeOut(500)
                    // }); 

                    //   PC.popRight.code({
                    //     start: 131,
                    //     end: 240,
                    //     onStart: $('.nav-icons-right').fadeIn(500),
                    //     onEnd: $('.nav-icons-right').fadeOut(500)
                    // });                              
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