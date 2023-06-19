function FileImport({ setFileContent }) {
    const handleDrop = (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = (e) => setFileContent(e.target.result);;
        reader.readAsText(e.dataTransfer.files[0]);
    };
    const handleDragOver = (e) => e.preventDefault();

    return (
        <>
            <input type="file"
                accept=".prefab"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onChange={handleDragOver} />
        </>
    );
}

export default FileImport;