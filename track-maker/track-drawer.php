<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="../assets/icon.jpg">
    <link rel="stylesheet" href="../css/track_drawer.css">
    <script src="https://code.jquery.com/jquery-3.6.3.js"
        integrity="sha256-nQLuAZGRRcILA+6dMBOvcRh5Pe310sBpanc6+QBmyVM=" crossorigin="anonymous"></script>
    <title>try</title>
</head>

<body>

    <nav class="nav">
        <a href="track-drawer.html" class="active">Drawer</a>
        <a href="track-selector.php">Selector</a>
        <div class="nav-notch"></div>
    </nav>

    <canvas id="canvas"></canvas>

    <img src="../assets/red-flag.png" id="flag" alt="" srcset="">

    <section draggable="true" class="control-panel" style="display: block;">
        <h3>Customise Track</h3>

        <form>
            <h3 class="sub-heading">Width</h3>

            <div>
                <label for="track-strip-width">Track-strip</label>
                <input type="number" id="track-strip-width" name="track-strip-width">
            </div>
            <div>
                <label for="road-width">track</label>
                <input type="number" id="road-width" name="road-width">
            </div>
            <div>
                <label for="road-width">boundry-1</label>
                <input type="number" id="primary-boundry-width" name="primary-boundry-width">
            </div>
            <div>
                <label for="secondry-boundry-width">boundry-2</label>
                <input type="number" id="secondary-boundry-width" name="secondary-boundry-width">
            </div>


            <h3 class="sub-heading color-section">Colours</h3>

            <div>
                <label for="track-strip-color">track strip</label>
                <input type="color" id="track-strip-color" class="color-input" name="track-strip-color">
            </div>
            <div>
                <label for="track-color">track</label>
                <input type="color" id="track-color" class="color-input" name="track-color">
            </div>
            <div>
                <label for="primary-boundry-color">boundry 1</label>
                <input type="color" id="primary-boundry-color" class="color-input" name="primary-boundry-color">
            </div>
            <div>
                <label for="secondary-boundry-color">boundry 2</label>
                <input type="color" id="secondary-boundry-color" class="color-input" name="secondary-boundry-color">
            </div>
            <div>
                <label for="terrain-color">terrain</label>
                <input type="color" id="terrain-color" class="color-input" name="terrain-color">
            </div>

            <div class="action">
                <button id="reset-track">reset</button>
                <!-- <input type="submit" download='canvas-image.png' value="Save track" id="submit-track-data"> -->
                <a id="submit-track-data" download="canvas.png" style="display:block;">save image</a>
            </div>
        </form>
    </section>

    <section class="alert" id="alert">
        <img src="" id="track-image" alt="">
        <div class="cross"></div>
        <p class="text-alert">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A, voluptas.
        </p>
    </section>

    <section class="php-ro-console" id="php-ro-console">
        <p>>> php read-only console</p>
    </section>


</body>


