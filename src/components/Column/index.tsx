 
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Card as CardType, Column as ColumnType } from '../../types';
import { SortableCard } from '../SortableCard';
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
  onToggleCardSelection,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
 
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

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

      <CardsContainer ref={setNodeRef}>
        {isEmpty ? (
          <EmptyColumnDropZone $isOver={isOver}>
            {isOver ? 'Отпустите чтобы переместить' : 'Перетащите карточку сюда'}
          </EmptyColumnDropZone>
        ) : (
          <SortableContext items={cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
            {cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                onClick={() => onCardClick(card)}
                isMultiSelectMode={isMultiSelectMode}
                isSelected={selectedCards.has(card.id)}
                onToggleSelection={onToggleCardSelection}
              />
            ))}
          </SortableContext>
        )}
      </CardsContainer>

      <AddCardButton onClick={() => onAddCard(column.id)}>
        + Добавить карточку
      </AddCardButton>
    </ColumnContainer>
  );
};
