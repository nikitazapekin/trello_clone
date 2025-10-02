import styled from 'styled-components';

interface CardContainerProps {
  $isDragging?: boolean;
}

export const CardContainer = styled.div<CardContainerProps>`
  background-color: #ffffff;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-left: 4px solid #1890ff;
  transition: all 0.2s;
  margin-bottom: 8px;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  ${props => props.$isDragging && `
    transform: rotate(5deg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  `}
`;

export const CardTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const CardDescription = styled.p`
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardLabels = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
`;

export const CardLabel = styled.span<{ $color: string }>`
  background-color: ${props => props.$color};
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
`;

export const CardBadges = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const CardBadge = styled.span`
  background-color: #f5f5f5;
  color: #666;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const CardImagePreview = styled.div`
  margin: -12px -12px 8px -12px;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
  max-height: 100px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
