// @ts-ignore
import hix from '../assets/hix.bzw?url';

import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { documentState } from '../atoms';
import { loadBZWDocument } from '../Document/loadBZWDocument';

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
