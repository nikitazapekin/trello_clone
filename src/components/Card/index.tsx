import React from 'react';
import { CardContainer, CardTitle, CardDescription } from './styled';
import { Card as CardType } from '../../types';

interface CardProps {
  card: CardType;
  onClick: () => void;
  isDragging?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onClick, isDragging }) => {
  return (
    <CardContainer 
      onClick={onClick} 
      $isDragging={isDragging}
    >
      <CardTitle>{card.title}</CardTitle>
      {card.description && (
        <CardDescription>{card.description}</CardDescription>
      )}
    </CardContainer>
  );
};
