/**
 * ClimbingCat — 측면 뷰, 벽에 붙어서 실제로 등반하는 고양이
 * 
 * 구조:
 * - 몸통이 벽을 향함 (오른쪽이 벽)
 * - 오른손/왼손이 번갈아 벽 홀드를 잡고 당김
 * - 발도 벽을 밟으며 올라감
 * - 꼬리는 균형 잡듯 흔들림
 */

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';

interface Props {
  state: 'climbing' | 'danger' | 'idle';
  size?: number;
}

// 등반 사이클: 4단계
// 1) 오른손 위로 뻗기
// 2) 오른손으로 당기며 몸 올리기 + 왼발 올리기
// 3) 왼손 위로 뻗기
// 4) 왼손으로 당기며 몸 올리기 + 오른발 올리기

export default function ClimbingCat({ state, size = 72 }: Props) {
  const isClimbing = state === 'climbing';
  const isDanger   = state === 'danger';
  const bodyCtrl   = useAnimationControls();

  useEffect(() => {
    if (!isClimbing) return;
    // 몸통 미세한 위아래 바운스 — 실제로 올라가는 느낌
    bodyCtrl.start({
      y: [0, -2, 0, -2, 0],
      transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
    });
  }, [isClimbing, bodyCtrl]);

  // 측면뷰 기준 좌표 (오른쪽 = 벽)
  // viewBox: 80 x 100, 캐릭터는 오른쪽 벽에 붙어있음
  return (
    <motion.svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={isDanger ? { rotate: [-5, -2, -5], x: [1, -1, 1] } : {}}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      {/* ━━━ 꼬리 (뒤에 그려서 몸통이 위로 오게) ━━━ */}
      <motion.path
        d={isDanger
          ? "M28 58 Q10 62 8 72 Q6 80 14 82"
          : "M28 58 Q10 55 8 68 Q6 78 16 80"
        }
        stroke="#E8904A" strokeWidth="5" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
        animate={isClimbing ? {
          d: [
            "M28 58 Q10 55 8 68 Q6 78 16 80",
            "M28 58 Q12 52 10 65 Q8 76 18 78",
            "M28 58 Q10 55 8 68 Q6 78 16 80",
          ]
        } : {}}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ━━━ 오른발 (벽 쪽 발) ━━━ */}
      <motion.g
        animate={isClimbing ? {
          // 2번째 키프레임에서 발을 위로 올림
          y: [0, -8, 0, 0, 0],
          rotate: [0, -20, 0, 0, 0],
        } : {}}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        style={{ originX: '52px', originY: '72px' } as React.CSSProperties}
      >
        {/* 허벅지 */}
        <rect x="48" y="68" width="8" height="14" rx="4" fill="#E8904A" />
        {/* 정강이 */}
        <rect x="50" y="80" width="7" height="12" rx="3.5" fill="#D07A3A" />
        {/* 클라이밍화 — 발끝이 벽을 향함 */}
        <ellipse cx="58" cy="91" rx="7" ry="4" fill="#CC3300" />
        <ellipse cx="60" cy="90" rx="5" ry="3" fill="#EE4411" />
      </motion.g>

      {/* ━━━ 왼발 (바깥쪽 발) ━━━ */}
      <motion.g
        animate={isClimbing ? {
          y: [0, 0, 0, -8, 0],
          rotate: [0, 0, 0, -15, 0],
        } : {}}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        style={{ originX: '36px', originY: '70px' } as React.CSSProperties}
      >
        <rect x="32" y="68" width="8" height="14" rx="4" fill="#E8904A" />
        <rect x="30" y="80" width="7" height="12" rx="3.5" fill="#D07A3A" />
        <ellipse cx="32" cy="91" rx="6" ry="4" fill="#CC3300" />
        <ellipse cx="30" cy="90" rx="4.5" ry="3" fill="#EE4411" />
      </motion.g>

      {/* ━━━ 몸통 ━━━ */}
      <motion.g animate={bodyCtrl}>
        {/* 메인 몸통 */}
        <ellipse cx="42" cy="58" rx="16" ry="18" fill="#F5A05A" />
        {/* 배 흰털 */}
        <ellipse cx="40" cy="60" rx="9" ry="12" fill="#FFF0E0" opacity="0.6" />

        {/* 하네스 */}
        <path d="M28 52 Q42 56 56 52" stroke="#2E7D32" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M34 52 L32 68" stroke="#2E7D32" strokeWidth="2" />
        <path d="M50 52 L52 68" stroke="#2E7D32" strokeWidth="2" />
        <rect x="37" y="62" width="10" height="7" rx="2" fill="#1B5E20" />
        {/* 초크 백 */}
        <ellipse cx="28" cy="60" rx="6" ry="8" fill="#5B8DD9" />
        <ellipse cx="28" cy="59" rx="5" ry="6.5" fill="#6B9DE9" />

        {/* ━━━ 머리 ━━━ */}
        {/* 헬멧 */}
        <ellipse cx="42" cy="30" rx="14" ry="12" fill="#E63900" />
        <ellipse cx="42" cy="32" rx="14" ry="9"  fill="#FF4400" />
        {/* 헬멧 벤트 */}
        <rect x="35" y="24" width="2.5" height="7" rx="1.2" fill="#CC2200" />
        <rect x="40" y="23" width="2.5" height="7" rx="1.2" fill="#CC2200" />
        <rect x="45" y="24" width="2.5" height="7" rx="1.2" fill="#CC2200" />
        {/* 얼굴 */}
        <ellipse cx="42" cy="38" rx="12" ry="10" fill="#F5A05A" />
        {/* 귀 */}
        <polygon points="31,30 27,22 34,29" fill="#F5A05A" />
        <polygon points="53,30 57,22 50,29" fill="#F5A05A" />
        <polygon points="31,30 28,23 33,29" fill="#FFB6C1" />
        <polygon points="53,30 56,23 51,29" fill="#FFB6C1" />
        {/* 눈 — 벽 보는 방향 (오른쪽) */}
        <ellipse cx="38" cy="36" rx="3.5" ry="4"   fill="white" />
        <ellipse cx="47" cy="35" rx="3"   ry="3.5" fill="white" />
        <ellipse cx="39" cy="36.5" rx="2" ry="2.5" fill="#111" />
        <ellipse cx="48" cy="35.5" rx="1.8" ry="2.2" fill="#111" />
        <circle  cx="39.8" cy="35.5" r="0.8" fill="white" />
        <circle  cx="48.6" cy="34.7" r="0.7" fill="white" />
        {/* 코 & 입 */}
        <ellipse cx="43" cy="42" rx="2.2" ry="1.5" fill="#E8707A" />
        <path d="M41 43.5 Q43 45.5 45 43.5" stroke="#C05060" strokeWidth="1" fill="none" />
        {/* 수염 */}
        <line x1="30" y1="41" x2="39" y2="42" stroke="#AAA" strokeWidth="0.7"/>
        <line x1="30" y1="43" x2="39" y2="43.5" stroke="#AAA" strokeWidth="0.7"/>
        <line x1="54" y1="41" x2="46" y2="42" stroke="#AAA" strokeWidth="0.7"/>
        <line x1="54" y1="43" x2="46" y2="43.5" stroke="#AAA" strokeWidth="0.7"/>

        {/* 헬멧 턱끈 */}
        <path d="M30 34 Q28 40 32 44" stroke="#CC2200" strokeWidth="1.2" fill="none"/>
        <path d="M54 34 Q56 40 52 44" stroke="#CC2200" strokeWidth="1.2" fill="none"/>
      </motion.g>

      {/* ━━━ 오른팔 (벽 쪽, 홀드 잡는 팔) ━━━ */}
      <motion.g
        style={{ originX: '54px', originY: '50px' } as React.CSSProperties}
        animate={isClimbing ? {
          // 위로 뻗기 → 당기기 → 대기 → 대기
          rotate: [-60, -20, -20, -20, -60],
          y:      [-4,   2,   2,   2,  -4],
        } : isDanger ? { rotate: [-60, -60] } : { rotate: [-30, -30] }}
        transition={{ duration: 1.6, repeat: isClimbing ? Infinity : 0, ease: 'easeInOut' }}
      >
        {/* 윗팔 */}
        <rect x="52" y="44" width="7" height="14" rx="3.5" fill="#E8904A" />
        {/* 아랫팔 */}
        <rect x="54" y="56" width="6" height="13" rx="3" fill="#D07A3A" />
        {/* 글러브 + 손 */}
        <ellipse cx="57" cy="70" rx="5.5" ry="4.5" fill="#2E7D32" />
        <circle cx="54" cy="68" r="2" fill="#1B5E20" />
        <circle cx="57" cy="67" r="2" fill="#1B5E20" />
        <circle cx="60" cy="68" r="2" fill="#1B5E20" />
      </motion.g>

      {/* ━━━ 왼팔 (바깥쪽, 균형 팔) ━━━ */}
      <motion.g
        style={{ originX: '30px', originY: '50px' } as React.CSSProperties}
        animate={isClimbing ? {
          // 오른팔이 당길 때 왼팔이 위로
          rotate: [-20, -20, -60, -20, -20],
          y:      [2,    2,  -4,   2,   2],
        } : isDanger ? { rotate: [20, 30, 20], x: [-4, 0, -4] }
          : { rotate: [-20, -20] }}
        transition={{ duration: 1.6, repeat: isClimbing ? Infinity : (isDanger ? Infinity : 0), ease: 'easeInOut' }}
      >
        <rect x="25" y="44" width="7" height="14" rx="3.5" fill="#E8904A" />
        <rect x="23" y="56" width="6" height="13" rx="3" fill="#D07A3A" />
        <ellipse cx="26" cy="70" rx="5.5" ry="4.5" fill="#2E7D32" />
        <circle cx="23" cy="68" r="2" fill="#1B5E20" />
        <circle cx="26" cy="67" r="2" fill="#1B5E20" />
        <circle cx="29" cy="68" r="2" fill="#1B5E20" />
      </motion.g>

      {/* ━━━ 위험 상태 땀방울 ━━━ */}
      {isDanger && (
        <>
          <motion.ellipse cx="22" cy="32" rx="2.5" ry="3.5" fill="#74BCFF"
            animate={{ y: [0, 8, 16], opacity: [0.9, 0.5, 0] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
          <motion.ellipse cx="18" cy="38" rx="2" ry="3" fill="#74BCFF"
            animate={{ y: [0, 6, 12], opacity: [0.8, 0.4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.25 }}
          />
        </>
      )}
    </motion.svg>
  );
}
