import { PRIORITY_META, PRIORITY_ORDER } from "../../models/idea";
import SegmentedControl from "../ui/SegmentedControl";

export default function PrioritySelector({ value, onChange, disabled }) {
  return (
    <SegmentedControl
      label="Prioridad"
      value={value}
      disabled={disabled}
      onChange={onChange}
      options={PRIORITY_ORDER.map((p) => ({ value: p, label: PRIORITY_META[p].label }))}
    />
  );
}
