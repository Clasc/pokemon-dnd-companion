export default function EditButtons({
  handleCancel,
  handleSave,
}: {
  handleSave: () => void;
  handleCancel: () => void;
}) {
  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={handleSave}
        className="flex-1 btn-primary btn-responsive rounded-2xl font-semibold"
      >
        ✅ Save
      </button>
      <button
        onClick={handleCancel}
        className="flex-1 btn-secondary btn-responsive rounded-2xl font-semibold"
      >
        ❌ Cancel
      </button>
    </div>
  );
}
