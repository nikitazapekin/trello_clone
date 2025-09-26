import React, { useState, useEffect } from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FormGroup,
  Label,
  Input,
  TextArea,
  ButtonGroup,
  Button
} from './styled';
import { Card } from '../../types';

interface CardModalProps {
  card: Card | null;
  isOpen: boolean;
  onSave: (card: Omit<Card, 'id' | 'columnId'>) => void;
  onClose: () => void;
  mode: 'create' | 'edit';
  columnTitle?: string;
}

export const CardModal: React.FC<CardModalProps> = ({
  card,
  isOpen,
  onSave,
  onClose,
  mode,
  columnTitle
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [card, isOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim()
      });
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick} onKeyDown={handleKeyDown}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {mode === 'create' ? 'Создать карточку' : 'Редактировать карточку'}
            {columnTitle && ` в "${columnTitle}"`}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <FormGroup>
          <Label htmlFor="card-title">Название *</Label>
          <Input
            id="card-title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Введите название карточки"
            autoFocus
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="card-description">Описание</Label>
          <TextArea
            id="card-description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Введите описание карточки"
            rows={4}
          />
        </FormGroup>

        <ButtonGroup>
          <Button onClick={onClose} type="button">Отмена</Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={!title.trim()}
            type="button"
          >
            {mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};
