import { Board } from "@components/Board";
import { GlobalStyle, PageWrapper, Reset, WrapperContainer } from "@styles";

const WeatherPage = () => {
  return (
    <PageWrapper>
      <WrapperContainer>
        <GlobalStyle />
        <Reset />
        <Board />
      </WrapperContainer>
    </PageWrapper>
  );
};

export default WeatherPage;
