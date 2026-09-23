import React, { useRef } from 'react';
import Button, { ButtonProps } from '@/shared/components/Button/Button.component';

export interface FilePickerButtonProps {
  title: string;
  accept?: string;
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
}

/**
 * Selector de archivo del navegador (input[type=file] nativo del DOM). Solo
 * funciona en web — pero las únicas pantallas que lo usan (ContentEditor, CMS
 * de preguntas/categorías) son de escritorio/web exclusivamente, así que no
 * necesita una variante nativa (ver MainTabs.web.tsx / MainTabs.tsx).
 */
const FilePickerButton: React.FC<FilePickerButtonProps> = ({
  title,
  accept,
  onFileSelected,
  disabled,
  variant = 'outlined',
  size = 'medium',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) onFileSelected(file);
  };

  return (
    <>
      <Button
        title={title}
        variant={variant}
        size={size}
        disabled={disabled}
        onPress={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default FilePickerButton;
