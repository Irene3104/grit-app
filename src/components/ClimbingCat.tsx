/**
 * ClimbingCat v4
 * 
 * 암벽 왼쪽 면에 붙어있는 구도:
 * - 몸통이 암벽을 향해 측면
 * - 오른팔/왼팔이 오른쪽(암벽 방향)으로 뻗어 홀드를 잡음
 * - 다리도 암벽을 발로 밟음
 * - viewBox: 50x80, 오른쪽이 암벽
 */

import { motion } from 'framer-motion';

interface Props {
  state: 'climbing' | 'danger' | 'idle';
  size?: number;
}

export default function ClimbingCat({ state, size = 64 }: Props) {
  const climbing = state === 'climbing';
  const danger   = state === 'danger';
  const T = 1.0; // 사이클 주기

  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 50 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ===== 꼬리 ===== */}
      <motion.path
        d="M15 45 Q4 50 3 60 Q2 68 10 70"
        stroke="#E8904A" strokeWidth="3.5" fill="none" strokeLinecap="round"
        animate={climbing ? {
          d: ["M15 45 Q4 50 3 60 Q2 68 10 70",
              "M15 45 Q5 47 4 57 Q3 65 11 67",
              "M15 45 Q4 50 3 60 Q2 68 10 70"]
        } : {}}
        transition={{ duration: T * 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ===== 뒷다리 (아래쪽 — 암벽 발판) ===== */}
      <motion.g
        style={{ transformOrigin: '20px 52px' } as React.CSSProperties}
        animate={climbing ? { rotate: [-20, 5, -20] } : { rotate: [-10, -10] }}
        transition={{ duration: T, repeat: climbing ? Infinity : 0, ease: 'easeInOut', delay: T * 0.5 }}
      >
        <rect x="16" y="50" width="6" height="11" rx="3" fill="#C06830" />
        {/* 발 — 오른쪽(암벽) 방향 */}
        <ellipse cx="26" cy="61" rx="7" ry="3.5" fill="#CC2200" />
        <rect x="21" y="58" width="8" height="4" rx="2" fill="#EE3311" />
      </motion.g>

      {/* ===== 앞다리 (위쪽) ===== */}
      <motion.g
        style={{ transformOrigin: '20px 46px' } as React.CSSProperties}
        animate={climbing ? { rotate: [5, -20, 5] } : { rotate: [-10, -10] }}
        transition={{ duration: T, repeat: climbing ? Infinity : 0, ease: 'easeInOut' }}
      >
        <rect x="16" y="44" width="6" height="11" rx="3" fill="#D07A3A" />
        {/* 발 — 오른쪽(암벽) 방향 */}
        <ellipse cx="26" cy="55" rx="7" ry="3.5" fill="#E8B500" />
        <rect x="21" y="52" width="8" height="4" rx="2" fill="#FFD000" />
      </motion.g>

      {/* ===== 몸통 ===== */}
      <ellipse cx="18" cy="40" rx="11" ry="14" fill="#F5A05A" />
      <ellipse cx="17" cy="42" rx="6" ry="9" fill="#FFD49A" opacity="0.5" />
      {/* 하네스 */}
      <path d="M8 36 Q18 40 28 36" stroke="#1B5E20" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <line x1="13" y1="37" x2="12" y2="48" stroke="#2E7D32" strokeWidth="1.5" />
      <line x1="23" y1="37" x2="24" y2="48" stroke="#2E7D32" strokeWidth="1.5" />
      <rect x="15" y="43" width="7" height="5" rx="1.5" fill="#1B5E20" />
      {/* 초크백 */}
      <ellipse cx="8" cy="42" rx="4" ry="5.5" fill="#5B8DD9" />
      <ellipse cx="8" cy="41" rx="3" ry="4.5" fill="#7BA7F7" />

      {/* ===== 머리 ===== */}
      {/* 헬멧 */}
      <ellipse cx="18" cy="18" rx="12" ry="10" fill="#CC2200" />
      <ellipse cx="18" cy="20" rx="12" ry="7.5" fill="#EE3300" />
      <rect x="12" y="12" width="1.8" height="5.5" rx="0.9" fill="#AA1100" />
      <rect x="16.5" y="11" width="1.8" height="5.5" rx="0.9" fill="#AA1100" />
      <rect x="21" y="12" width="1.8" height="5.5" rx="0.9" fill="#AA1100" />
      {/* 얼굴 */}
      <ellipse cx="18" cy="25" rx="10" ry="9" fill="#F5A05A" />
      {/* 귀 */}
      <polygon points="9,19 6,12 12,18" fill="#F5A05A" />
      <polygon points="27,19 30,12 24,18" fill="#F5A05A" />
      <polygon points="9,19 7,13 11,18" fill="#FFB6C1" />
      <polygon points="27,19 29,13 25,18" fill="#FFB6C1" />
      {/* 눈 — 오른쪽(암벽) 방향 */}
      <ellipse cx="15" cy="23" rx="2.8" ry="3.2" fill="white" />
      <ellipse cx="22" cy="22" rx="2.3" ry="2.8" fill="white" />
      <ellipse cx="15.8" cy="23.5" rx="1.6" ry="2" fill="#111" />
      <ellipse cx="22.7" cy="22.5" rx="1.4" ry="1.8" fill="#111" />
      <circle cx="16.3" cy="22.8" r="0.65" fill="white" />
      <circle cx="23.1" cy="21.9" r="0.6"  fill="white" />
      {/* 코 */}
      <ellipse cx="19" cy="27.5" rx="1.8" ry="1.2" fill="#E8707A" />
      {/* 헬멧 턱끈 */}
      <path d="M8 20 Q6 25 9 28" stroke="#AA1100" strokeWidth="1" fill="none" />
      <path d="M28 20 Q30 25 27 28" stroke="#AA1100" strokeWidth="1" fill="none" />

      {/* ===== 위쪽 팔 (오른손 — 위 홀드 잡기) ===== */}
      <motion.g
        style={{ transformOrigin: '25px 32px' } as React.CSSProperties}
        animate={climbing ? {
          rotate: [-70, -30, -70],
          y:      [-3,   2,  -3],
        } : danger ? { rotate: [-80, -80] }
          : { rotate: [-50, -50] }}
        transition={{ duration: T, repeat: climbing || danger ? Infinity : 0, ease: 'easeInOut' }}
      >
        {/* 윗팔 */}
        <rect x="23" y="28" width="6" height="10" rx="3" fill="#D07A3A" />
        {/* 아랫팔 */}
        <rect x="24" y="36" width="5" height="10" rx="2.5" fill="#C06830" />
        {/* 글러브 */}
        <ellipse cx="27" cy="47" rx="4.5" ry="3.5" fill="#1B5E20" />
        <circle cx="24.5" cy="45.5" r="1.5" fill="#145214" />
        <circle cx="27"   cy="44.8" r="1.5" fill="#145214" />
        <circle cx="29.5" cy="45.5" r="1.5" fill="#145214" />
      </motion.g>

      {/* ===== 아래쪽 팔 (왼손 — 아래 홀드 잡기) ===== */}
      <motion.g
        style={{ transformOrigin: '25px 38px' } as React.CSSProperties}
        animate={climbing ? {
          rotate: [-30, -70, -30],
          y:      [2,   -3,   2],
        } : danger ? { rotate: [20, 35, 20], x: [-3, 0, -3] }
          : { rotate: [-30, -30] }}
        transition={{ duration: T, repeat: climbing || danger ? Infinity : 0, ease: 'easeInOut', delay: T / 2 }}
      >
        <rect x="23" y="34" width="6" height="10" rx="3" fill="#E8904A" />
        <rect x="24" y="42" width="5" height="10" rx="2.5" fill="#D07A3A" />
        <ellipse cx="27" cy="53" rx="4.5" ry="3.5" fill="#1B5E20" />
        <circle cx="24.5" cy="51.5" r="1.5" fill="#145214" />
        <circle cx="27"   cy="50.8" r="1.5" fill="#145214" />
        <circle cx="29.5" cy="51.5" r="1.5" fill="#145214" />
      </motion.g>

      {/* ===== 위험 땀방울 ===== */}
      {danger && (
        <>
          <motion.circle cx="6" cy="20" r="2.5" fill="#74BCFF"
            animate={{ cy: [20, 28, 36], opacity: [0.9, 0.5, 0] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
          <motion.circle cx="3" cy="26" r="2" fill="#74BCFF"
            animate={{ cy: [26, 33, 40], opacity: [0.8, 0.4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}
    </svg>
  );
}
