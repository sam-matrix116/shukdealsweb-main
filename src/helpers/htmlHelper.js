import React from 'react';

const RenderHTMLstring = ({ htmlString }) => {
	return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

export { RenderHTMLstring };
