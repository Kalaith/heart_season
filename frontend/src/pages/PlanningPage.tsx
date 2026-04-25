import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentSubmission, submitRoundPlan, updateRoundPlan } from '../api/services/submissions';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';
import { useRoundStore } from '../stores/roundStore';
import { useUiStore } from '../stores/uiStore';
import { getInitials, getMomentumLine, getPreferenceLine } from '../utils/gamePresentation';

const stanceOptions = [
  { value: 'gentle', label: 'Gentle', description: 'Warm, reassuring, and low-pressure.' },
  { value: 'bold', label: 'Bold', description: 'Confident, direct, and impossible to ignore.' },
  { value: 'flirty', label: 'Flirty', description: 'Playful, charged, and very visible.' },
  { value: 'poised', label: 'Poised', description: 'Controlled, elegant, and hard to read.' },
];

const priorityOptions = [
  { value: 'authenticity', label: 'Build chemistry', description: 'Let the moment feel real.' },
  { value: 'glamour', label: 'Protect image', description: 'Look polished doing it.' },
  { value: 'mystery', label: 'Keep them guessing', description: 'Stay hard to pin down.' },
  { value: 'chaos', label: 'Stir attention', description: 'Make the room react.' },
];

const riskOptions = [
  { value: 'low', label: 'Safe', description: 'Minimize fallout and play it clean.' },
  { value: 'moderate', label: 'Balanced', description: 'Push a little without blowing up the room.' },
  { value: 'high', label: 'Dangerous', description: 'Chase the moment and deal with the consequences.' },
];

const quickPlans = [
  {
    label: 'Play It Sweet',
    values: {
      stance: 'gentle',
      image_priority: 'authenticity',
      risk_tolerance: 'low',
      intent_text: 'I want a sincere moment that feels safe, warm, and emotionally honest.',
    },
  },
  {
    label: 'Stay Polished',
    values: {
      stance: 'poised',
      image_priority: 'glamour',
      risk_tolerance: 'moderate',
      intent_text:
        'I want to look composed and desirable without giving the villa much to use against me.',
    },
  },
  {
    label: 'Turn Heads',
    values: {
      stance: 'bold',
      image_priority: 'mystery',
      risk_tolerance: 'moderate',
      intent_text: 'I want a move that lands hard and leaves people wondering what I am really after.',
    },
  },
  {
    label: 'Cause Trouble',
    values: {
      stance: 'flirty',
      image_priority: 'chaos',
      risk_tolerance: 'high',
      intent_text: 'I want to create tension, attention, and a scene people will talk about after.',
    },
  },
];

