import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { parseBZWDocument } from '../Document/parseBZWDocument';
import { documentState } from '../atoms';

// @ts-ignore
import hix from '../assets/hix.bzw';

const HixDocumentLoader = () => {
  const setDocument = useSetRecoilState(documentState);

  useEffect(() => {
    fetch(hix)
      .then((res) => res.text())
      .then((body) => setDocument(parseBZWDocument(body)));
  }, [setDocument]);

  return <div />;
};

export default HixDocumentLoader;
