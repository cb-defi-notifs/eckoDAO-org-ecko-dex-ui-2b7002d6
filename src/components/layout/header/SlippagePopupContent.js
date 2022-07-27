/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components/macro';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { useApplicationContext, usePactContext } from '../../../contexts';
import Input from '../../../components/shared/Input';
import Label from '../../shared/Label';
import { CogIcon } from '../../../assets';
import { FlexContainer } from '../../shared/FlexContainer';
import Toggle from '../../liquidity/Toggle';
import { GAS_OPTIONS, PATH_CONFIGURATION } from '../../../constants/gasConfiguration';
import { useLocation } from 'react-router-dom';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  position: relative;
  align-items: center;
  z-index: 2;
  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
  ${({ resolutionConfiguration }) => {
    if (resolutionConfiguration && resolutionConfiguration['normal-mode'].scale < 1) {
      const zoomScaleDiff = 1 - resolutionConfiguration['normal-mode'].scale;
      return css`
        zoom: calc(1 + ${zoomScaleDiff});
      `;
    }
  }};
`;
const PopupContainer = styled(FlexContainer)`
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  position: absolute;

  right: 28px;
  top: -20px;
  &.header-item {
    top: 40px;
    right: 0px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  background: transparent;
`;

const SlippageTolleranceValue = styled.div`
  border-radius: 16px;
  border: ${({ theme: { colors } }) => `1px solid ${colors.white}`};
  color: ${({ isSelected, theme: { colors } }) => (isSelected ? colors.primary : colors.white)};
  font-family: ${({ isSelected, theme: { fontFamily } }) => (isSelected ? fontFamily.syncopate : fontFamily.basier)};
  font-size: 14px;
  padding: 6.5px 8.5px;
  min-width: 62px;
  min-height: 32px;
  display: flex;
  justify-content: center;
  background-color: ${({ isSelected, theme: { colors } }) => isSelected && colors.white};
  cursor: pointer;
`;
const GasButton = styled.div`
  border-radius: 16px;
  border: ${({ theme: { colors } }) => `1px solid ${colors.white}`};
  color: ${({ isSelected, theme: { colors } }) => (isSelected ? colors.primary : colors.white)};
  font-size: 14px;
  padding: 6.5px 8.5px;
  min-width: 62px;
  min-height: 32px;
  display: flex;
  justify-content: center;
  background-color: ${({ isSelected, theme: { colors } }) => isSelected && colors.white};
  cursor: pointer;
`;

const ContainerInputTypeNumber = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
  justify-content: center;
  padding: 0px 8.5px;
  border-radius: 16px;
  border: ${({ theme: { colors } }) => `1px solid ${colors.info}`};
  color: ${({ theme: { colors } }) => colors.white};
  min-width: 62px;
  .ui.input > input {
    border: unset;
    padding: 0px;
    text-align: right;
    font-size: 14px;
    margin: 0px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;

  .restrictedInput {
    @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
      .ui.fluid.input > input {
        width: 30px !important;
      }
    }
  }
`;

const SlippagePopupContent = ({ className }) => {
  const pact = usePactContext();
  const { resolutionConfiguration } = useApplicationContext();
  const [showSplippageContent, setShowSlippageContent] = useState(false);
  const [currentSection, setCurrentSection] = useState('SWAP');
  const { pathname } = useLocation();

  const ref = useRef();
  useOnClickOutside(ref, () => setShowSlippageContent(false));

  const [slp, setSlp] = useState(pact.slippage * 100);
  const [tl, setTl] = useState(pact.ttl / 60);
  useEffect(() => {
    if (slp) (async () => pact.storeSlippage(slp / 100))();
  }, [slp]);
  useEffect(() => {
    if (tl) (async () => pact.storeTtl(tl * 60))();
  }, [tl]);

  useEffect(() => {
    const section = Object.values(PATH_CONFIGURATION).find((path) => path.route === pathname).name;
    setCurrentSection(section);
    if (pact.enableGasStation) pact.setGasConfiguration(GAS_OPTIONS.DEFAULT[section]);
    else pact.setGasConfiguration(GAS_OPTIONS.NORMAL[section]);
  }, [pact.enableGasStation, pathname]);

  return (
    <Wrapper ref={ref} resolutionConfiguration={resolutionConfiguration}>
      <CogIcon onClick={() => setShowSlippageContent((prev) => !prev)} style={{ cursor: 'pointer' }} />
      {showSplippageContent && (
        <PopupContainer outOfGameEdition withGradient className={`background-fill ${className}`} style={{ width: 'unset', zIndex: 1 }}>
          <Container>
            <Label outGameEditionView fontSize={13} fontFamily="syncopate">
              Transactions Settings
            </Label>

            <Label outGameEditionView fontSize={13} labelStyle={{ marginTop: 16 }}>
              Slippage Tolerance
            </Label>

            <Row style={{ marginTop: 8 }}>
              <SlippageTolleranceValue isSelected={Number(slp) === 0.1} onClick={() => setSlp(0.1)}>
                0.1%
              </SlippageTolleranceValue>
              <SlippageTolleranceValue isSelected={Number(slp) === 0.5} style={{ marginLeft: 4, marginRight: 4 }} onClick={() => setSlp(0.5)}>
                0.5%
              </SlippageTolleranceValue>
              <SlippageTolleranceValue isSelected={Number(slp) === 1} style={{ marginRight: 8 }} onClick={() => setSlp(1)}>
                1%
              </SlippageTolleranceValue>

              <ContainerInputTypeNumber className="restrictedInput">
                <Input
                  noInputBackground
                  outGameEditionView
                  containerStyle={{
                    border: 'none ',
                    boxShadow: 'none !important',
                    padding: '0px',
                    margin: 0,
                  }}
                  placeholder={`${slp}`}
                  numberOnly
                  value={slp}
                  onChange={(e, { value }) => {
                    if (value >= 0 && value <= 100) {
                      setSlp(value);
                    }
                  }}
                />
                %
              </ContainerInputTypeNumber>
            </Row>

            <Label fontSize={13} outGameEditionView labelStyle={{ marginTop: 16 }}>
              Transaction Deadline
            </Label>
            <Row style={{ marginTop: 8 }}>
              <ContainerInputTypeNumber>
                <Input
                  outGameEditionView
                  noInputBackground
                  containerStyle={{
                    border: 'none',
                    boxShadow: 'none !important',
                    padding: '0px',
                  }}
                  placeholder={`${tl}`}
                  numberOnly
                  value={tl}
                  onChange={(e, { value }) => {
                    if (value >= 0 && value <= 60) {
                      setTl(value);
                    }
                  }}
                />
              </ContainerInputTypeNumber>
              <Label fontSize={13} outGameEditionView labelStyle={{ marginLeft: 8 }}>
                minutes
              </Label>
            </Row>
            <Label fontSize={13} outGameEditionView labelStyle={{ marginTop: 16 }}>
              Enable Gas Station
            </Label>
            <Row style={{ marginTop: 8 }}>
              <Toggle initialState={pact.enableGasStation} onClick={pact.setEnableGasStation} />
            </Row>
            {!pact.enableGasStation ? (
              <>
                <Label fontSize={13} outGameEditionView labelStyle={{ marginTop: 16 }}>
                  Gas Configuration
                </Label>
                <Row style={{ marginTop: 8 }}>
                  <ContainerInputTypeNumber style={{ minWidth: '90px' }}>
                    <Input
                      outGameEditionView
                      noInputBackground
                      containerStyle={{
                        border: 'none',
                        boxShadow: 'none !important',
                        padding: '0px',
                      }}
                      placeholder={`${pact.gasConfiguration?.gasLimit}`}
                      numberOnly
                      value={pact.gasConfiguration?.gasLimit}
                      onChange={(e, { value }) => pact.handleGasConfiguration('gasLimit', Number(value))}
                    />
                  </ContainerInputTypeNumber>
                  <Label fontSize={13} outGameEditionView labelStyle={{ marginLeft: 8 }}>
                    Gas Limit
                  </Label>
                </Row>
                <Row style={{ marginTop: 8 }}>
                  <ContainerInputTypeNumber style={{ minWidth: '90px' }}>
                    <Input
                      outGameEditionView
                      noInputBackground
                      containerStyle={{
                        border: 'none',
                        boxShadow: 'none !important',
                        padding: '0px',
                      }}
                      placeholder={`${pact.gasConfiguration?.gasPrice}`}
                      numberOnly
                      value={pact.gasConfiguration?.gasPrice}
                      onChange={(e, { value }) => pact.handleGasConfiguration('gasPrice', Number(value))}
                    />
                  </ContainerInputTypeNumber>
                  <Label fontSize={13} outGameEditionView labelStyle={{ marginLeft: 8 }}>
                    Gas Price
                  </Label>
                </Row>
                <Row className="w-100 justify-sb" style={{ marginTop: 16 }}>
                  <GasButton
                    isSelected={pact.gasConfiguration?.gasPrice === GAS_OPTIONS.ECONOMY[currentSection].gasPrice}
                    onClick={() => pact.setGasConfiguration(GAS_OPTIONS.ECONOMY[currentSection])}
                  >
                    Economy
                  </GasButton>
                  <GasButton
                    isSelected={pact.gasConfiguration?.gasPrice === GAS_OPTIONS.NORMAL[currentSection].gasPrice}
                    style={{ marginLeft: 4, marginRight: 4 }}
                    onClick={() => pact.setGasConfiguration(GAS_OPTIONS.NORMAL[currentSection])}
                  >
                    Normal
                  </GasButton>
                  <GasButton
                    isSelected={pact.gasConfiguration?.gasPrice === GAS_OPTIONS.FAST[currentSection].gasPrice}
                    style={{ marginRight: 8 }}
                    onClick={() => pact.setGasConfiguration(GAS_OPTIONS.FAST[currentSection])}
                  >
                    Fast
                  </GasButton>
                </Row>
              </>
            ) : null}
          </Container>
        </PopupContainer>
      )}
    </Wrapper>
  );
};

export default SlippagePopupContent;
