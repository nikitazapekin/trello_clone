import React from 'react';
import { Card } from '@components/Card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Card as CardType } from '../../types';

interface SortableCardProps {
  card: CardType;
  onClick: () => void;
  isMultiSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (cardId: string) => void;
}

export const SortableCard: React.FC<SortableCardProps> = ({ 
  card, 
  onClick, 
  isMultiSelectMode = false,
  isSelected = false,
  onToggleSelection
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: card.id,
    data: {
      type: 'card',
      card,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card 
        card={card} 
        onClick={onClick} 
        isDragging={isDragging}
        isMultiSelectMode={isMultiSelectMode}
        isSelected={isSelected}
        onToggleSelection={onToggleSelection}
      />
    </div>
  );
};
