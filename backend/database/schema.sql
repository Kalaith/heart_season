CREATE TABLE IF NOT EXISTS seasons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    theme VARCHAR(120) NOT NULL,
    status VARCHAR(32) NOT NULL,
    current_round_number INT NOT NULL DEFAULT 1,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS rounds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season_id INT NOT NULL,
    round_number INT NOT NULL,
    event_name VARCHAR(120) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    resolution_seed VARCHAR(64) NOT NULL,
    opens_at DATETIME NOT NULL,
    locks_at DATETIME NOT NULL,
    resolved_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY uq_round_number (season_id, round_number),
    CONSTRAINT fk_rounds_season FOREIGN KEY (season_id) REFERENCES seasons(id)
);

CREATE TABLE IF NOT EXISTS characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season_id INT NOT NULL,
    name VARCHAR(120) NOT NULL,
    archetype VARCHAR(64) NOT NULL,
    bio TEXT NOT NULL,
    preferred_stance VARCHAR(32) NOT NULL,
    preferred_image_priority VARCHAR(32) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_characters_season FOREIGN KEY (season_id) REFERENCES seasons(id)
);

CREATE TABLE IF NOT EXISTS player_round_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    round_id INT NOT NULL,
    player_id VARCHAR(64) NOT NULL,
    target_character_id INT NOT NULL,
    stance VARCHAR(32) NOT NULL,
    image_priority VARCHAR(32) NOT NULL,
    risk_tolerance VARCHAR(32) NOT NULL,
    rival_target_player_id VARCHAR(64) NULL,
    special_move_key VARCHAR(64) NULL,
    intent_text TEXT NULL,
    interpreted_intent_json JSON NULL,
    submitted_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY uq_round_player_submission (round_id, player_id),
    CONSTRAINT fk_submission_round FOREIGN KEY (round_id) REFERENCES rounds(id),
    CONSTRAINT fk_submission_character FOREIGN KEY (target_character_id) REFERENCES characters(id)
);

CREATE TABLE IF NOT EXISTS relationship_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season_id INT NOT NULL,
    player_id VARCHAR(64) NOT NULL,
    character_id INT NOT NULL,
    attraction INT NOT NULL DEFAULT 0,
    trust INT NOT NULL DEFAULT 0,
    chemistry INT NOT NULL DEFAULT 0,
    comfort INT NOT NULL DEFAULT 0,
    respect INT NOT NULL DEFAULT 0,
    jealousy INT NOT NULL DEFAULT 0,
    last_interaction_round INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY uq_relationship_state (season_id, player_id, character_id),
    CONSTRAINT fk_relationship_season FOREIGN KEY (season_id) REFERENCES seasons(id),
    CONSTRAINT fk_relationship_character FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE TABLE IF NOT EXISTS reputation_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season_id INT NOT NULL,
    player_id VARCHAR(64) NOT NULL,
    public_image INT NOT NULL DEFAULT 0,
    drama INT NOT NULL DEFAULT 0,
    elegance INT NOT NULL DEFAULT 0,
    sincerity INT NOT NULL DEFAULT 0,
    reliability INT NOT NULL DEFAULT 0,
    scandal INT NOT NULL DEFAULT 0,
    dominant_label VARCHAR(64) NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY uq_reputation_state (season_id, player_id),
    CONSTRAINT fk_reputation_season FOREIGN KEY (season_id) REFERENCES seasons(id)
);

CREATE TABLE IF NOT EXISTS rumors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season_id INT NOT NULL,
    round_id INT NOT NULL,
    player_id VARCHAR(64) NOT NULL,
    rumor_text VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_rumor_season FOREIGN KEY (season_id) REFERENCES seasons(id),
    CONSTRAINT fk_rumor_round FOREIGN KEY (round_id) REFERENCES rounds(id)
);

CREATE TABLE IF NOT EXISTS player_round_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    round_id INT NOT NULL,
    player_id VARCHAR(64) NOT NULL,
    structured_outcome_json JSON NOT NULL,
    scene_text MEDIUMTEXT NOT NULL,
    private_notes_text TEXT NULL,
    public_recap_text TEXT NULL,
    created_at DATETIME NOT NULL,
    UNIQUE KEY uq_round_player_result (round_id, player_id),
    CONSTRAINT fk_result_round FOREIGN KEY (round_id) REFERENCES rounds(id)
);

CREATE TABLE IF NOT EXISTS ai_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    round_id INT NULL,
    player_id VARCHAR(64) NULL,
    purpose VARCHAR(64) NOT NULL,
    provider VARCHAR(32) NOT NULL,
    prompt_text MEDIUMTEXT NOT NULL,
    response_text MEDIUMTEXT NULL,
    status VARCHAR(32) NOT NULL,
    error_text TEXT NULL,
    created_at DATETIME NOT NULL
);
