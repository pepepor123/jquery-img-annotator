$(window).load(() => {

  // 丸の数と座標
  const numHandles = 8;
  const handlePositions = [
    {x: 0.50, y: 0.50},
    {x: 0.30, y: 0.60},
    {x: 0.30, y: 0.75},
    {x: 0.35, y: 0.85},
    {x: 0.50, y: 0.90},
    {x: 0.65, y: 0.85},
    {x: 0.70, y: 0.75},
    {x: 0.70, y: 0.60}
  ];

  // 画像のサイズをウィンドウサイズに応じて調整する関数
  const setDimensions = () => {
    const currentWidth = $('#canvas-container').width();
    const currentHeight = currentWidth;
    $('#canvas-container').height(currentHeight);

    $('#face-image').width(currentWidth);
    $('#face-image').height(currentHeight);

    const ratio = window.devicePixelRatio;
    $('#canvas').attr('width', currentWidth * ratio);
    $('#canvas').attr('height', currentHeight * ratio);
    $('#canvas').width(currentWidth);
    $('#canvas').height(currentHeight);
    const ctx = $('#canvas')[0].getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    for (let i = 0; i < numHandles; i++) {
      const size = 30;
      const left = currentWidth * handlePositions[i].x - size / 2;
      const top = currentHeight * handlePositions[i].y - size / 2;
      $('#draggable-point' + i).css({left: left, top: top});
    }
  }

  // 丸の座標を使って青い図形を描画する関数
  const drawAnnotation = () => {
    const canvasWidth = $('#canvas').width();
    const canvasHeight = $('#canvas').height();
    const ctx = $('#canvas')[0].getContext('2d');

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.moveTo(handlePositions[0].x * canvasWidth, handlePositions[0].y * canvasHeight);
    for (let i = 1; i < numHandles; i++) {
      ctx.lineTo(handlePositions[i].x * canvasWidth, handlePositions[i].y * canvasHeight);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'rgb(0, 0, 255)';
    ctx.stroke();

    for (let i = 0; i < numHandles; i++) {
      const cx = handlePositions[i].x * canvasWidth;
      const cy = handlePositions[i].y * canvasHeight;

      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fill();
      ctx.strokeStyle = 'rgb(0, 0, 0)';
      ctx.stroke();
    }
  }

  // ページ下部に表示される丸の座標を更新する関数
  const showHandlePositions = () => {
    for (let i = 0; i < numHandles; i++) {
      const x = handlePositions[i].x;
      const y = handlePositions[i].y;
      $('#handle-info' + i).html("handle" + i + ": (" + x.toFixed(2) + ", " + y.toFixed(2) + ")");
    }
  }

  for (let i = 0; i < numHandles; i++) {
    $('#draggable-point' + i).draggable({
      containment: 'parent',
      scroll: false
    });

    $('#draggable-point' + i).on('drag', (event, ui) => {
      const currentWidth = $('#canvas-container').width();
      const currentHeight = $('#canvas-container').height();
      const point = $('#draggable-point' + i);
      handlePositions[i].x = (point.position().left + point.width() / 2) / currentWidth;
      handlePositions[i].y = (point.position().top + point.height() / 2) / currentHeight;
      drawAnnotation();
      showHandlePositions();
    });
  }

  // ウィンドウサイズが変化したら描画しなおす
  $(window).resize(() => {
    setDimensions();
    drawAnnotation();
  });

  setDimensions();
  drawAnnotation();
  showHandlePositions();

});
