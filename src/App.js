import { useState, useEffect } from 'react';
import FileImport from "./components/FileImport.jsx";
import AssetParser from './services/AssetParser.js';

function Hierarchy({ go, indent = 0  }) {
	if (go === undefined || go.length === 0) return '';
	const indentation = indent === 0 ? '' : Array(indent).join('|   ') + '|--';
	return (
		<div>
			{indentation}
			{go.name}
			{go.children !== undefined ?
				go.children.filter(child => child.name !== undefined)
					.map((child) => (
					<Hierarchy key={child.id} go={child} indent={indent + 1} />
				)) : ''
			}
		</div>
	);
}
function App() {
	var [fileContent, setFileContent] = useState('');
	var [hierarchy, setHierarchy] = useState([]);

	useEffect(() => {
		setFileContent(fileContent);
		setHierarchy(AssetParser.parseAsset(fileContent));
	}, [fileContent]);

    return (
		<div style={{whiteSpace: 'pre'}}>
			<FileImport setFileContent={setFileContent} />
			<br />
			{hierarchy.map(go => (
				<Hierarchy key={go.id} go={go} />
			))}
		</div>
    );
}

export default App;
