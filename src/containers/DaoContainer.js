/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FlexContainer } from '../components/shared/FlexContainer';
import AllProposalsContainer from '../components/dao/AllProposalsContainer';
import SingleProposalContainer from '../components/dao/SingleProposalContainer';
import { useAccountContext } from '../contexts';
import { getAccountData } from '../api/dao';

const DaoContainer = () => {
  const { proposal_id } = useParams();
  const { account } = useAccountContext();

  const [loading, setLoading] = useState(false);
  const [accountData, setAccountData] = useState({});

  const fetchData = async () => {
    const getAccountDataRes = await getAccountData(account.account);
    setAccountData(getAccountDataRes);

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [account]);

  return (
    <FlexContainer className="column" gap={16} desktopStyle={{ padding: '60px 88px 30px' }}>
      {proposal_id ? (
        <SingleProposalContainer proposal_id={proposal_id} accountData={accountData} />
      ) : (
        <AllProposalsContainer accountData={accountData} />
      )}
    </FlexContainer>
  );
};

export default DaoContainer;
