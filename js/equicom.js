function MorphActionClass() {

    var _this = this;

    this.started = false;

    this.preload = function() {

        this.navigation = $(".sysSlide .navigation");
        this.animator = $("#logo-animator");
        this.svg = $("#LogoNube")[0];
        this.animator.addClass("show");

    };

    this.updatePos = function() {

        if (!this.started) return;

        var navigation = this.navigation,
            offset = navigation.offset(),
            height = navigation.height(),
            offsetY = 10,
            offsetX = 20;
        this.animator.addClass("ready").css({
            left: (offset.left + offsetX) + 'px',
            top: (offset.top + height + offsetY) + 'px'
        });
    };

    this.next = function(numSlide) {

        if (!this.started) return;

        var path = $("#ANIMATOR_" + numSlide);
        if (path.length) {

            var next_fill = path.attr("fill") || "#ffffff";
            TweenMax.to(this.svg, 1.005, {
                morphSVG: path[0],
                yoyo: true,
                fill: next_fill,
                repeat: 0
            });
        } else {
            //this.animator.addClass("hide");
        }
    };

    this.start = function() {

        this.started = true;
        this.animator.addClass("ready");
        this.updatePos();
        setTimeout(function() {
            //End preloader animations
            $("[data-stop]").data("stop", 0);
            _this.animator.addClass("endAnimate");
        }, 500 + 250); //#logo-animator effect time
    };

}

