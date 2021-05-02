import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { documentState } from '../atoms';
import { BZWDocument } from '../Document/BZWDocument';

import hix from '../assets/hix.bzw';

const HixDocumentLoader = () => {
  const setDocument = useSetRecoilState(documentState);

  useEffect(() => {
    fetch(hix)
      .then((res) => res.text())
      .then((body) => setDocument(new BZWDocument(body)));
  }, [setDocument]);

  return <div />;
};

export default HixDocumentLoader;
