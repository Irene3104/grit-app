/**
 * ClimbingCat v3 — 측면 뷰, 실제 등반 자세
 * 
 * 레이아웃 (viewBox 60x90):
 * - 오른쪽이 벽
 * - 몸통 중앙
 * - 오른팔: 위쪽 홀드 잡기
 * - 왼팔: 아래쪽 홀드 잡기 (번갈아)
 * - 다리: 좌우 분리, 벽 밟기
 */

import { motion } from 'framer-motion';

interface Props {
  state: 'climbing' | 'danger' | 'idle';
  size?: number;
}

export default function ClimbingCat({ state, size = 72 }: Props) {
  const climbing = state === 'climbing';
  const danger   = state === 'danger';

  // 등반 사이클 (0.9s 주기):
  // 오른팔 위→아래, 왼팔 아래→위 교차
  const rArmY = climbing ? [-18, 0, -18] : danger ? [-20, -20] : [-10, -10];
  const lArmY = climbing ? [0, -18, 0]   : danger ? [0, 8, 0]  : [-10, -10];
  // 다리
  const rLegAngle = climbing ? [-15, 10, -15] : [0, 0];
  const lLegAngle = climbing ? [10, -15, 10]  : [0, 0];

  const T = 0.9;

  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 60 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ====== 꼬리 (몸통 뒤) ====== */}
      <motion.path
        d="M30 56 Q18 58 15 68 Q13 76 20 78"
        stroke="#E8904A" strokeWidth="4" fill="none" strokeLinecap="round"
        animate={climbing ? {
          d: [
            "M30 56 Q18 58 15 68 Q13 76 20 78",
            "M30 56 Q20 54 17 64 Q15 72 22 74",
            "M30 56 Q18 58 15 68 Q13 76 20 78",
          ]
        } : {}}
        transition={{ duration: T * 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ====== 뒷다리 (오른쪽/벽쪽) — 먼저 그려서 앞다리 뒤로 ====== */}
      <motion.g
        style={{ transformOrigin: '36px 62px' } as React.CSSProperties}
        animate={{ rotate: rLegAngle }}
        transition={{ duration: T, repeat: climbing ? Infinity : 0, ease: 'easeInOut' }}
      >
        {/* 허벅지 */}
        <rect x="33" y="58" width="7" height="13" rx="3.5" fill="#D07A3A" />
        {/* 정강이 */}
        <rect x="34" y="69" width="6" height="11" rx="3" fill="#C06830" />
        {/* 클라이밍화 — 빨간색 */}
        <ellipse cx="40" cy="80" rx="6" ry="3.5" fill="#CC2200" />
        <rect x="35" y="77" width="8" height="4" rx="2" fill="#DD3311" />
      </motion.g>

      {/* ====== 앞다리 (왼쪽/바깥쪽) ====== */}
      <motion.g
        style={{ transformOrigin: '26px 62px' } as React.CSSProperties}
        animate={{ rotate: lLegAngle }}
        transition={{ duration: T, repeat: climbing ? Infinity : 0, ease: 'easeInOut', delay: T / 2 }}
      >
        {/* 허벅지 */}
        <rect x="22" y="58" width="7" height="13" rx="3.5" fill="#E8904A" />
        {/* 정강이 */}
        <rect x="23" y="69" width="6" height="11" rx="3" fill="#D07A3A" />
        {/* 클라이밍화 — 노란색 */}
        <ellipse cx="20" cy="80" rx="6" ry="3.5" fill="#E8B500" />
        <rect x="15" y="77" width="8" height="4" rx="2" fill="#FFD000" />
      </motion.g>

      {/* ====== 몸통 ====== */}
      <ellipse cx="30" cy="52" rx="14" ry="15" fill="#F5A05A" />
      {/* 배 밝은 부분 */}
      <ellipse cx="29" cy="54" rx="8" ry="10" fill="#FFD49A" opacity="0.5" />

      {/* 하네스 */}
      <path d="M18 48 Q30 52 42 48" stroke="#1B5E20" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <line x1="24" y1="49" x2="22" y2="62" stroke="#2E7D32" strokeWidth="2" />
      <line x1="36" y1="49" x2="38" y2="62" stroke="#2E7D32" strokeWidth="2" />
      <rect x="26" y="57" width="8" height="6" rx="1.5" fill="#1B5E20" />
      {/* 초크백 */}
      <ellipse cx="20" cy="53" rx="5" ry="7" fill="#5B8DD9" />
      <ellipse cx="20" cy="52" rx="4" ry="5.5" fill="#7BA7F7" />

      {/* ====== 머리 ====== */}
      {/* 헬멧 */}
      <ellipse cx="30" cy="28" rx="13" ry="11" fill="#CC2200" />
      <ellipse cx="30" cy="30" rx="13" ry="8"  fill="#EE3300" />
      {/* 헬멧 벤트 */}
      <rect x="24" y="22" width="2" height="6" rx="1" fill="#AA1100" />
      <rect x="29" y="21" width="2" height="6" rx="1" fill="#AA1100" />
      <rect x="34" y="22" width="2" height="6" rx="1" fill="#AA1100" />
      {/* 얼굴 */}
      <ellipse cx="30" cy="35" rx="11" ry="9" fill="#F5A05A" />
      {/* 귀 */}
      <polygon points="20,28 17,21 23,27" fill="#F5A05A" />
      <polygon points="40,28 43,21 37,27" fill="#F5A05A" />
      <polygon points="20,28 18,22 22,27" fill="#FFB6C1" />
      <polygon points="40,28 42,22 38,27" fill="#FFB6C1" />
      {/* 눈 (오른쪽을 봄 — 벽 방향) */}
      <ellipse cx="27" cy="33" rx="3"   ry="3.5" fill="white" />
      <ellipse cx="35" cy="32" rx="2.5" ry="3"   fill="white" />
      <ellipse cx="28" cy="33.5" rx="1.8" ry="2.2" fill="#111" />
      <ellipse cx="36" cy="32.5" rx="1.5" ry="1.9" fill="#111" />
      <circle  cx="28.7" cy="32.8" r="0.7" fill="white" />
      <circle  cx="36.5" cy="31.8" r="0.6" fill="white" />
      {/* 코 */}
      <ellipse cx="31" cy="38" rx="2" ry="1.3" fill="#E8707A" />
      {/* 수염 */}
      <line x1="20" y1="37" x2="28" y2="38" stroke="#bbb" strokeWidth="0.8" />
      <line x1="20" y1="39" x2="28" y2="39.5" stroke="#bbb" strokeWidth="0.8" />
      <line x1="42" y1="37" x2="34" y2="38" stroke="#bbb" strokeWidth="0.8" />
      <line x1="42" y1="39" x2="34" y2="39.5" stroke="#bbb" strokeWidth="0.8" />
      {/* 헬멧 턱끈 */}
      <path d="M19 30 Q17 36 20 40" stroke="#AA1100" strokeWidth="1.2" fill="none" />
      <path d="M41 30 Q43 36 40 40" stroke="#AA1100" strokeWidth="1.2" fill="none" />

      {/* ====== 뒷팔 (오른쪽, 벽쪽) ====== */}
      <motion.g
        style={{ transformOrigin: '38px 46px' } as React.CSSProperties}
        animate={{
          y: rArmY,
          rotate: climbing ? [-50, -20, -50] : danger ? [-60, -60] : [-35, -35],
        }}
        transition={{ duration: T, repeat: climbing || danger ? Infinity : 0, ease: 'easeInOut' }}
      >
        <rect x="36" y="40" width="6" height="12" rx="3" fill="#D07A3A" />
        <rect x="37" y="50" width="5.5" height="11" rx="2.5" fill="#C06830" />
        {/* 글러브 */}
        <ellipse cx="40" cy="62" rx="5" ry="4" fill="#1B5E20" />
        <circle cx="37.5" cy="60.5" r="1.8" fill="#145214" />
        <circle cx="40.5" cy="59.5" r="1.8" fill="#145214" />
        <circle cx="43"   cy="60.5" r="1.8" fill="#145214" />
      </motion.g>

      {/* ====== 앞팔 (왼쪽, 바깥쪽) ====== */}
      <motion.g
        style={{ transformOrigin: '22px 46px' } as React.CSSProperties}
        animate={{
          y: lArmY,
          rotate: climbing ? [-20, -50, -20] : danger ? [20, 35, 20] : [-35, -35],
        }}
        transition={{ duration: T, repeat: climbing || danger ? Infinity : 0, ease: 'easeInOut', delay: climbing ? T / 2 : 0 }}
      >
        <rect x="18" y="40" width="6" height="12" rx="3" fill="#E8904A" />
        <rect x="17.5" y="50" width="5.5" height="11" rx="2.5" fill="#D07A3A" />
        <ellipse cx="20" cy="62" rx="5" ry="4" fill="#1B5E20" />
        <circle cx="17.5" cy="60.5" r="1.8" fill="#145214" />
        <circle cx="20.5" cy="59.5" r="1.8" fill="#145214" />
        <circle cx="23"   cy="60.5" r="1.8" fill="#145214" />
      </motion.g>

      {/* ====== 위험 땀방울 ====== */}
      {danger && (
        <>
          <motion.circle cx="14" cy="28" r="3" fill="#74BCFF"
            animate={{ cy: [28, 36, 44], opacity: [0.9, 0.5, 0] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
          <motion.circle cx="10" cy="34" r="2.2" fill="#74BCFF"
            animate={{ cy: [34, 41, 48], opacity: [0.8, 0.4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}
    </svg>
  );
}
