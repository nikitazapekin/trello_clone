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
  onDragOver: (targetCardId: string) => void;
  onDrop: (draggedCardId: string, lastHoveredCardId: string) => void;
  onDropToEmpty: (draggedCardId: string, targetColumnId: string) => void;
  draggedCard: {id: string, columnId: string} | null;
  lastHoveredCardId: string | null;
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
  onDragOver,
  onDrop,
  onDropToEmpty,
  draggedCard,
  lastHoveredCardId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
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
      onDragOver(card.id);
    }
  };

  const handleCardDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
    }
  };

  const handleCardDrop = (e: React.DragEvent, card: CardType) => {
    e.preventDefault();
    
    const draggedCardData = e.dataTransfer.getData('application/json');
    if (draggedCardData) {
      try {
        const { cardId: draggedCardId } = JSON.parse(draggedCardData);
        if (draggedCardId && draggedCardId !== card.id) {
          onDrop(draggedCardId, card.id);
        }
      } catch (error) {
        console.error('Error parsing drag data:', error);
      }
    }
  };

  const handleEmptyZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsColumnDragOver(true);
  };

  const handleEmptyZoneDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
      setIsColumnDragOver(false);
    }
  };

  const handleEmptyZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsColumnDragOver(false);
    
    const draggedCardData = e.dataTransfer.getData('application/json');
    if (draggedCardData) {
      try {
        const { cardId: draggedCardId } = JSON.parse(draggedCardData);
        if (draggedCardId) {
          onDropToEmpty(draggedCardId, column.id);
        }
      } catch (error) {
        console.error('Error parsing drag data:', error);
      }
    }
  };

  const handleCardDragEnd = (e: React.DragEvent) => {
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
                opacity: draggedCard?.id === card.id ? 0.5 : 1,
                transform: lastHoveredCardId === card.id ? 'scale(1.02)' : 'none',
                border: lastHoveredCardId === card.id ? '2px dashed #007bff' : 'none',
                borderRadius: '8px',
                marginBottom: '8px',
                transition: 'all 0.2s ease',
                cursor: 'grab',
                position: 'relative'
              }}
            >
              {lastHoveredCardId === card.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: '#007bff',
                    borderRadius: '2px',
                    zIndex: 10
                  }}
                />
              )}
              <Card 
                card={card} 
                onClick={() => onCardClick(card)}
                isMultiSelectMode={isMultiSelectMode}
                isSelected={selectedCards.has(card.id)}
                onToggleSelection={onToggleCardSelection}
              />
              <div style={{ 
                fontSize: '10px', 
                color: '#666', 
                marginTop: '4px',
                padding: '2px',
                backgroundColor: '#f5f5f5',
                borderRadius: '3px'
              }}>
                ID: {card.id}
                {lastHoveredCardId === card.id && ' ← НАВЕДЕНА'}
              </div>
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
