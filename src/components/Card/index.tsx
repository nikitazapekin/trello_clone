import React from 'react';
import { 
  CardContainer, 
  CardTitle, 
  CardDescription, 
  CardLabels,
  CardLabel,
  CardBadges,
  CardBadge,
  CardImagePreview
} from './styled';
import { Card as CardType } from '../../types';

interface CardProps {
  card: CardType;
  onClick: () => void;
  isDragging?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onClick, isDragging }) => {
  const completedChecklistItems = card.checklists.flatMap(checklist => 
    checklist.items.filter(item => item.completed)
  ).length;

  const totalChecklistItems = card.checklists.flatMap(checklist => 
    checklist.items
  ).length;

  return (
    <CardContainer 
      onClick={onClick} 
      $isDragging={isDragging}
    >
      {card.images.length > 0 && (
        <CardImagePreview>
          <img src={card.images[0].url} alt={card.images[0].name} />
        </CardImagePreview>
      )}
      
      {card.labels.length > 0 && (
        <CardLabels>
          {card.labels.map((label, index) => (
            <CardLabel key={index} $color={getLabelColor(label)}>
              {label}
            </CardLabel>
          ))}
        </CardLabels>
      )}
      
      <CardTitle>{card.title}</CardTitle>
      {card.description && (
        <CardDescription>{card.description}</CardDescription>
      )}
      
      <CardBadges>
        {card.images.length > 0 && (
          <CardBadge>📷 {card.images.length}</CardBadge>
        )}
        {totalChecklistItems > 0 && (
          <CardBadge>
            ✓ {completedChecklistItems}/{totalChecklistItems}
          </CardBadge>
        )}
      </CardBadges>
    </CardContainer>
  );
};

const getLabelColor = (label: string): string => {
  const colors: { [key: string]: string } = {
    'важно': '#ff4d4f',
    'срочно': '#faad14',
    'новое': '#52c41a',
    'исправлено': '#1890ff',
    'тест': '#722ed1'
  };
  return colors[label] || '#d9d9d9';
};
