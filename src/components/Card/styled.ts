import styled from 'styled-components';

interface CardContainerProps {
  $isDragging?: boolean; // Используем $ для transient props (styled-components v6+)
}


export const CardBadges = styled.div`


`
export const CardContainer = styled.div<CardContainerProps>`
  background-color: #ffffff;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-left: 4px solid #1890ff;
  transition: all 0.2s;
 

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
`;

export const CardTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;


export const CardHistory = styled.h4`
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