function EquicomClass() {

    let _this = this;
    this.mensajeStatus = 0;
    this.timeout = 0;

    let mensajeAnimateObjects = ["sonrisa", "ojoIzquierdo", "ojoDerecho"];

    this.animarMensaje = function(on) {

        if ((!this.mensajeStatus && !on) || (this.mensajeStatus && on)) return;

        this.mensajeStatus = on;

        if (this.timeout) clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {

            mensajeAnimateObjects.forEach((object) => {

                const obj = $("#" + object),
                    next = $("#" + object + (!on ? "" : "On"));

                if (!obj.length || !next.length) return;

                TweenMax.to(obj[0], 1.005, {
                    morphSVG: next[0],
                    yoyo: true,
                    //fill: next_fill,
                    repeat: 0
                });
            });

        }, 1000);

        $(".cliente-wrap")[on ? "addClass" : "removeClass"]("on");

    }

    this.busquedaDocumento = function(numero_documento) {

        $.getJSON(`./controllers/sunat.php?numero_documento=${numero_documento}`, data => {
            if (!(data || []).length) return;
            let is_dni = data[0].length === 8,
                html = `${is_dni ? '...estamos contentos de interesarte en nuestro servicio, ' : '...estamos contentos de interesarte en nuestro servicio, '} <b>${data[0]}</b>`;
            //if (data[1] !== undefined) html += ` <br /> <i>${data[1]}</i>`;
            $(".cliente-datos").html(html);
            let celObject = $("[name='celular']");
            if (celObject.val().length >= 9) $("[name='tipo']").focus();
            else $("[name='celular']").focus();
            this.animarMensaje(1);
        });
    };

    this.enviarFormulario = () => $("#formulario").submit();

    this.EnviarFormulario = element => {
        const form = $(element),
            submitButton = $("[type='submit']", form);

        console.log("form", form);
        submitButton.prop("disabled", true);
        submitButton.text("Enviando...");

        return false;
    };


    let textos = [
            "- Soluciones Tecnológicas Corporativas",
            "- El mejor equipo Tecnológico de Piura",
            //"Equicom más cerca de ti...",
            "- Tenemos la mejor solución para tu negocio...",
            "- Sistemas con las últimas tecnologías"
        ],
        current = 0;

    this.stopAnimateHeader = () => {
        this.intervalAnimate && clearInterval(this.intervalAnimate);
        $("body nav .logo").removeClass("startInterval");
    };

    this.animateHeader = () => {

        this.intervalAnimate && clearInterval(this.intervalAnimate);

        function feedAnimate() {

            $(".slide-1 h1").html(textos[current++ % textos.length]);

            var tl = new TimelineMax({ delay: current === 1 ? 0.5 : 0, repeat: 0 }),
                mySplitText = new SplitText(".slide-1 h1", { type: "words,chars" }),
                chars = mySplitText.chars; //an array of all the divs that wrap each character

            TweenLite.set(".slide-1 h1", { perspective: 400 });

            tl.staggerFrom(chars, 0.8, {
                opacity: 0,
                scale: 0,
                y: 10,
                rotationX: 90,
                transformOrigin: "0% 50% -50",
                ease: Back.easeOut.config(1)
            }, 0.01, "+=0.15");

            tl.add("explode", "+=3");

            for (var i = 0; i < chars.length; i++) {
                tl.to(mySplitText.chars[i], 2, {
                    opacity: 0,
                    //scale: 0,
                    x: 100,
                    //rotationX: -90,
                    transformOrigin: "0% 50% -50",
                    ease: Back.easeOut
                }, "explode+=0.1");

            }
        }

        this.intervalAnimate = setInterval(feedAnimate, 5000);
        feedAnimate();
        $("body nav .logo").addClass("startInterval");



        //

        var tl = new TimelineMax({ delay: 1, repeat: 0 }),
            mySplitText = new SplitText(".slide-1 .text-container-right ul li a", { type: "words,chars" }),
            chars = mySplitText.chars; //an array of all the divs that wrap each character


        TweenLite.set(".slide-1 .text-container-right ul li a", { perspective: 400 });

        tl.staggerFrom(chars, 0.8, {
            opacity: 0,
            scale: 0,
            y: 10,
            rotationX: -90,
            transformOrigin: "0% 50% -50",
            ease: Back.easeOut.config(1)
        }, 0.01, "+=0.15");

        function randomNumber(min, max) {
            return Math.floor(Math.random() * (1 + max - min) + min);
        }

    }

    this.inicializar = function() {

        $('form.material').materialForm();

        let oldVal;

        $("[name='numero_documento']").keydown(function(e) {
            setTimeout(() => {
                const val = $(this).val();
                if (oldVal != val && (val.length === 8 || val.length === 11)) {
                    oldVal = val;
                    _this.busquedaDocumento(val);
                } else {
                    _this.animarMensaje(0);
                }
            });
        });

    }

    /*function textFireworks(i, e) {
        var n = i.element,
            s = i.animationType,
            r = i.delay;
        switch (s) {
            case "jellyType":
                var l = new TimelineMax({
                        paused: true
                    }),
                    t = new SplitText(n, {
                        type: "words,chars"
                    }),
                    c = t.chars;
                break;
            case "smoothEntrance":
                var l = new TimelineMax({
                        paused: true
                    }),
                    t = new SplitText(n, {
                        type: "words,chars"
                    }),
                    c = t.chars;
                break
        }
        var a = function(e) {
            switch (s) {
                case "jellyType":
                    TweenMax.set(n, {
                        opacity: 1
                    });
                    TweenMax.set(n, {
                        perspective: 1e3
                    });
                    l.staggerFrom(c, .8, {
                        opacity: 0,
                        scale: 0,
                        y: 10,
                        rotationX: 90,
                        transformOrigin: "0% 50% -50",
                        ease: Back.easeOut.config(1)
                    }, .015, "+=" + r);
                    if (verge.inViewport(n) && !n.hasClass("js-animated")) {
                        $_pageHeader.find("h2").addClass("js-animated");
                        l.play()
                    }
                    break;
                case "smoothEntrance":
                    if (i.setupArgs) {
                        var t = i.setupArgs.yValue,
                            a = i.setupArgs.animationTime
                    } else {
                        t = 20;
                        a = .8
                    }
                    if (n.closest(".header-text").length > 0) var o = .8;
                    else var o = 1;
                    TweenMax.set(n, {
                        opacity: o
                    });
                    l.staggerFrom(c, .8, {
                        opacity: 0,
                        y: t,
                        ease: Back.easeOut.config(1)
                    }, .015, "+=" + r, function() {
                        if ($_body.hasClass("somos") || $_body.hasClass("estamos") || $_body.hasClass("queremos") || $_body.hasClass("home")) {
                            if (typeof e == "function") e()
                        }
                    });
                    if (verge.inViewport(n) && !n.hasClass("js-animated")) {
                        $_pageHeader.find("h2").addClass("js-animated");
                        l.play()
                    }
                    break
            }
        };
        var o = function() {
            l.play()
        };
        var f = function() {
            TweenMax.killTweensOf(l);
            l = null
        };
        return {
            init: a,
            animate: o,
            kill: f
        }
    }*/
}

Equicom = new EquicomClass();

$(document).ready(Equicom.inicializar);