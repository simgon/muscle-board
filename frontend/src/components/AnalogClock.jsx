import React, { useState } from 'react';
import { css, keyframes } from '@emotion/css';
import { useInterval } from './useInterval';

export default function AnalogClock(props) {
  const { width, height } = props;

  const [secAngle, setSecAngle] = useState('');
  const [minAngle, setMinAngel] = useState('');
  const [hourAngle, setHourAngle] = useState('');

  // 定期処理
  const handleClockUpdate = () => {
    let now = new Date();

    let mil = now.getMilliseconds() / 1000;
    let sec = now.getSeconds();
    let min = now.getMinutes() + sec / 60;
    let hour = (now.getHours() % 12) + min / 60;
    let secangle = sec * 6 + mil * 6;
    let minangle = min * 6;
    let hourangle = hour * 30;

    setSecAngle(secangle);
    setMinAngel(minangle);
    setHourAngle(hourangle);
  };
  useInterval({ onUpdate: handleClockUpdate, delay: 10 });

  return (
    <svg className={styles.clock} viewBox="0 0 100 100" width={width} height={height}>
      <circle className={styles.face} cx="50" cy="50" r="45" />

      <g className={styles.ticks}>
        <line x1="50" y1="5.000" x2="50.00" y2="10.00" />
        <line x1="72.50" y1="11.03" x2="70.00" y2="15.36" />
        <line x1="88.97" y1="27.50" x2="84.64" y2="30.00" />
        <line x1="95.00" y1="50.00" x2="90.00" y2="50.00" />
        <line x1="88.97" y1="72.50" x2="84.64" y2="70.00" />
        <line x1="72.50" y1="88.79" x2="70.00" y2="84.67" />
        <line x1="50.00" y1="95.00" x2="50.00" y2="90.00" />
        <line x1="27.50" y1="88.79" x2="30.00" y2="84.67" />
        <line x1="11.03" y1="72.50" x2="15.36" y2="70.00" />
        <line x1="5.000" y1="50.00" x2="10.00" y2="50.00" />
        <line x1="11.03" y1="27.50" x2="15.36" y2="30.00" />
        <line x1="27.50" y1="11.03" x2="30.00" y2="15.36" />
      </g>
      <g className={styles.numbers}>
        <text x="50" y="18">
          12
        </text>
        <text x="85" y="53">
          3
        </text>
        <text x="50" y="88">
          6
        </text>
        <text x="15" y="53">
          9
        </text>
      </g>
      <g className={styles.hands}>
        <line
          className={`hourhand ${styles.handAngle(hourAngle)}`}
          x1="50"
          y1="50"
          x2="50"
          y2="25"
        />
        <line
          className={`minutehand ${styles.handAngle(minAngle)}`}
          x1="50"
          y1="50"
          x2="50"
          y2="10"
        />
        <line
          className={`${styles.secondhand} ${styles.handAngle(secAngle)}`}
          x1="50"
          y1="53"
          x2="50"
          y2="10"
        />
      </g>
      <circle className={styles.handspin} cx="50" cy="50" r="1.5" />
    </svg>
  );
}

const styles = {
  handAngle: (rotateDeg) => css`
    transform: rotate(${rotateDeg}deg);
    transform-origin: 50px 50px;
  `,
  clock: css`
    stroke: black;
    stroke-linecap: round;
    fill: rgb(245, 245, 245);
  `,
  face: css`
    stroke-width: 3;
  `,
  ticks: css`
    stroke-width: 2;
  `,
  hands: css`
    stroke-width: 3;
  `,
  secondhand: css`
    stroke-width: 1;
    stroke: red;
  `,
  numbers: css`
    font-family: sans-serif;
    font-size: 10px;
    font-weight: bold;
    text-anchor: middle;
    stroke: none;
    fill: black;
  `,
  handspin: css`
    stroke-width: 1;
    stroke: rgb(70, 70, 70);
  `,
};
