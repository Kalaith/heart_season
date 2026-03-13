import { beforeEach, describe, expect, it } from 'vitest';
import { useRoundStore } from './roundStore';
import { useUiStore } from './uiStore';

describe('round store', () => {
  beforeEach(() => {
    useRoundStore.getState().reset();
  });

  it('updates individual draft fields', () => {
    useRoundStore.getState().setField('stance', 'bold');
    useRoundStore.getState().setField('target_character_id', 7);

    expect(useRoundStore.getState().draft).toMatchObject({
      stance: 'bold',
      target_character_id: 7,
      image_priority: 'authenticity',
      risk_tolerance: 'moderate',
    });
  });

  it('resets the draft back to defaults', () => {
    useRoundStore.getState().setField('intent_text', 'Cause a little drama.');
    useRoundStore.getState().reset();

    expect(useRoundStore.getState().draft).toEqual({
      target_character_id: 0,
      stance: 'gentle',
      image_priority: 'authenticity',
      risk_tolerance: 'moderate',
      intent_text: '',
    });
  });
});

describe('ui store', () => {
  beforeEach(() => {
    useUiStore.getState().setMessage(null);
  });

  it('stores transient status messages', () => {
    useUiStore.getState().setMessage('Round submitted');

    expect(useUiStore.getState().message).toBe('Round submitted');
  });
});
