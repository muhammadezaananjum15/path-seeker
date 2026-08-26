import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Textarea } from './Textarea';
import { useUIStore } from '../../stores/useUIStore';
import { useBookmarkStore } from '../../stores/useBookmarkStore';
import { FileText, Trash2, Check } from 'lucide-react';

export const NotesModal: React.FC = () => {
  const { isNotesModalOpen, notesModalCareerId, notesModalCareerTitle, closeNotesModal, addToast } =
    useUIStore();
  const { getCareerNote, saveCareerNote, deleteCareerNote } = useBookmarkStore();

  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (notesModalCareerId) {
      setNoteText(getCareerNote(notesModalCareerId));
    }
  }, [notesModalCareerId, getCareerNote]);

  if (!notesModalCareerId) return null;

  const handleSave = () => {
    saveCareerNote(notesModalCareerId, notesModalCareerTitle || 'Career Note', noteText);
    addToast({
      title: 'Career Note Saved',
      message: `Updated notes for ${notesModalCareerTitle || 'Career'}.`,
      type: 'success'
    });
    closeNotesModal();
  };

  const handleDelete = () => {
    deleteCareerNote(notesModalCareerId);
    setNoteText('');
    addToast({
      title: 'Note Removed',
      message: `Deleted personal note for ${notesModalCareerTitle}.`,
      type: 'info'
    });
    closeNotesModal();
  };

  return (
    <Modal
      isOpen={isNotesModalOpen}
      onClose={closeNotesModal}
      title="Personal Career Notes"
      subtitle={`Private passport scratchpad for ${notesModalCareerTitle}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        <Textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Jot down notes on required certifications, target salaries, interview preparation points, or networking leads..."
          rows={6}
          className="min-h-[140px]"
        />

        <div className="flex items-center justify-between pt-2">
          {noteText.trim() ? (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={handleDelete}
            >
              Delete Note
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={closeNotesModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Check className="w-3.5 h-3.5" />}
              onClick={handleSave}
            >
              Save Note
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
