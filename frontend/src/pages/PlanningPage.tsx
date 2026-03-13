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
  const cast = useGameStore((state) => state.cast);
  const draft = useRoundStore((state) => state.draft);
  const setField = useRoundStore((state) => state.setField);
  const setMessage = useUiStore((state) => state.setMessage);
  const message = useUiStore((state) => state.message);
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
    <Panel title="Plan Your Move">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">Target</span>
          <select className="w-full rounded-xl border border-[#e9bfd0] px-3 py-2" value={draft.target_character_id} onChange={(event) => setField('target_character_id', Number(event.target.value))}>
            <option value={0}>Choose a love interest</option>
            {cast.map((character) => (
              <option key={character.id} value={character.id}>{character.name}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">Stance</span>
          <select className="w-full rounded-xl border border-[#e9bfd0] px-3 py-2" value={draft.stance} onChange={(event) => setField('stance', event.target.value)}>
            <option value="gentle">Gentle</option>
            <option value="bold">Bold</option>
            <option value="flirty">Flirty</option>
            <option value="poised">Poised</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">Image Priority</span>
          <select className="w-full rounded-xl border border-[#e9bfd0] px-3 py-2" value={draft.image_priority} onChange={(event) => setField('image_priority', event.target.value)}>
            <option value="authenticity">Authenticity</option>
            <option value="glamour">Glamour</option>
            <option value="mystery">Mystery</option>
            <option value="chaos">Chaos</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium">Risk Tolerance</span>
          <select className="w-full rounded-xl border border-[#e9bfd0] px-3 py-2" value={draft.risk_tolerance} onChange={(event) => setField('risk_tolerance', event.target.value)}>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium">Intent Text</span>
        <textarea className="min-h-32 w-full rounded-2xl border border-[#e9bfd0] px-3 py-3" value={draft.intent_text ?? ''} onChange={(event) => setField('intent_text', event.target.value)} />
      </label>
      <button className="mt-4 rounded-full bg-[#34182f] px-5 py-3 text-white" onClick={() => void save()}>
        {hasExistingSubmission ? 'Update Plan' : 'Submit Plan'}
      </button>
      {message ? <p className="mt-3 text-sm">{message}</p> : null}
    </Panel>
  );
};
