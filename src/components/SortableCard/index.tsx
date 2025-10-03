 
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@components/Card';
import type { Card as CardType } from '../../types';

interface SortableCardProps {
  card: CardType;
  onClick: () => void;
  isMultiSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (cardId: string) => void;
}

export const SortableCard: React.FC<SortableCardProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Card
        {...props}
        isDragging={isDragging}
      />
    </div>
  );
};
