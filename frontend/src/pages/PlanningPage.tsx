import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { fetchCurrentSubmission, submitRoundPlan, updateRoundPlan } from '../api/services/submissions';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';
import { useRoundStore } from '../stores/roundStore';
import { useUiStore } from '../stores/uiStore';

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

  const save = async () => {
    try {
      if (hasExistingSubmission) {
        await updateRoundPlan(draft);
        setMessage('Round plan updated.');
      } else {
        await submitRoundPlan(draft);
        setHasExistingSubmission(true);
        setMessage('Round plan submitted.');
      }
    } catch {
      setMessage('Unable to save your round plan.');
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.52fr]">
      <Panel title="Plan Your Move">
        <div className="space-y-6">
          <p className="text-sm leading-7 text-[#6f4b5e]">
            Set the tone for this episode. Choose the person, posture, and level of risk you want
            your heroine to carry into the villa.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#4b1f39]">Target</span>
              <select
                className="w-full rounded-2xl border border-[#e9bfd0] bg-white px-4 py-3 text-[#4b1f39] shadow-sm outline-none transition focus:border-[#d97197]"
                value={draft.target_character_id}
                onChange={event => setField('target_character_id', Number(event.target.value))}
              >
                <option value={0}>Choose a love interest</option>
                {cast.map(character => (
                  <option key={character.id} value={character.id}>
                    {character.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#4b1f39]">Stance</span>
              <select
                className="w-full rounded-2xl border border-[#e9bfd0] bg-white px-4 py-3 text-[#4b1f39] shadow-sm outline-none transition focus:border-[#d97197]"
                value={draft.stance}
                onChange={event => setField('stance', event.target.value)}
              >
                <option value="gentle">Gentle</option>
                <option value="bold">Bold</option>
                <option value="flirty">Flirty</option>
                <option value="poised">Poised</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#4b1f39]">Image Priority</span>
              <select
                className="w-full rounded-2xl border border-[#e9bfd0] bg-white px-4 py-3 text-[#4b1f39] shadow-sm outline-none transition focus:border-[#d97197]"
                value={draft.image_priority}
                onChange={event => setField('image_priority', event.target.value)}
              >
                <option value="authenticity">Authenticity</option>
                <option value="glamour">Glamour</option>
                <option value="mystery">Mystery</option>
                <option value="chaos">Chaos</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#4b1f39]">Risk Tolerance</span>
              <select
                className="w-full rounded-2xl border border-[#e9bfd0] bg-white px-4 py-3 text-[#4b1f39] shadow-sm outline-none transition focus:border-[#d97197]"
                value={draft.risk_tolerance}
                onChange={event => setField('risk_tolerance', event.target.value)}
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#4b1f39]">Intent Text</span>
            <textarea
              className="min-h-40 w-full rounded-[1.5rem] border border-[#e9bfd0] bg-white px-4 py-4 leading-7 text-[#4b1f39] shadow-sm outline-none transition focus:border-[#d97197]"
              value={draft.intent_text ?? ''}
              onChange={event => setField('intent_text', event.target.value)}
              placeholder="Example: I want a private moment that feels sincere, but I do not want to look needy in front of the rest of the villa."
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              className="rounded-full bg-[#34182f] px-6 py-3 text-sm font-medium text-white shadow-[0_16px_30px_rgba(52,24,47,0.24)] transition hover:bg-[#49213f]"
              onClick={() => void save()}
            >
              {hasExistingSubmission ? 'Update Plan' : 'Submit Plan'}
            </button>
            {message ? <p className="text-sm text-[#6f4b5e]">{message}</p> : null}
          </div>
        </div>
      </Panel>
      <Panel title="Villa Read">
        <div className="space-y-4 text-sm leading-7 text-[#6f4b5e]">
          <div className="rounded-2xl bg-[#fff6f8] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#b56a86]">Current Direction</p>
            <p className="mt-2 text-base font-semibold text-[#4b1f39]">
              {draft.target_character_id
                ? cast.find(character => character.id === draft.target_character_id)?.name ?? 'Selected target'
                : 'No target chosen yet'}
            </p>
          </div>
          <div className="rounded-2xl bg-[#fff7ea] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#b58443]">Submission State</p>
            <p className="mt-2">
              {hasExistingSubmission
                ? 'A plan already exists for this round. Save again to refine it.'
                : 'No plan has been submitted for this round yet.'}
            </p>
          </div>
          <div className="rounded-2xl bg-[#f7edf5] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#8f6280]">Useful Prompting</p>
            <p className="mt-2">
              Be specific about the emotional outcome you want, not just the action. That gives the
              resolution more to work with than vague flirting.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
};