<script>

    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d');
    var height = canvas.height = window.innerHeight;
    var width = canvas.width = window.innerWidth;
    var balls = [];
    var startedDrawing = false;
    var currentIndex = 0;
    var frameIndex = 1;
    var time = 0;
    var redFlag = new Image();
    redFlag.src = '../assets/red-flag.png';
    var flagPos = [0, 0];
    var frameIndex2 = 0;    // for drawing the flag
    var mouseX, mouseY;
    var initaialVector = [0, 0];

    var sboundryColor = '#99C848';
    var pboundryColor = '#ECE1A2';
    var trackColor = '#333333';
    var trackStripColor = '#333333';
    var terrainColor = '#5AA523';

    var trackWidth = 80;
    var trackStripWidth = 5;
    var pboundryWidth = trackWidth + 20;
    var sboundryWidth = trackWidth + 30;
    var smoothness = 1;

    var biasLoop = 0;
    var flagDrawn = 0;


    window.onresize = () => {
        height = canvas.height = window.innerHeight;
        width = canvas.width = window.innerWidth;
        biasLoop = 1;
    }


    // mainloop
    function run() {

        if ((mousedown && mousemove) || biasLoop) {
            ctx.fillStyle = terrainColor;
            ctx.fillRect(0, 0, width, height);


            drawPath(sboundryColor, sboundryWidth);
            drawPath(pboundryColor, pboundryWidth);
            drawPath(trackColor, trackWidth);
            drawPath(trackStripColor, trackStripWidth);
            biasLoop = 0;

            if (frameIndex2 > 0) {
                if (frameIndex2 == 1) {
                    flagPos = [mouseX, mouseY];
                }
                if (frameIndex2 == 4) {
                    initialVector = [mouseX, mouseY];
                }
                // condition to draw start vector;
                // if (frameIndex2 > 4) {
                //     ctx.beginPath();
                //     ctx.lineWidth = 3;
                //     ctx.strokeStyle = 'red';
                //     ctx.moveTo(flagPos[0], flagPos[1]);
                //     ctx.lineTo(initialVector[0], initialVector[1]);
                //     ctx.stroke();
                // }

                // ctx.beginPath();
                // ctx.drawImage(redFlag, flagPos[0], flagPos[1], 80, 80);
                // ctx.drawImage(redFlag, flagPos[0] - 40, flagPos[1] - 70, 80, 80);
                (!flagDrawn) ? drawFlag(flagPos[0], flagPos[1]) : 0;
                console.log(flagDrawn);
            }

            frameIndex2++;
        }
        else {
            canvas.style.backgroundColor = '#5AA523';
        }
        // console.log(mousedown && mousemove);
        requestAnimationFrame(run);
    }

    var mousedown = false;
    var mousemove = false;
    var c = smoothness;

    $('#canvas').on('mousedown mouseup mousemove', (e) => {
        if (e.type === 'mousemove') {
            if (mousedown && (c <= 0)) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                ball = new Ball(e.clientX, e.clientY);
                balls.push(ball);
                c = smoothness;
                $('.control-panel').css('pointer-events', 'none'); // while drawing all control panel events are off;
                $('.control-panel').css('opacity', '0.1');
            }
            else {
                $('.control-panel').css('pointer-events', 'all'); // and in other time than that it gets back to normal again;
                $('.control-panel').css('opacity', '1');
            }
            mousemove = true;
            c--;
        }
        else {
            mousemove = false;
        }
        if (e.type === 'mouseup') {
            mousedown = false;
        }
        if (e.type === 'mousedown') {
            mousedown = true;
        }
    });


    function drawPath(color, size) {
        if ((balls.length > 1)) {
            if (currentIndex < balls.length - 1)
                if (frameIndex <= time) {
                    ctx.beginPath();
                    balls[currentIndex].draw(color, size / 2);
                    drawLine(balls[currentIndex], balls[currentIndex + 1], color, size);
                    frameIndex++;
                }
                else if (frameIndex > time) {
                    currentIndex++;
                    frameIndex = 1;
                }

            for (let i = 0; i <= currentIndex - 1; i++) {
                ctx.beginPath();
                balls[i].draw(color, size / 2);
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = size;
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[i + 1].x, balls[i + 1].y);
                ctx.stroke();
            }
        }
    }

    function drawLine(p1, p2, color, size) {
        dy = p1.y - p2.y;
        dx = p1.x - p2.x;

        dist = Math.sqrt(dx ** 2 + dy ** 2);
        sin = dy / dist; cos = dx / dist;

        currentDist = dist * (frameIndex / time);
        y1 = currentDist * sin;
        x1 = currentDist * cos;

        ctx.beginPath();
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p1.x - x1, p1.y - y1);
        ctx.stroke();
    }

    function Ball(x, y) {
        this.x = x;
        this.y = y;
        this.color = '#333';
        this.size = 10;
        this.lined = false;
        this.lineLife = 0;


        this.draw = (color, size) => {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawFlag(x, y) {
        $('#flag').css({
            'top': y,
            'left': x,
            'transform': 'translate(-50%, -50%)',
            'display': 'block',
        });
        flagDrawn = 1;
    }
    function unDrawFlag() {
        flagDrawn = 0;
        $('#flag').css({
            'display': 'none',
        });
    }

    var tw = $('#road-width');
    var tsw = $('#track-strip-width');
    var pbw = $('#primary-boundry-width');
    var sbw = $('#secondary-boundry-width');

    var tc = $('#track-color');
    var tsc = $('#track-strip-color');
    var pbc = $('#primary-boundry-color');
    var sbc = $('#secondary-boundry-color');
    var tec = $('#terrain-color');

    var resetBtn = $('#reset-track');
    var submitBtn = $('#submit-track-data');

    //// setting default values

    function defaulSettings() {
        tsw.val(trackStripWidth);
        tw.val(trackWidth);
        pbw.val(pboundryWidth);
        sbw.val(sboundryWidth);

        tsc.val(trackStripColor);
        tc.val(trackColor);
        pbc.val(pboundryColor);
        sbc.val(sboundryColor);
        tec.val(terrainColor);
    }

    $('form').on('keydown', (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    })
    $('#road-width, #primary-boundry-width, #secondary-boundry-width, #track-strip-width').on('change keydown', (e) => {
        if (e.keyCode !== 13) 0;
        else {
            trackWidth = tw.val();
            pboundryWidth = pbw.val();
            sboundryWidth = sbw.val();
            trackStripWidth = tsw.val();
            biasLoop = 1;

        }
    });

    $(' #track-color, #primary-boundry-color, #secondary-boundry-color, #terrain-color, #track-strip-color').on('change', () => {
        trackColor = tc.val();
        pboundryColor = pbc.val();
        sboundryColor = sbc.val();
        terrainColor = tec.val();
        trackStripColor = tsc.val();
        biasLoop = 1;
        console.log(trackColor, pboundryColor, sboundryColor, terrainColor);
    });

    $('#reset-track').click((event) => {
        event.preventDefault();
        $(this).css('background', 'black');
        $('#alert').css('display', 'none');
        $('#php-ro-console').css('display', 'none');
        balls = [];
        startedDrawing = false;
        currentIndex = 0;
        frameIndex = 1;
        frameIndex2 = 0;
        time = 1;
        biasLoop = 1;
        flagPos = initialVector = [];
        unDrawFlag();
    });

    $('#submit-track-data').click((event) => {
        event.preventDefault();
        url = canvas.toDataURL('image/png');
        // navigator.clipboard.writeText(url);
        // console.log(url);
        // $('#submit-track-data').attr('href', url);
        // $('#submit-track-data').text('copy to clipboard');
        // $('#submit-track-data').attr('download', 'canvas.png');
        // console.log($('#submit-track-data').attr('href'));


        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../php/imageUpload.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                response = xhr.responseText;
                // console.log(xhr.responseText);

                $('#track-image').attr('src', url);
                $('#track-image').width(500);
                $('#track-image').height(500 * (window.innerHight) / (window.innerWidth));
                $('#alert').css('display', 'none');
                $('#php-ro-console').css('display', 'block');
                $('#php-ro-console').css('opacity', '0.8');

                setTimeout(() => {
                    $('#php-ro-console').css('opacity', '0.1')
                }, 3000);

                let oldtext = $('#php-ro-console').html();
                oldtext += '<p>' + response + '</p>';
                $('#php-ro-console').html(oldtext);
                // console.log(url.length, xhr.responseText.length);
                $('.nav-notch, .nav').mouseover();
                setTimeout(() => {
                    $('.nav-notch, .nav').mouseleave();
                }, 3000);
            }
        };
        let track = {
            startPos: `${flagPos[0]}, ${flagPos[1]}`,
            initialVector: `${initialVector[0]},${initialVector[1]}`,
            imageData: url,
            boundryColor: pboundryColor,
        }
        xhr.send(JSON.stringify(track));

    });

    $('.nav-notch, .nav').on('mouseenter mouseover', () => {
        $('.nav').css('transform', 'translateY(0px)');
    });
    $('.nav-notch, .nav').on('mouseleave', () => {
        $('.nav').css('transform', 'translateY(-50px)');
    });



    $(document).ready(() => {
        defaulSettings();
        run();

    });

</script>

</html>