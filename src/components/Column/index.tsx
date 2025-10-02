import React, { useState, useRef } from 'react';
import type { Card as CardType, Column as ColumnType } from '../../types';
import { Card } from '../Card';
import {
  AddCardButton,
  CardsContainer,
  ColumnContainer,
  ColumnHeader,
  ColumnTitle,
  ColumnTitleInput,
  DeleteColumnButton,
  EmptyColumnDropZone
} from './styled';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onAddCard: (columnId: string) => void;
  onUpdateColumnTitle: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onCardClick: (card: CardType) => void;
  isActive?: boolean;
  isMultiSelectMode?: boolean;
  selectedCards?: Set<string>;
  onToggleCardSelection?: (cardId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  cards,
  onAddCard,
  onUpdateColumnTitle,
  onDeleteColumn,
  onCardClick,
  isActive = false,
  isMultiSelectMode = false,
  selectedCards = new Set(),
  onToggleCardSelection
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleSubmit = () => {
    if (title.trim()) {
      onUpdateColumnTitle(column.id, title.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  // Обработчики для карточек
  const handleCardDragStart = (e: React.DragEvent, card: CardType) => {
    e.dataTransfer.setData('cardId', card.id);
    e.dataTransfer.setData('sourceColumnId', card.columnId);
    e.dataTransfer.effectAllowed = 'move';
    
    setDraggedCardId(card.id);
    
    // Добавляем визуальную обратную связь безопасно
    const element = e.currentTarget as HTMLElement;
    element.style.opacity = '0.4';
  };

  const handleCardDragEnd = (e: React.DragEvent) => {
    // Восстанавливаем прозрачность безопасно
    const element = e.currentTarget as HTMLElement;
    element.style.opacity = '1';
    setDragOverCardId(null);
    setDraggedCardId(null);
  };

  const handleCardDragOver = (e: React.DragEvent, card: CardType) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Не подсвечиваем карточку, если перетаскиваем её саму
    if (card.id !== draggedCardId) {
      setDragOverCardId(card.id);
    }
  };

  const handleCardDragLeave = (e: React.DragEvent) => {
    // Проверяем, что курсор действительно покинул элемент
    const relatedTarget = e.relatedTarget as Node;
    const currentTarget = e.currentTarget as Node;
    
    if (!currentTarget.contains(relatedTarget)) {
      setDragOverCardId(null);
    }
  };

  const handleCardDrop = (e: React.DragEvent, targetCard: CardType) => {
    e.preventDefault();
    setDragOverCardId(null);
    
    const draggedCardId = e.dataTransfer.getData('cardId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    
    if (draggedCardId && sourceColumnId && draggedCardId !== targetCard.id) {
      // Находим индекс целевой карточки
      const targetIndex = cards.findIndex(card => card.id === targetCard.id);
      
      const event = new CustomEvent('cardMove', {
        detail: {
          cardId: draggedCardId,
          fromColumnId: sourceColumnId,
          toColumnId: column.id,
          targetIndex: targetIndex // Вставляем на место целевой карточки
        }
      });
      window.dispatchEvent(event);
    }
  };

  const isEmpty = cards.length === 0;

  return (
    <ColumnContainer $isActive={isActive}>
      <ColumnHeader>
        {isEditing ? (
          <ColumnTitleInput
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleSubmit}
            onKeyDown={handleKeyPress}
            autoFocus
          />
        ) : (
          <>
            <ColumnTitle onDoubleClick={() => setIsEditing(true)}>
              {column.title} ({cards.length})
            </ColumnTitle>
            <DeleteColumnButton onClick={() => onDeleteColumn(column.id)}>
              ×
            </DeleteColumnButton>
          </>
        )}
      </ColumnHeader>

      <CardsContainer>
        {isEmpty ? (
          <EmptyColumnDropZone $isOver={false}>
            Перетащите карточку сюда
          </EmptyColumnDropZone>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              draggable
              onDragStart={(e) => handleCardDragStart(e, card)}
              onDragEnd={handleCardDragEnd}
              onDragOver={(e) => handleCardDragOver(e, card)}
              onDragLeave={handleCardDragLeave}
              onDrop={(e) => handleCardDrop(e, card)}
              style={{
                opacity: draggedCardId === card.id ? 0.4 : 
                        dragOverCardId === card.id ? 0.7 : 1,
                transform: dragOverCardId === card.id ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease',
                border: dragOverCardId === card.id ? '2px dashed #007bff' : '2px solid transparent',
                borderRadius: '8px',
                padding: dragOverCardId === card.id ? '2px' : '0',
                cursor: 'grab'
              }}
            >
              <Card 
                card={card} 
                onClick={() => onCardClick(card)}
                isMultiSelectMode={isMultiSelectMode}
                isSelected={selectedCards.has(card.id)}
                onToggleSelection={onToggleCardSelection}
              />
            </div>
          ))
        )}
      </CardsContainer>

      <AddCardButton onClick={() => onAddCard(column.id)}>
        + Добавить карточку
      </AddCardButton>
    </ColumnContainer>
  );
};
