import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
    SHOT_COLOR,
    PELLET_SIZE as _PELLET_SIZE,
    TARGET_SIZE_10M_PISTOL as _TARGET_SIZE_10M_PISTOL,
    RINGS_10M_PISTOL as _RINGS_10M_PISTOL,
    SHOT_COLOR_10,
    SHOT_COLOR_9,
    SHOT_COLOR_8_BELOW
} from './constants';
import { calculateDecimalScore } from './utils';
import { Button, Checkbox } from 'antd';

// const SCALE = 1;
const SCALE = 4.5;
const PELLET_SIZE = _PELLET_SIZE * SCALE;
const TARGET_SIZE_10M_PISTOL = _TARGET_SIZE_10M_PISTOL * SCALE;
const RINGS_10M_PISTOL = _RINGS_10M_PISTOL.map(ring => ring * SCALE);

const SERIES_1 = [
    // [0.0, 0.0],
    // [0.67, 0.01],
    // [-4.85, -4.62],
	[11.03, -5.72],
	[-8.64, 1.33],
	[-24.14, -13.92],
	[5.9, -9.78],
	[3.27, 0.86],
	[-4.74, -3.31],
	[-12.7, -6.12],
	[2.68, 11.87],
	[-7.01, -8.3],
	[2.4, -2.75],
];

const SERIES_2 = [
	[-2.84, 1.79],
	[0.32, -4.2],
	[-2.4, 3.22],
	[-25.26, 4.61],
	[-27.52, 5.39],
	[-1.28, -8.16],
	[2.1, -16.84],
	[2.25, 8.92],
	[-7.91, 23.4],
	[12.76, 6.73],
];

const SERIES_3 = [
	[-42.39, -6.97],
	[-1.36, -2.15],
	[3.79, -6.28],
	[-11.7, -9.54],
	[-5.67, -11.73],
	[-2.55, 10.75],
	[-13.34, 1.1],
	[-3.29, -3.63],
	[16.35, -11.76],
	[14.64, 10.62],
];

const SERIES_4 = [
	[-23.17, 2.17],
	[7.7, 7.93],
	[-12.05, 20.68],
	[13.26, -1.18],
	[-14.25, 14.39],
	[-3.41, -20.29],
	[-11.72, -12.83],
	[-10.83, 3.39],
	[-0.85, 4.87],
	[-2.97, -1.89],
];

const SERIES = [
    SERIES_1,
    SERIES_2,
    SERIES_3,
    SERIES_4,
];


