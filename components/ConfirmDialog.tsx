'use client';

import { AlertTriangle, CheckCircle2, Info, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

export default function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'warning',
}: ConfirmDialogProps) {
  const icons = {
    danger: <Trash2 className="w-5 h-5 text-owe" aria-hidden />,
    warning: <AlertTriangle className="w-5 h-5 text-owe" aria-hidden />,
    info: <Info className="w-5 h-5 text-ink-2" aria-hidden />,
    success: <CheckCircle2 className="w-5 h-5 text-paid" aria-hidden />,
  };

  const actionClass = {
    danger: 'bg-owe text-on-mine hover:opacity-90',
    warning: 'bg-owe text-on-mine hover:opacity-90',
    info: 'bg-mine text-on-mine hover:opacity-90',
    success: 'bg-paid text-on-mine hover:opacity-90',
  };

  return (
    <AlertDialog open onOpenChange={(open) => { if (!open) onCancel(); }}>
      <AlertDialogContent className="bg-panel text-ink rounded-[20px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-head font-semibold">
            {icons[type]}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-body text-ink-2 leading-relaxed">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} className="min-h-11 rounded-ctl">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`min-h-11 rounded-ctl font-semibold ${actionClass[type]}`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
