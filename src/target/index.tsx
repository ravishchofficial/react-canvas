import { useEffect, useRef } from 'react';

const Target = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;

    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set circle properties
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 50;

    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#4299e1'; // Blue color
    ctx.fill();
    ctx.strokeStyle = '#2b6cb0'; // Darker blue for border
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
      />
    </div>
  );
};

export default Target;