const Target = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [activeSeries, setActiveSeries] = useState<number[]>(SERIES.map((_, idx) => idx));
    const [shotByShot, setShotByShot] = useState(false);
    const [shotCounter, setShotCounter] = useState(0);
    const [score, setScore] = useState({
        whole: 0,
        precise: '0.0',
    });

    const drawCircle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, fill: string, stroke: string) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = fill; // Darker blue for border
        ctx.fill();
        ctx.strokeStyle = stroke; // Darker blue for border
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    const drawPlus = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size = 20, fill: string, stroke: string) => {
        // Set plus properties
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 3;
        
        // Draw vertical line
        ctx.moveTo(centerX, centerY - size);
        ctx.lineTo(centerX, centerY + size);
        
        // Draw horizontal line
        ctx.moveTo(centerX - size, centerY);
        ctx.lineTo(centerX + size, centerY);
        
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      };

    const prevShot = () => {
        let count = Math.max(shotCounter - 1, 0);
       
        for (let j = SERIES.length; j >= 0; j--) {
            if (!activeSeries.includes(j)) {
                if (count >= j * 10 + 1 && count <= j * 10 + 10) {
                    count = j * 10;
                }
            }
        }

        setShotCounter(Math.max(count, 0));
    };
  
    const nextShot = () => {
        let count = Math.min(shotCounter + 1, SERIES.length * 10);
       
        for (let j = 0; j < SERIES.length; j++) {
            if (!activeSeries.includes(j)) {
                if (count >= j * 10 + 1 && count <= j * 10 + 10) {
                    count = j * 10 + 11;
                }
            }
        }

        let maxCount = 0;
        activeSeries.forEach(s => {
            maxCount = Math.max(maxCount, s * 10 + 10);
        });
        setShotCounter(Math.min(maxCount, count));
    };

    const handleKeypress = (e: any) => {
        console.log(e);
        if (!shotByShot) return;

        if (e.code === 'ArrowLeft') {
            nextShot();
        }

        if (e.code === 'ArrowRight') {
            prevShot();
        }

    }

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
    
    RINGS_10M_PISTOL.forEach((ring, idx) => {
        // Draw circle
        const radius = ring / 2;
        drawCircle(ctx, centerX, centerY, radius, idx >= 6 ? '#000' : 'transparent', idx >= 6 ? '#fff' : '#000');
        
        ctx.closePath();
    });

    let total = 0;
    let totalDecimal = 0;
    SERIES.forEach((series, idx) => {
        if (!activeSeries.includes(idx)) return;
        series.forEach((shot, i) => {
            const currentShotNo = (idx * 10 + i + 1)
            if (shotByShot && shotCounter < currentShotNo) return;

            const decimalScore = (calculateDecimalScore(shot[0], shot[1]) + '');
            const intScore = parseInt(decimalScore);

            console.log(decimalScore);
            total += intScore;
            totalDecimal = parseFloat(decimalScore);

            const deviationX = shot[0] * SCALE;
            const deviationY = shot[1] * SCALE;

            let shotColor = SHOT_COLOR;

            if (shotCounter !== currentShotNo) {
                // Do nothing;
            } else if (intScore === 10) {
                shotColor = SHOT_COLOR_10;
            } else if (intScore === 9) {
                shotColor = SHOT_COLOR_9;
            } else {
                shotColor = SHOT_COLOR_8_BELOW;
            }
        
            drawCircle(ctx, centerX + deviationX, centerY - deviationY, PELLET_SIZE / 2, shotColor, '#000');
            // drawPlus(ctx, centerX + deviationX, centerY - deviationY, PELLET_SIZE / 2, '#000', SHOT_COLOR);
        })
    });
    setScore({
        whole: total,
        precise: totalDecimal.toFixed(1)
    })
  }, [activeSeries, shotCounter, shotByShot]);

  return (
    <Wrapper>
      <Canvas
        ref={canvasRef}
        width={TARGET_SIZE_10M_PISTOL}
        height={TARGET_SIZE_10M_PISTOL}
      />

      <div className={'series'}>
        {SERIES.map((_, idx: number) => {
            return <div>
                <Checkbox checked={activeSeries.includes(idx)} onChange={e => setActiveSeries(s => {
                    if (e.target?.checked) {
                        return s.concat(idx);
                    } else {
                        return s.filter(val => idx !== val);
                    }
                })}>Series {(idx + 1)}</Checkbox>
            </div>
        })}

        <br/>
        <div>
            <Checkbox checked={shotByShot} onChange={e => {
                setShotByShot(e.target?.checked);
                setShotCounter(0);
            }}>Shot By Shot</Checkbox>
            <br/>
            {shotByShot && <div className={'shot-counter-wrapper'}>
                <Button type="primary" size="small" onClick={prevShot}>
                    {'<<'}
                </Button>
                <span className='shot-counter'>
                    {shotCounter || '-'}
                </span>
                <Button type="primary" size="small" onClick={nextShot}>
                    {'>>'}
                </Button>
            </div>}
        </div>
        <br/>
        <div className={'score'}>
            {score.whole}
        </div>
        <div className={'score'}>
            {score.precise}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    background: #242424;

    .series {
        margin-left: 100px;

        &, span {
            color: #fff;
            font-size: 18px;
        }
        
        .shot-counter-wrapper {
            margin-top: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: center;

            .shot-counter {
                width: 2.875rem;
                padding: 0.25rem 0.5rem;
                margin: 0 0.5rem;
                border: 1px solid #fff;
                border-radius: 0.5rem;
            }
        }

        
        button {
            span {
                font-size: 14px;
                font-weight: bold;
            }
        }
    }
    .score {
        font-size: 48px;
        font-weight: bold;
    }
`;

const Canvas = styled.canvas`
    border-radius: 60px;
    background: #fff;
    box-shadow: 0px 0px 5px 0px rgba(255, 255, 255, 0.32);
`;

export default Target;