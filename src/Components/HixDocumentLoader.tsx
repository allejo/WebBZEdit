// @ts-ignore
import hix from '../assets/hix.bzw?url';

import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { loadBZWDocument } from '../Document/loadBZWDocument';
import { documentState } from '../atoms';

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
