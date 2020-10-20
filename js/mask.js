if (!isMobile) {

    var app = new PIXI.Application(
        window.innerWidth,
        window.innerHeight, {
            antialias: true,
            transparent: true
        }
    );

    $('.mask-bg').append(app.view);

    app.stage.interactive = true;

    var container = new PIXI.Container();
    container.x = 0;
    container.y = 0;


    var textureRectangle = new PIXI.Rectangle(0, 0, 170, 152);
    var texture = PIXI.Texture.from('./img/pattern3.png');


    var tilingSprite = new PIXI.extras.TilingSprite(
        texture,
        window.innerWidth * 2,
        window.innerHeight * 2,
    );

    tilingSprite.scale.x = 0.5;
    tilingSprite.scale.y = 0.5;

    container.addChild(tilingSprite);
    app.stage.addChild(container);

    var brush = PIXI.Sprite.fromImage('./img/brush3.png');

    brush.anchor.set(0.5);
    app.stage.addChild(brush);
    brush.x = 100;
    brush.y = 100;

    container.mask = brush;
    container.width = app.renderer.width;
    container.height = app.renderer.height;

    //mouse move


    var mouseX = 0,
        mouseY = 0;

    jQuery(document).ready(function($) {

        // set the variables
        var xp = 0,
            yp = 0;

        $(document).mousemove(function(e) {
            mouseX = e.pageX;
            mouseY = e.pageY;
        });

        var loop = setInterval(function() {
            xp += ((mouseX - xp) / 6);
            yp += ((mouseY - yp) / 6);
            brush.x = mouseX;
            brush.y = mouseY;
        }, 30);

    });

}