export const PlanningPage: FC = () => {
  useBootstrapData();
  const cast = useGameStore(state => state.cast);
  const draft = useRoundStore(state => state.draft);
  const setField = useRoundStore(state => state.setField);
  const setMessage = useUiStore(state => state.setMessage);
  const message = useUiStore(state => state.message);
  const [hasExistingSubmission, setHasExistingSubmission] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const submission = await fetchCurrentSubmission();
        if (submission) {
          Object.entries(submission).forEach(([key, value]) => {
            setField(key as keyof typeof draft, value as never);
          });
          setHasExistingSubmission(true);
        }
      } catch {
        setMessage('Unable to load your current submission.');
      }
    };

    void load();
  }, [draft, setField, setMessage]);

  const selectedCharacter = cast.find(character => character.id === draft.target_character_id) ?? null;
  const nextStep = useMemo(() => {
    if (!draft.target_character_id) return 'Pick the person you want to move toward tonight.';
    if (!draft.stance) return 'Choose the emotional energy you want to bring.';
    if (!draft.image_priority) return 'Decide what matters most in public.';
    if (!draft.risk_tolerance) return 'Set how dangerous you want this to get.';
    return 'Write anything specific you want the episode to try to deliver.';
  }, [draft]);

  const save = async () => {
    try {
      if (hasExistingSubmission) {
        await updateRoundPlan(draft);
        setMessage("Tonight's direction has been updated.");
      } else {
        await submitRoundPlan(draft);
        setHasExistingSubmission(true);
        setMessage("Tonight's direction is locked in.");
      }
    } catch {
      setMessage('Unable to save your episode plan.');
    }
  };

  const applyQuickPlan = (preset: (typeof quickPlans)[number]): void => {
    setField('stance', preset.values.stance);
    setField('image_priority', preset.values.image_priority);
    setField('risk_tolerance', preset.values.risk_tolerance);
    setField('intent_text', preset.values.intent_text);
    setMessage(`${preset.label} loaded. You can still refine it.`);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.72fr]">
      <div className="space-y-4">
        <Panel title="Set Tonight's Direction" kicker="Guided Episode Planner">
          <div className="space-y-6">
            <div className="rounded-[1.6rem] bg-[linear-gradient(135deg,#fff7f4,#ffeef3)] px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b26182]">
                Next Best Step
              </p>
              <p className="mt-2 text-lg font-semibold text-[#431d33]">{nextStep}</p>
              <p className="mt-2 text-sm leading-7 text-[#6b4558]">
                Low-pressure option: start with a quick plan, then tweak anything you want.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b26182]">
                Quick Plan
              </p>
              <p className="mt-1 text-sm text-[#6b4558]">
                Good for players who want a fast, safe starting point.
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {quickPlans.map(preset => (
                  <button
                    key={preset.label}
                    className="rounded-[1.5rem] border border-[#f0d5de] bg-white px-4 py-4 text-left transition hover:border-[#d99ab2] hover:bg-[#fff7f9]"
                    onClick={() => applyQuickPlan(preset)}
                  >
                    <p className="text-base font-semibold text-[#431d33]">{preset.label}</p>
                    <p className="mt-2 text-sm leading-6 text-[#6b4558]">{preset.values.intent_text}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b26182]">
                  1. Who are you focusing on?
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {cast.length ? (
                    cast.map(character => {
                      const isSelected = draft.target_character_id === character.id;
                      return (
                        <button
                          key={character.id}
                          className={[
                            'rounded-[1.6rem] border p-4 text-left transition',
                            isSelected
                              ? 'border-[#3a1726] bg-[#3a1726] text-white shadow-[0_18px_35px_rgba(58,23,38,0.24)]'
                              : 'border-[#f0d5de] bg-white hover:border-[#d99ab2] hover:bg-[#fff7f9]',
                          ].join(' ')}
                          onClick={() => setField('target_character_id', character.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8d8e1] text-lg font-semibold text-[#6d3450]">
                              {getInitials(character.name)}
                            </div>
                            <div>
                              <p
                                className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${isSelected ? 'text-[#f5c5d5]' : 'text-[#b26182]'}`}
                              >
                                {character.archetype}
                              </p>
                              <h3 className="mt-1 text-xl font-semibold">{character.name}</h3>
                              <p
                                className={`mt-2 text-sm leading-7 ${isSelected ? 'text-[#f6dde6]' : 'text-[#6b4558]'}`}
                              >
                                {getMomentumLine(character)}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-[1.6rem] bg-[#fff7f9] p-5 text-sm leading-7 text-[#6b4558] md:col-span-2">
                      No cast available yet. Once the villa opens, the hearts worth chasing will show
                      up here.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b26182]">
                  2. What energy are you bringing?
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {stanceOptions.map(option => {
                    const isSelected = draft.stance === option.value;
                    return (
                      <button
                        key={option.value}
                        className={[
                          'rounded-[1.5rem] border px-4 py-4 text-left transition',
                          isSelected
                            ? 'border-[#8a365b] bg-[#fff0f4]'
                            : 'border-[#f0d5de] bg-white hover:bg-[#fff7f9]',
                        ].join(' ')}
                        onClick={() => setField('stance', option.value)}
                      >
                        <p className="text-base font-semibold text-[#431d33]">{option.label}</p>
                        <p className="mt-2 text-sm leading-7 text-[#6b4558]">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b26182]">
                  3. What matters most publicly?
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {priorityOptions.map(option => {
                    const isSelected = draft.image_priority === option.value;
                    return (
                      <button
                        key={option.value}
                        className={[
                          'rounded-[1.5rem] border px-4 py-4 text-left transition',
                          isSelected
                            ? 'border-[#8a365b] bg-[#fff0f4]'
                            : 'border-[#f0d5de] bg-white hover:bg-[#fff7f9]',
                        ].join(' ')}
                        onClick={() => setField('image_priority', option.value)}
                      >
                        <p className="text-base font-semibold text-[#431d33]">{option.label}</p>
                        <p className="mt-2 text-sm leading-7 text-[#6b4558]">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b26182]">
                  4. How risky do you want to be?
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {riskOptions.map(option => {
                    const isSelected = draft.risk_tolerance === option.value;
                    return (
                      <button
                        key={option.value}
                        className={[
                          'rounded-[1.5rem] border px-4 py-4 text-left transition',
                          isSelected
                            ? 'border-[#8a365b] bg-[#fff0f4]'
                            : 'border-[#f0d5de] bg-white hover:bg-[#fff7f9]',
                        ].join(' ')}
                        onClick={() => setField('risk_tolerance', option.value)}
                      >
                        <p className="text-base font-semibold text-[#431d33]">{option.label}</p>
                        <p className="mt-2 text-sm leading-7 text-[#6b4558]">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b26182]">
                  5. Anything specific you want tonight?
                </span>
                <textarea
                  className="mt-3 min-h-40 w-full rounded-[1.6rem] border border-[#f0d5de] bg-white px-4 py-4 text-sm leading-7 text-[#431d33] shadow-sm outline-none transition focus:border-[#d99ab2]"
                  value={draft.intent_text ?? ''}
                  onChange={event => setField('intent_text', event.target.value)}
                  placeholder="Example: I want a private moment that feels sincere, but I do not want to look needy in front of the villa."
                />
              </label>
            </div>
          </div>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title="Tonight's Read" kicker="Live Summary">
          <div className="space-y-4">
            <div className="rounded-[1.5rem] bg-[#fff5f8] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                Focus
              </p>
              <p className="mt-2 text-xl font-semibold text-[#431d33]">
                {selectedCharacter ? selectedCharacter.name : 'No heart chosen yet'}
              </p>
              <p className="mt-2 text-sm leading-7 text-[#6b4558]">
                {selectedCharacter
                  ? getPreferenceLine(selectedCharacter)
                  : 'Choose someone first and the episode will start to feel real.'}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[#fff8ed] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bc8b47]">
                Current Vibe
              </p>
              <p className="mt-2 text-base font-semibold text-[#53371d]">
                {(stanceOptions.find(option => option.value === draft.stance)?.label ?? 'Unchosen') +
                  ' / ' +
                  (riskOptions.find(option => option.value === draft.risk_tolerance)?.label ?? 'Unchosen')}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[#f7eef4] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9d6b88]">
                Submission State
              </p>
              <p className="mt-2 text-sm leading-7 text-[#65455a]">
                {hasExistingSubmission
                  ? 'You already have a plan in for this episode. Update it anytime before the lock.'
                  : 'Nothing is locked in yet. When this feels right, hit the button below.'}
              </p>
            </div>
            <button
              className="w-full rounded-full bg-[#361321] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(54,19,33,0.28)] transition hover:bg-[#4b1b2e]"
              onClick={() => void save()}
            >
              {hasExistingSubmission ? "Update Tonight's Direction" : "Lock In Tonight's Direction"}
            </button>
            <Link
              to="/cast"
              className="block text-center text-sm font-medium text-[#7a3555] underline decoration-[#d99ab2] underline-offset-4"
            >
              Need help choosing? Review the cast first.
            </Link>
            {message ? <p className="text-sm leading-7 text-[#6b4558]">{message}</p> : null}
          </div>
        </Panel>
      </div>
    </div>
  );
};
