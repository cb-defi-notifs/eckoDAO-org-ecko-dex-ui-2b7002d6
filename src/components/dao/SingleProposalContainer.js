/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Pact from 'pact-lang-api';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { hasAccountVoted, readSingleProposal, vote, voteCommandToSign, votePreview } from '../../api/dao';
import { useAccountContext, useApplicationContext, useKaddexWalletContext, useNotificationContext } from '../../contexts';
import { STATUSES } from '../../contexts/NotificationContext';
import { NETWORK_TYPE } from '../../constants/contextConstants';
import { ROUTE_DAO } from '../../router/routes';
import { PartialScrollableScrollSection } from '../layout/Containers';
import { FlexContainer } from '../shared/FlexContainer';
import Label from '../shared/Label';
import VotingPowerContainer from './VotingPowerContainer';
import { ArrowBack } from '../../assets';
import VoteResultsContainer from './VoteResultsContainer';
import AppLoader from '../shared/AppLoader';
import { commonColors, theme } from '../../styles/theme';
import { getStatusProposal } from '../../utils/dao-utils';
import Loader from '../shared/Loader';

const SingleProposalContainer = ({ proposal_id, accountData }) => {
  const { themeMode } = useApplicationContext();
  const { account } = useAccountContext();
  const { showNotification } = useNotificationContext();
  const { isConnected: isKaddexWalletConnected, requestSign: kaddexWalletRequestSign } = useKaddexWalletContext();
  const toastId = React.useRef(null);

  const history = useHistory();
  const [daoSingleProposalLoading, setDaoSingleProposalLoading] = useState(false);
  const [daoFetchDataLoading, setDaoFetchDataLoading] = useState(false);

  const [singleProposalData, setSingleProposalData] = useState({});
  const [accountVoted, setAccountVoted] = useState({});

  const fetchData = async () => {
    const readSingleProposalRes = await readSingleProposal(proposal_id);
    setSingleProposalData(readSingleProposalRes);

    const checkAccountHasVoted = await hasAccountVoted(account.account, proposal_id);
    setAccountVoted(checkAccountHasVoted);

    setDaoSingleProposalLoading(false);
  };

  useEffect(() => {
    setDaoSingleProposalLoading(true);
    fetchData();
  }, [account, daoFetchDataLoading]);

  const pollingNotif = (reqKey) => {
    toastId.current = showNotification({
      title: 'Vote Pending! Do not refresh the page',
      // message: ' the vote is in the registration phase',
      type: STATUSES.INFO,
      closeOnClick: false,
      hideProgressBar: false,
      onClick: async () => {
        window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${reqKey}`, '_blank', 'noopener,noreferrer');
      },
    });
  };

  const handleClick = async (type) => {
    console.log(account);
    const commandToSign = voteCommandToSign(type, proposal_id, account);
    let signedCommand = await getSignedCommand(commandToSign);

    const votePreviewResponse = await votePreview(signedCommand);
    console.log('votePreview -> votePreviewResponse', votePreviewResponse);

    if (votePreviewResponse?.result?.status === 'success') {
      setDaoFetchDataLoading(true);
      const res = await vote(signedCommand, pollingNotif);

      if (res?.listen === 'success') {
        toast.dismiss(toastId.current);
        showNotification({
          title: 'Transaction Success!',
          message: 'Check it out in the block explorer',
          type: STATUSES.SUCCESS,
          onClick: async () => {
            await window.open(`https://explorer.chainweb.com/${NETWORK_TYPE}/tx/${res?.data.requestKeys[0]}`, '_blank', 'noopener,noreferrer');
          },
          autoClose: 10000,
        });
        setDaoSingleProposalLoading(false);
        setDaoFetchDataLoading(false);
      } else {
        toast.dismiss(toastId.current);
        showNotification({
          title: 'Transaction Failed!',
          // message: 'Check it out in the block explorer',
          type: STATUSES.ERROR,
          autoClose: 5000,
        });
        setDaoFetchDataLoading(false);
        setDaoSingleProposalLoading(false);
      }
    } else {
      showNotification({
        title: 'Vote Error',
        message: votePreviewResponse?.result?.error?.message,
        type: STATUSES.ERROR,
      });
    }
  };

  const getSignedCommand = async (commandToSign) => {
    try {
      if (isKaddexWalletConnected) {
        const res = await kaddexWalletRequestSign(commandToSign);
        return res.signedCmd;
      } else {
        const res = await Pact.wallet.sign(commandToSign);
        return res;
      }
    } catch (error) {
      return null;
    }
  };

  const ColumnLabels = ({ title, description }) => (
    <FlexContainer className="column" gap={4}>
      <Label fontSize={13} labelStyle={{ opacity: 0.7 }}>
        {title}
      </Label>
      <Label fontSize={13}>{description}</Label>
    </FlexContainer>
  );

  return daoSingleProposalLoading ? (
    <AppLoader containerStyle={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
  ) : (
    <>
      <Label fontSize={24} fontFamily="syncopate">
        <ArrowBack
          style={{
            cursor: 'pointer',
            color: theme(themeMode).colors.white,
            marginRight: '15px',
            justifyContent: 'center',
          }}
          onClick={() => history.push(ROUTE_DAO)}
        />
        back to proposals
      </Label>
      <FlexContainer className="row" gap={16} mobileClassName="column-reverse" mobileStyle={{ paddingBottom: 16 }}>
        <FlexContainer className="column" withGradient style={{ height: 'min-content' }} desktopStyle={{ flex: 1, maxHeight: 550 }}>
          <PartialScrollableScrollSection id="proposals-list" className="scrollbar-none" style={{ width: '100%' }}>
            <FlexContainer className="column" gap={16}>
              <FlexContainer className="justify-sb align-ce w-100">
                <Label fontSize={24}>{singleProposalData?.title}</Label>
                <Label
                  fontFamily="basier"
                  fontSize={10}
                  labelStyle={{
                    backgroundColor:
                      moment(singleProposalData['start-date']?.time) <= moment() && moment(singleProposalData['end-date']?.time) >= moment()
                        ? commonColors.active
                        : commonColors.closed,
                    borderRadius: 100,
                    padding: '2px 8px',
                  }}
                >
                  {getStatusProposal(singleProposalData)}
                </Label>
              </FlexContainer>
              <FlexContainer className="justify-sb align-ce w-100" mobileClassName="grid" columns={2}>
                <ColumnLabels title="Author" description={singleProposalData?.account} />
                <ColumnLabels title="Start Date" description={moment(singleProposalData['start-date']?.time).format('LLL')} />
                <ColumnLabels title="End Date" description={moment(singleProposalData['end-date']?.time).format('LLL')} />
                <ColumnLabels title="Voting System" description="Single choice voting" />
              </FlexContainer>
              <ColumnLabels title="Description" description={singleProposalData?.description} />
              {!daoFetchDataLoading ? (
                <ColumnLabels
                  title="Vote Result"
                  description={
                    <VoteResultsContainer
                      onClickYes={() => handleClick('approved')}
                      onClickNo={() => handleClick('refused')}
                      proposalData={singleProposalData}
                      hasVoted={accountVoted[0]?.action ? accountVoted[0]?.action : ''}
                    />
                  }
                />
              ) : (
                <Loader />
              )}
            </FlexContainer>
          </PartialScrollableScrollSection>
        </FlexContainer>
        <FlexContainer className="column" gap={16}>
          <VotingPowerContainer accountData={accountData} />
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default SingleProposalContainer;
