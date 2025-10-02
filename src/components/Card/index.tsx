import React from 'react';
import { CardContainer, CardTitle, CardDescription, CardHistory, CardBadges } from './styled';
import { Card as CardType } from '../../types';

interface CardProps {
  card: CardType;
  onClick: () => void;
  isDragging?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onClick, isDragging }) => {
  const totalChecklistItems = card.checklists?.reduce((sum, checklist) => sum + checklist.items.length, 0) || 0;
  const completedChecklistItems = card.checklists?.reduce((sum, checklist) => 
    sum + checklist.items.filter(item => item.completed).length, 0
  ) || 0;

  const hasAttachments = card.images && card.images.length > 0;
  const hasLabels = card.labels && card.labels.length > 0;
  const hasChecklists = card.checklists && card.checklists.length > 0;
  const hasLists = card.lists && card.lists.length > 0;

  return (
    <CardContainer 
      onClick={onClick} 
      $isDragging={isDragging}
    >
      {hasLabels && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
          {card.labels.slice(0, 3).map(label => (
            <div
              key={label.id}
              style={{
                backgroundColor: label.color,
                height: '8px',
                borderRadius: '4px',
                flex: '1 0 auto',
                minWidth: '40px'
              }}
              title={label.text}
            />
          ))}
          {card.labels.length > 3 && (
            <div style={{ 
              fontSize: '10px', 
              color: '#666',
              alignSelf: 'center'
            }}>
              +{card.labels.length - 3}
            </div>
          )}
        </div>
      )}
      
      <CardTitle>{card.title}</CardTitle>
      
      <CardBadges>
        {hasAttachments && (
          <span className="badge">📎 {card.images.length}</span>
        )}
        {hasChecklists && totalChecklistItems > 0 && (
          <span className="badge">
            ✓ {completedChecklistItems}/{totalChecklistItems}
          </span>
        )}
        {hasLists && (
          <span className="badge">📝 {card.lists.length}</span>
        )}
      </CardBadges>

      {card.description && (
        <CardDescription>{card.description}</CardDescription>
      )}
      
      <CardHistory>
        История
      </CardHistory>
    </CardContainer>
  );
};
