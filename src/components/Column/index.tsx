// Column.tsx
import React, { useState } from 'react';
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
  onDragStart: (cardId: string, columnId: string) => void;
  onDragEnd: () => void;
  onDrop: (targetCardId: string, targetColumnId: string) => void;
  onDropToEmpty: (targetColumnId: string) => void;
  draggedCard: {id: string, columnId: string} | null;
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
  onToggleCardSelection,
  onDragStart,
  onDragEnd,
  onDrop,
  onDropToEmpty,
  draggedCard
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  const [isColumnDragOver, setIsColumnDragOver] = useState(false);

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

  // Обработчики перетаскивания для карточек
  const handleCardDragStart = (e: React.DragEvent, card: CardType) => {
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.setData('application/json', JSON.stringify({
      cardId: card.id,
      columnId: column.id
    }));
    onDragStart(card.id, column.id);
  };

  const handleCardDragOver = (e: React.DragEvent, card: CardType) => {
    e.preventDefault();
    if (draggedCard && draggedCard.id !== card.id) {
      setDragOverCardId(card.id);
    }
  };

  const handleCardDragLeave = (e: React.DragEvent) => {
    setDragOverCardId(null);
  };

  const handleCardDrop = (e: React.DragEvent, card: CardType) => {
    e.preventDefault();
    setDragOverCardId(null);
    
    const draggedCardData = e.dataTransfer.getData('application/json');
    if (draggedCardData) {
      try {
        const { cardId: draggedCardId } = JSON.parse(draggedCardData);
        if (draggedCardId && draggedCardId !== card.id) {
          onDrop(card.id, column.id);
        }
      } catch (error) {
        console.error('Error parsing drag data:', error);
      }
    }
  };

  // Обработчики для пустой зоны колонки
  const handleEmptyZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsColumnDragOver(true);
  };

  const handleEmptyZoneDragLeave = (e: React.DragEvent) => {
    setIsColumnDragOver(false);
  };

  const handleEmptyZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsColumnDragOver(false);
    
    const draggedCardData = e.dataTransfer.getData('application/json');
    if (draggedCardData) {
      try {
        const { cardId: draggedCardId } = JSON.parse(draggedCardData);
        if (draggedCardId) {
          onDropToEmpty(column.id);
        }
      } catch (error) {
        console.error('Error parsing drag data:', error);
      }
    }
  };

  const handleCardDragEnd = (e: React.DragEvent) => {
    setDragOverCardId(null);
    setIsColumnDragOver(false);
    onDragEnd();
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
          <EmptyColumnDropZone 
            $isOver={isColumnDragOver}
            onDragOver={handleEmptyZoneDragOver}
            onDragLeave={handleEmptyZoneDragLeave}
            onDrop={handleEmptyZoneDrop}
          >
            {isColumnDragOver ? 'Отпустите чтобы переместить' : 'Перетащите карточку сюда'}
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
                // Убрана прозрачность для перетаскиваемой карточки
                transform: dragOverCardId === card.id ? 'translateY(2px)' : 'none',
                border: dragOverCardId === card.id ? '2px dashed #007bff' : 'none',
                borderRadius: '8px',
                marginBottom: '8px',
                transition: 'all 0.2s ease',
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
