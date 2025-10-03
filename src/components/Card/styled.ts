import styled from 'styled-components';

interface CardContainerProps {
  $isDragging?: boolean;
  $isSelected?: boolean;
  $isMultiSelectMode?: boolean;
}

export const CardContainer = styled.div<CardContainerProps>`
  background-color: #ffffff;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: grab;
  border-left: 4px solid #1890ff;
  transition: all 0.2s;
  margin-bottom: 8px;
  position: relative;
  touch-action: none; 
  user-select: none; 


   @media screen and (max-width: 1240px) {
 
  width: 100%;
 
  }
 

  &:active {
    cursor: grabbing;
    transform: rotate(3deg);
  }

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  ${props => props.$isDragging && `
    transform: rotate(5deg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    opacity: 0.8;
  `}

  ${props => props.$isSelected && `
    background-color: #f0f8ff;
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  `}

  ${props => props.$isMultiSelectMode && `
    padding-left: 36px;
  `}
 
  @media (max-width: 768px) {
    padding: 10px;
    min-height: 60px;
    
    ${props => props.$isMultiSelectMode && `
      padding-left: 32px;
    `}
  }
`;

export const CardCheckbox = styled.input`
  position: absolute;
  left: 8px;
  top: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  z-index: 2;
 
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    left: 6px;
    top: 6px;
  }
`;

export const CardTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 6px;
  }
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

  @media (max-width: 768px) {
    font-size: 11px;
    -webkit-line-clamp: 1;
  }
`;

export const CardLabels = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    margin-bottom: 6px;
  }
`;

export const CardLabel = styled.span<{ $color: string }>`
  background-color: ${props => props.$color};
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 9px;
    padding: 1px 4px;
  }
`;

export const CardBadges = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;

  @media (max-width: 768px) {
    gap: 6px;
    margin-top: 6px;
  }
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

  @media (max-width: 768px) {
    font-size: 9px;
    padding: 1px 4px;
  }
`;

export const CardImagePreview = styled.div`
  margin: -12px -12px 8px -12px;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
  max-height: 100px;
  max-width: 200px;
margin: 0 auto;
margin-bottom: 10px;
    @media screen and (max-width: 1240px) {
 max-width: 100%;
  width: 100%;
 
  }
 

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    margin: -10px -10px 6px -10px;
    max-height: 80px;
  }
`;
