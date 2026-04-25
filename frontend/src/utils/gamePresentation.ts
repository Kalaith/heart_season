import type { CharacterSummary, ReputationState } from '../types/game';

export interface OutcomeData {
  target_character_id: number;
  stance: string;
  image_priority: string;
  risk_tolerance: string;
  relationship_deltas: Record<string, number>;
  reputation_deltas: Record<string, number | string | null>;
  rumor_text: string | null;
}

const uiDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export const formatEpisodeTime = (value: string): string => {
  const date = new Date(`${value}Z`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return uiDateFormatter.format(date);
};

export const getCountdownLabel = (value: string): string => {
  const target = new Date(`${value}Z`).getTime();
  if (Number.isNaN(target)) {
    return 'Timer unavailable';
  }

  const remainingMs = target - Date.now();
  if (remainingMs <= 0) {
    return 'Episode locking now';
  }

  const totalMinutes = Math.floor(remainingMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h left`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }

  return `${minutes}m left`;
};

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');

export const getPreferenceLine = (character: CharacterSummary): string =>
  `Responds to ${character.preferred_stance} energy and ${character.preferred_image_priority} presentation.`;

export const getTurnOffLine = (character: CharacterSummary): string => {
  if (character.preferred_image_priority === 'authenticity') {
    return 'Likely to pull back if the flirting feels performative.';
  }

  if (character.preferred_image_priority === 'glamour') {
    return 'Cold feet if the moment feels too safe or forgettable.';
  }

  if (character.preferred_image_priority === 'mystery') {
    return 'Gets bored when everything is explained too quickly.';
  }

  return 'Chaos works until it turns embarrassing in public.';
};

export const getPortraitGradient = (character: CharacterSummary): string => {
  if (character.preferred_image_priority === 'glamour') {
    return 'from-[#f4c8d6] via-[#f4dfb8] to-[#fff7ee]';
  }

  if (character.preferred_image_priority === 'mystery') {
    return 'from-[#d6c7f4] via-[#f2d5e0] to-[#fff7f2]';
  }

  if (character.preferred_image_priority === 'chaos') {
    return 'from-[#f6c4c9] via-[#ffd9a8] to-[#fff4dc]';
  }

  return 'from-[#f8d8e1] via-[#f3e8cf] to-[#fff8f4]';
};

export const getMomentumLine = (character: CharacterSummary): string => {
  if (character.preferred_stance === 'gentle') {
    return 'Feels like a slow burn waiting for a sincere move.';
  }

  if (character.preferred_stance === 'bold') {
    return 'This one notices confidence fast and tests it immediately.';
  }

  if (character.preferred_stance === 'flirty') {
    return 'Chemistry spikes quickly, but so does public attention.';
  }

  return 'Best approached with control, timing, and a little mystery.';
};

const getBandLabel = (value: number, labels: [string, string, string, string]): string => {
  if (value >= 80) return labels[3];
  if (value >= 60) return labels[2];
  if (value >= 35) return labels[1];
  return labels[0];
};

export const getReputationSummary = (reputation: ReputationState): string =>
  getBandLabel(reputation.public_image, ['Overlooked', 'Noticed', 'Admired', 'Villa favorite']);

export const getScandalSummary = (reputation: ReputationState): string =>
  getBandLabel(reputation.scandal, ['Quiet', 'Buzzing', 'Messy', 'Explosive']);

export const getRomanceStyleSummary = (reputation: ReputationState): string => {
  if (reputation.elegance >= reputation.drama && reputation.sincerity >= reputation.scandal) {
    return 'Polished slow-burn';
  }

  if (reputation.drama > reputation.elegance && reputation.public_image >= 50) {
    return 'Headline magnet';
  }

  if (reputation.sincerity >= 60) {
    return 'Open-hearted romantic';
  }

  return 'Hard to predict';
};

export const getSocialStandingSummary = (reputation: ReputationState): string => {
  if (reputation.reliability >= 70) {
    return 'Trusted presence';
  }

  if (reputation.drama >= 70) {
    return 'Constantly watched';
  }

  if (reputation.public_image >= 60) {
    return 'Socially protected';
  }

  return 'Still taking shape';
};

export const parseOutcomeData = (value: string): OutcomeData | null => {
  try {
    return JSON.parse(value) as OutcomeData;
  } catch {
    return null;
  }
};

export const formatDeltaLabel = (key: string): string => {
  const labels: Record<string, string> = {
    attraction: 'Attraction',
    trust: 'Trust',
    chemistry: 'Chemistry',
    comfort: 'Comfort',
    respect: 'Respect',
    jealousy: 'Jealousy',
    public_image: 'Public image',
    drama: 'Drama',
    elegance: 'Elegance',
    sincerity: 'Sincerity',
    reliability: 'Reliability',
    scandal: 'Scandal',
  };

  return labels[key] ?? key;
};

export const getDeltaTone = (value: number): string =>
  value > 0 ? 'text-[#8a365b]' : value < 0 ? 'text-[#7b4c22]' : 'text-[#6b4558]';
