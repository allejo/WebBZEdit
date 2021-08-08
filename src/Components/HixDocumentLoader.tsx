import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { loadBZWDocument } from '../Document/loadBZWDocument';
import { documentState } from '../atoms';

// @ts-ignore
import hix from '../assets/hix.bzw';

const HixDocumentLoader = () => {
  const setDocument = useSetRecoilState(documentState);

  useEffect(() => {
    fetch(hix)
      .then((res) => res.text())
      .then((body) => setDocument(loadBZWDocument(body)));
  }, [setDocument]);

  return <div />;
};

export default HixDocumentLoader;
