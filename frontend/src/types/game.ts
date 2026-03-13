export interface RoundSummary {
  id: number;
  round_number: number;
  event_name: string;
  event_type: string;
  status: string;
  opens_at: string;
  locks_at: string;
  resolved_at: string | null;
}

export interface CharacterSummary {
  id: number;
  name: string;
  archetype: string;
  bio: string;
  preferred_stance: string;
  preferred_image_priority: string;
}

export interface ReputationState {
  public_image: number;
  drama: number;
  elegance: number;
  sincerity: number;
  reliability: number;
  scandal: number;
  dominant_label: string | null;
}

export interface SeasonState {
  season: {
    id: number;
    name: string;
    theme: string;
    status: string;
  };
  current_round: RoundSummary;
  featured_cast: CharacterSummary[];
  player_reputation: ReputationState;
  recent_rumors: Array<{
    id: number;
    rumor_text: string;
    player_id: string;
    created_at: string;
  }>;
}

export interface SubmissionPayload {
  target_character_id: number;
  stance: string;
  image_priority: string;
  risk_tolerance: string;
  rival_target_player_id?: string | null;
  special_move_key?: string | null;
  intent_text?: string | null;
}

export interface PlayerResult {
  structured_outcome_json: string;
  scene_text: string;
  private_notes_text: string | null;
  public_recap_text: string | null;
}
