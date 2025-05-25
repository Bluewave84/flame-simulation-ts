import SimplexNoise from 'simplex-noise';

const canvas = document.getElementById('flame') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const simplex = new SimplexNoise();

const flameCenter = { x: canvas.width / 2, y: canvas.height - 60 };
const flameHeight = 110;
const flameWidth = 40;

function drawFlame(time: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(flameCenter.x, flameCenter.y);

  const edgePoints: { x: number; y: number }[] = [];
  ctx.beginPath();
  for (let i = 0; i <= Math.PI; i += 0.04) {
    const noise = simplex.noise3D(
      Math.cos(i) * 0.6,
      Math.sin(i) * 0.6,
      time * 0.0009
    );
    const r = flameWidth / 2 + noise * 7;
    const x = Math.cos(i) * r;
    const y = -Math.sin(i) * (flameHeight + noise * 17);
    edgePoints.push({ x, y });
    ctx.lineTo(x, y);
  }
  ctx.lineTo(0, 0);
  ctx.closePath();

  ctx.globalAlpha = 0.95;
  ctx.fillStyle = "#fff";
  ctx.fill();

  ctx.globalAlpha = 0.35;
  for (let j = 0; j < 7; j++) {
    ctx.beginPath();
    for (let i = 0; i < edgePoints.length; i++) {
      let { x, y } = edgePoints[i];
      x *= 1 + j * 0.03;
      y *= 1 + j * 0.04;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    const grey = 220 - j * 27;
    ctx.strokeStyle = `rgb(${grey},${grey},${grey})`;
    ctx.lineWidth = 2 + j;
    ctx.stroke();
  }
  ctx.restore();
  ctx.globalAlpha = 1.0;
}

function animate(time: number) {
  drawFlame(time);
  requestAnimationFrame(animate);
}

animate(0);
