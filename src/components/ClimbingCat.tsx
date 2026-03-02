import { motion } from 'framer-motion';

interface Props {
  state: 'climbing' | 'danger' | 'idle';
  size?: number;
}

/**
 * SVG로 그린 고양이 캐릭터.
 * state='climbing' → 왼손/오른손 번갈아 뻗는 등반 애니메이션
 * state='danger'   → 한 손만 매달린 위태로운 상태
 * state='idle'     → 가만히 매달려있음
 */
export default function ClimbingCat({ state, size = 72 }: Props) {
  const isClimbing = state === 'climbing';
  const isDanger   = state === 'danger';

  // 팔 각도 애니메이션
  // 왼팔: 위로 뻗기 → 당기기 반복
  const leftArmRotate  = isClimbing ? [-40, -80, -40] : isDanger ? [-80, -80] : [-45, -45];
  const rightArmRotate = isClimbing ? [-80, -40, -80] : isDanger ? [30,  30]  : [-45, -45];

  // 다리 애니메이션
  const leftLegRotate  = isClimbing ? [10, 30, 10]  : [15, 15];
  const rightLegRotate = isClimbing ? [30, 10, 30]  : [15, 15];

  const duration = isClimbing ? 0.8 : 0;
  const repeat   = isClimbing ? Infinity : 0;

  return (
    <motion.svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 60 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // 전체 캐릭터 흔들림
      animate={isClimbing
        ? { rotate: [-2, 2, -2], x: [-1, 1, -1] }
        : isDanger
        ? { rotate: [-8, -5, -8], x: [-2, 0, -2] }
        : {}
      }
      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* ── 헬멧 ── */}
      <ellipse cx="30" cy="12" rx="13" ry="10" fill="#E86B2C" />
      <ellipse cx="30" cy="14" rx="13" ry="7"  fill="#F07A35" />
      {/* 헬멧 통풍구 */}
      <rect x="22" y="8" width="3" height="6" rx="1.5" fill="#C55A1E" />
      <rect x="28" y="7" width="3" height="6" rx="1.5" fill="#C55A1E" />
      <rect x="34" y="8" width="3" height="6" rx="1.5" fill="#C55A1E" />
      {/* 헬멧 턱끈 */}
      <path d="M18 16 Q15 22 18 24" stroke="#C55A1E" strokeWidth="1.5" fill="none"/>
      <path d="M42 16 Q45 22 42 24" stroke="#C55A1E" strokeWidth="1.5" fill="none"/>

      {/* ── 얼굴 ── */}
      <ellipse cx="30" cy="22" rx="11" ry="10" fill="#F5A05A" />
      {/* 귀 */}
      <polygon points="20,14 17,8 23,13" fill="#F5A05A" />
      <polygon points="40,14 43,8 37,13" fill="#F5A05A" />
      <polygon points="20,14 18,9 22,13" fill="#FFB6C1" />
      <polygon points="40,14 42,9 38,13" fill="#FFB6C1" />
      {/* 눈 */}
      <ellipse cx="25" cy="21" rx="3" ry="3.5" fill="white" />
      <ellipse cx="35" cy="21" rx="3" ry="3.5" fill="white" />
      <ellipse cx="25.5" cy="21.5" rx="1.8" ry="2.2" fill="#1a1a1a" />
      <ellipse cx="35.5" cy="21.5" rx="1.8" ry="2.2" fill="#1a1a1a" />
      {/* 눈 하이라이트 */}
      <circle cx="26.2" cy="20.5" r="0.7" fill="white" />
      <circle cx="36.2" cy="20.5" r="0.7" fill="white" />
      {/* 코 */}
      <ellipse cx="30" cy="26" rx="2" ry="1.3" fill="#E8707A" />
      {/* 수염 */}
      <line x1="20" y1="25" x2="27" y2="26" stroke="#888" strokeWidth="0.8"/>
      <line x1="20" y1="27" x2="27" y2="27" stroke="#888" strokeWidth="0.8"/>
      <line x1="40" y1="25" x2="33" y2="26" stroke="#888" strokeWidth="0.8"/>
      <line x1="40" y1="27" x2="33" y2="27" stroke="#888" strokeWidth="0.8"/>

      {/* ── 몸통 ── */}
      <rect x="22" y="30" width="16" height="20" rx="5" fill="#F5A05A" />
      {/* 하네스 */}
      <path d="M22 35 Q30 38 38 35" stroke="#4A8C3F" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M26 35 L26 45" stroke="#4A8C3F" strokeWidth="2" fill="none"/>
      <path d="M34 35 L34 45" stroke="#4A8C3F" strokeWidth="2" fill="none"/>
      <rect x="27" y="42" width="6" height="4" rx="1.5" fill="#3A7A2F" />
      {/* 배낭 */}
      <rect x="34" y="32" width="8" height="12" rx="3" fill="#5B8DD9" />
      <rect x="35" y="33" width="6" height="10" rx="2" fill="#6B9DE9" />

      {/* ── 왼팔 (암벽 위로 뻗는 팔) ── */}
      <motion.g
        style={{ originX: '22px', originY: '32px' } as React.CSSProperties}
        animate={{ rotate: leftArmRotate }}
        transition={{ duration, repeat, ease: 'easeInOut' }}
      >
        {/* 윗팔 */}
        <rect x="14" y="30" width="9" height="4" rx="2" fill="#F5A05A" transform="rotate(-50 22 32)"/>
        {/* 아랫팔 */}
        <rect x="8" y="18" width="9" height="4" rx="2" fill="#F5A05A" transform="rotate(-50 22 32)"/>
        {/* 손 (클라이밍 글러브) */}
        <ellipse cx="7" cy="16" rx="3.5" ry="3" fill="#4A8C3F" transform="rotate(-50 22 32)"/>
        {/* 손가락 */}
        <circle cx="5"  cy="14" r="1.2" fill="#3A7A2F" transform="rotate(-50 22 32)"/>
        <circle cx="8"  cy="13" r="1.2" fill="#3A7A2F" transform="rotate(-50 22 32)"/>
        <circle cx="10" cy="14" r="1.2" fill="#3A7A2F" transform="rotate(-50 22 32)"/>
      </motion.g>

      {/* ── 오른팔 ── */}
      <motion.g
        style={{ originX: '38px', originY: '32px' } as React.CSSProperties}
        animate={{ rotate: rightArmRotate }}
        transition={{ duration, repeat, ease: 'easeInOut' }}
      >
        <rect x="37" y="30" width="9" height="4" rx="2" fill="#F5A05A" transform="rotate(50 38 32)"/>
        <rect x="43" y="18" width="9" height="4" rx="2" fill="#F5A05A" transform="rotate(50 38 32)"/>
        <ellipse cx="53" cy="16" rx="3.5" ry="3" fill="#4A8C3F" transform="rotate(50 38 32)"/>
        <circle cx="51" cy="14" r="1.2" fill="#3A7A2F" transform="rotate(50 38 32)"/>
        <circle cx="54" cy="13" r="1.2" fill="#3A7A2F" transform="rotate(50 38 32)"/>
        <circle cx="56" cy="14" r="1.2" fill="#3A7A2F" transform="rotate(50 38 32)"/>
      </motion.g>

      {/* ── 왼다리 ── */}
      <motion.g
        style={{ originX: '25px', originY: '48px' } as React.CSSProperties}
        animate={{ rotate: leftLegRotate }}
        transition={{ duration, repeat, ease: 'easeInOut' }}
      >
        <rect x="22" y="48" width="5" height="14" rx="2.5" fill="#F5A05A" />
        {/* 클라이밍 슈즈 */}
        <ellipse cx="24" cy="63" rx="5" ry="3" fill="#E8B500" />
        <ellipse cx="24" cy="62" rx="4" ry="2" fill="#FFD000" />
      </motion.g>

      {/* ── 오른다리 ── */}
      <motion.g
        style={{ originX: '33px', originY: '48px' } as React.CSSProperties}
        animate={{ rotate: rightLegRotate }}
        transition={{ duration: duration * 0.9, repeat, ease: 'easeInOut' }}
      >
        <rect x="31" y="48" width="5" height="14" rx="2.5" fill="#F5A05A" />
        <ellipse cx="34" cy="63" rx="5" ry="3" fill="#E8B500" />
        <ellipse cx="34" cy="62" rx="4" ry="2" fill="#FFD000" />
      </motion.g>

      {/* ── 꼬리 ── */}
      <motion.path
        d="M38 45 Q48 50 45 60 Q42 68 48 70"
        stroke="#F5A05A" strokeWidth="3.5" fill="none" strokeLinecap="round"
        animate={{ d: isClimbing
          ? ["M38 45 Q48 50 45 60 Q42 68 48 70", "M38 45 Q50 48 48 58 Q46 66 52 68", "M38 45 Q48 50 45 60 Q42 68 48 70"]
          : ["M38 45 Q48 50 45 60 Q42 68 48 70"]
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 위험 상태 — 땀방울 */}
      {isDanger && (
        <>
          <motion.ellipse cx="15" cy="18" rx="2" ry="3" fill="#74BCFF" opacity={0.8}
            animate={{ y: [0, 5, 10], opacity: [0.8, 0.5, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <motion.ellipse cx="12" cy="22" rx="1.5" ry="2.5" fill="#74BCFF" opacity={0.7}
            animate={{ y: [0, 4, 8], opacity: [0.7, 0.4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}
    </motion.svg>
  );
}
