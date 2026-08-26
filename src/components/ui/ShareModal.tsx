import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { useUIStore } from '../../stores/useUIStore';
import { Copy, Check, Mail, ExternalLink } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { isShareModalOpen, shareModalData, closeShareModal, addToast } = useUIStore();
  const [copied, setCopied] = useState(false);

  if (!shareModalData) return null;

  const url = shareModalData.url.startsWith('http')
    ? shareModalData.url
    : `${window.location.origin}${shareModalData.url}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast({
      title: 'Link Copied to Clipboard',
      message: 'Share this career path with your peers or mentors.',
      type: 'success'
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isShareModalOpen}
      onClose={closeShareModal}
      title="Share Career Pathway"
      subtitle={shareModalData.title}
      maxWidth="sm"
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs text-[#8B85A8] uppercase tracking-wide font-medium">
            Direct Link
          </label>
          <div className="flex gap-2">
            <Input value={url} readOnly className="text-xs" />
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <label className="text-xs text-[#8B85A8] uppercase tracking-wide font-medium block mb-2.5">
            Share Directly
          </label>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#07031A] border border-[#6755C2]/20 text-[#8B85A8] hover:text-[#F4F2FA] hover:border-[#6755C2] text-xs transition-all"
            >
              <ExternalLink className="w-4 h-4 text-[#6755C2]" />
              <span>LinkedIn</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Exploring ${shareModalData.title} on PathSeeker:`
              )}&url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#07031A] border border-[#6755C2]/20 text-[#8B85A8] hover:text-[#F4F2FA] hover:border-[#6755C2] text-xs transition-all"
            >
              <ExternalLink className="w-4 h-4 text-[#6755C2]" />
              <span>Twitter / X</span>
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(
                shareModalData.title
              )}&body=${encodeURIComponent(`Check out this career path on PathSeeker: ${url}`)}`}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#07031A] border border-[#6755C2]/20 text-[#8B85A8] hover:text-[#F4F2FA] hover:border-[#6755C2] text-xs transition-all"
            >
              <Mail className="w-4 h-4 text-[#6755C2]" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
