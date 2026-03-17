export interface DailyQuest {
  id: number;
  emoji: string;
  text: string;
  category: 'mindfulness' | 'body' | 'health' | 'growth' | 'creative' | 'social';
}

export const DAILY_QUESTS: DailyQuest[] = [
  // 🧘 마음챙김 (Mindfulness) — 20개
  { id: 1, emoji: '🧘', text: '명상 1분 하기', category: 'mindfulness' },
  { id: 2, emoji: '🌤️', text: '하늘 보고 한숨 쉬기 (심호흡!)', category: 'mindfulness' },
  { id: 3, emoji: '🌬️', text: '깊은 심호흡 5번 하기', category: 'mindfulness' },
  { id: 4, emoji: '👂', text: '1분간 주변 소리에 집중하기', category: 'mindfulness' },
  { id: 5, emoji: '🌅', text: '창밖을 30초간 바라보기', category: 'mindfulness' },
  { id: 6, emoji: '😌', text: '눈 감고 10까지 세기', category: 'mindfulness' },
  { id: 7, emoji: '🕯️', text: '1분간 아무 생각 없이 가만히 있기', category: 'mindfulness' },
  { id: 8, emoji: '🙏', text: '오늘 감사한 것 하나 떠올리기', category: 'mindfulness' },
  { id: 9, emoji: '☁️', text: '구름 모양 관찰하기', category: 'mindfulness' },
  { id: 10, emoji: '🎵', text: '좋아하는 노래 한 곡 집중해서 듣기', category: 'mindfulness' },
  { id: 11, emoji: '🍃', text: '바람 느끼며 30초 서있기', category: 'mindfulness' },
  { id: 12, emoji: '✨', text: '오늘 가장 좋았던 순간 떠올리기', category: 'mindfulness' },
  { id: 13, emoji: '🌊', text: '파도 소리 or 자연 소리 1분 듣기', category: 'mindfulness' },
  { id: 14, emoji: '💭', text: '내일의 나에게 한마디 생각하기', category: 'mindfulness' },
  { id: 15, emoji: '🌸', text: '주변에서 예쁜 것 하나 찾기', category: 'mindfulness' },
  { id: 16, emoji: '📝', text: '지금 기분을 한 단어로 표현하기', category: 'mindfulness' },
  { id: 17, emoji: '🧊', text: '차가운 물로 손 씻으며 감각에 집중', category: 'mindfulness' },
  { id: 18, emoji: '🫧', text: '비눗방울 불듯 천천히 숨 내쉬기', category: 'mindfulness' },
  { id: 19, emoji: '🌙', text: '오늘 하루를 한 문장으로 정리하기', category: 'mindfulness' },
  { id: 20, emoji: '🎯', text: '지금 이 순간에 집중하기 (30초)', category: 'mindfulness' },

  // 💪 몸 움직이기 (Body) — 20개
  { id: 21, emoji: '🤸', text: '잠시 일어나서 스트레칭하기', category: 'body' },
  { id: 22, emoji: '🚶', text: '5분 산책하기', category: 'body' },
  { id: 23, emoji: '🏋️', text: '스쿼트 10개 하기', category: 'body' },
  { id: 24, emoji: '💃', text: '좋아하는 노래에 맞춰 30초 춤추기', category: 'body' },
  { id: 25, emoji: '🧎', text: '목 돌리기 스트레칭 (좌우 5번씩)', category: 'body' },
  { id: 26, emoji: '🦶', text: '까치발 들기 20번', category: 'body' },
  { id: 27, emoji: '🪜', text: '계단 오르내리기 1번', category: 'body' },
  { id: 28, emoji: '👐', text: '손목 돌리기 (코딩 후 필수!)', category: 'body' },
  { id: 29, emoji: '🧘‍♂️', text: '허리 숙여 발끝 터치 시도하기', category: 'body' },
  { id: 30, emoji: '💪', text: '팔굽혀펴기 5개 (무릎 대고 OK)', category: 'body' },
  { id: 31, emoji: '🏃', text: '제자리 뛰기 30초', category: 'body' },
  { id: 32, emoji: '🙆', text: '팔 크게 돌리기 10번', category: 'body' },
  { id: 33, emoji: '🤷', text: '어깨 으쓱으쓱 10번', category: 'body' },
  { id: 34, emoji: '🦵', text: '런지 좌우 5번씩', category: 'body' },
  { id: 35, emoji: '🧍', text: '한 발로 30초 서있기 (균형!)', category: 'body' },
  { id: 36, emoji: '🏠', text: '집(방) 한 바퀴 걸어보기', category: 'body' },
  { id: 37, emoji: '👋', text: '온몸 털기 (10초)', category: 'body' },
  { id: 38, emoji: '🙄', text: '눈 운동: 상하좌우 + 원 그리기', category: 'body' },
  { id: 39, emoji: '🤜', text: '허공에 펀치 10번 (스트레스 해소!)', category: 'body' },
  { id: 40, emoji: '🌳', text: '밖에 나가서 신선한 공기 마시기', category: 'body' },

  // 💧 건강 (Health) — 15개
  { id: 41, emoji: '💧', text: '물 한 잔 마시기', category: 'health' },
  { id: 42, emoji: '🍎', text: '과일 하나 먹기', category: 'health' },
  { id: 43, emoji: '🥗', text: '채소가 포함된 식사하기', category: 'health' },
  { id: 44, emoji: '😴', text: '10분 파워냅 (눈만 감아도 OK)', category: 'health' },
  { id: 45, emoji: '🪥', text: '간식 후 양치하기', category: 'health' },
  { id: 46, emoji: '🧴', text: '핸드크림 바르기 (손 관리!)', category: 'health' },
  { id: 47, emoji: '☀️', text: '햇빛 5분 쬐기 (비타민D!)', category: 'health' },
  { id: 48, emoji: '🫖', text: '따뜻한 차 한 잔 마시기', category: 'health' },
  { id: 49, emoji: '🥜', text: '건강한 간식 먹기 (견과류 등)', category: 'health' },
  { id: 50, emoji: '📱', text: '스마트폰 5분 내려놓기', category: 'health' },
  { id: 51, emoji: '🧘', text: '바른 자세로 앉기 체크', category: 'health' },
  { id: 52, emoji: '👀', text: '20-20-20 눈 쉬기 (20초간 20ft 바라보기)', category: 'health' },
  { id: 53, emoji: '🦷', text: '치실 사용하기', category: 'health' },
  { id: 54, emoji: '🧂', text: '오늘 물 3잔 이상 마셨는지 체크', category: 'health' },
  { id: 55, emoji: '😊', text: '거울 보고 웃기 (진짜 효과 있음!)', category: 'health' },

  // 📚 성장 (Growth) — 20개
  { id: 56, emoji: '📖', text: '책 딱 1장만 읽기', category: 'growth' },
  { id: 57, emoji: '🇬🇧', text: '영어 표현 딱 하나만 외우기', category: 'growth' },
  { id: 58, emoji: '📰', text: '뉴스 기사 하나 읽기', category: 'growth' },
  { id: 59, emoji: '💡', text: '새로운 단어 하나 검색하기', category: 'growth' },
  { id: 60, emoji: '🎓', text: 'TED 영상 하나 보기 (5분짜리)', category: 'growth' },
  { id: 61, emoji: '✍️', text: '일기 3줄 쓰기', category: 'growth' },
  { id: 62, emoji: '🧠', text: '오늘 배운 것 하나 정리하기', category: 'growth' },
  { id: 63, emoji: '🎧', text: '팟캐스트 5분 듣기', category: 'growth' },
  { id: 64, emoji: '📌', text: '내일 할 일 3개 적기', category: 'growth' },
  { id: 65, emoji: '🗂️', text: '폰 앨범 사진 10장 정리하기', category: 'growth' },
  { id: 66, emoji: '📧', text: '안 읽은 이메일 3개 정리하기', category: 'growth' },
  { id: 67, emoji: '🔖', text: '읽고 싶은 기사 북마크하기', category: 'growth' },
  { id: 68, emoji: '🗓️', text: '이번 주 일정 한 번 훑어보기', category: 'growth' },
  { id: 69, emoji: '💻', text: '새로운 단축키 하나 배우기', category: 'growth' },
  { id: 70, emoji: '📊', text: '오늘 지출 한 번 체크하기', category: 'growth' },
  { id: 71, emoji: '🇯🇵', text: '외국어 문장 하나 따라 읽기', category: 'growth' },
  { id: 72, emoji: '🎯', text: '이번 달 목표 진행 상황 체크', category: 'growth' },
  { id: 73, emoji: '📚', text: '읽던 책 목차 다시 보기', category: 'growth' },
  { id: 74, emoji: '🔍', text: '관심 있는 주제 위키 검색하기', category: 'growth' },
  { id: 75, emoji: '🤔', text: '오늘의 실수에서 배운 점 정리', category: 'growth' },

  // 🎨 창의력 (Creative) — 15개
  { id: 76, emoji: '🎨', text: '아무거나 30초 낙서하기', category: 'creative' },
  { id: 77, emoji: '📸', text: '예쁜 거 하나 사진 찍기', category: 'creative' },
  { id: 78, emoji: '🎵', text: '새로운 장르 음악 한 곡 듣기', category: 'creative' },
  { id: 79, emoji: '🖊️', text: '오늘을 색깔로 표현하면?', category: 'creative' },
  { id: 80, emoji: '📝', text: '짧은 시(or 하이쿠) 쓰기', category: 'creative' },
  { id: 81, emoji: '🎭', text: '재미있는 밈 하나 만들기', category: 'creative' },
  { id: 82, emoji: '🏗️', text: '종이접기 하나 접기', category: 'creative' },
  { id: 83, emoji: '🎹', text: '악기 30초 연주 (에어기타도 OK)', category: 'creative' },
  { id: 84, emoji: '📐', text: '도형만으로 그림 그리기', category: 'creative' },
  { id: 85, emoji: '🗺️', text: '가보고 싶은 여행지 검색하기', category: 'creative' },
  { id: 86, emoji: '🍳', text: '새로운 레시피 하나 검색하기', category: 'creative' },
  { id: 87, emoji: '🎲', text: '주사위 굴려서 나온 수로 뭔가 하기', category: 'creative' },
  { id: 88, emoji: '🌈', text: '무지개 색 순서대로 물건 찾기', category: 'creative' },
  { id: 89, emoji: '✏️', text: '왼손(or 평소 안 쓰는 손)으로 이름 쓰기', category: 'creative' },
  { id: 90, emoji: '🎬', text: '보고 싶은 영화 한 편 골라두기', category: 'creative' },

  // 😊 관계 (Social) — 10개
  { id: 91, emoji: '📱', text: '오랜만에 친구한테 연락하기', category: 'social' },
  { id: 92, emoji: '💬', text: '누군가에게 감사하다고 말하기', category: 'social' },
  { id: 93, emoji: '👏', text: '누군가를 진심으로 칭찬하기', category: 'social' },
  { id: 94, emoji: '😊', text: '모르는 사람에게 미소 짓기', category: 'social' },
  { id: 95, emoji: '📮', text: '답장 안 한 메시지 하나 답장하기', category: 'social' },
  { id: 96, emoji: '🤗', text: '가족에게 "사랑해" 보내기', category: 'social' },
  { id: 97, emoji: '🎁', text: '작은 친절 베풀기 (문 잡아주기 등)', category: 'social' },
  { id: 98, emoji: '👋', text: '이웃에게 인사하기', category: 'social' },
  { id: 99, emoji: '🍽️', text: '같이 밥 먹을 사람 약속 잡기', category: 'social' },
  { id: 100, emoji: '💌', text: '고마운 사람에게 짧은 메시지 보내기', category: 'social' },
];

/**
 * 오늘의 사이드 퀘스트 가져오기
 * 날짜 기반 시드로 매일 다른 퀘스트 (같은 날은 같은 퀘스트)
 */
export function getDailyQuest(): DailyQuest {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % DAILY_QUESTS.length;
  return DAILY_QUESTS[index];
}

/**
 * 오늘 사이드 퀘스트 완료 여부 확인
 */
export function isDailyQuestCompleted(): boolean {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return localStorage.getItem('questify_daily_quest') === today;
}

/**
 * 오늘 사이드 퀘스트 완료 처리
 */
export function completeDailyQuest(): void {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem('questify_daily_quest', today);
}
