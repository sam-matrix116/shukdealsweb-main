const BlobToFileConverter = (theBlob) => {
	const myFile = new File([theBlob], theBlob.name, {
		type: theBlob.type,
	});
	return myFile;
};

function blobsToFiles(blobArray) {
	const fileArray = [];
	for (let i = 0; i < blobArray?.length; i++) {
		const res = BlobToFileConverter(blobArray[i]);
		fileArray.push(res);
	}

	return fileArray;
}

const base64ToFile = ({ base64, fileName, fileType }) => {
	const bytes = window.atob(base64.replace(/^data:image\/[a-z]+;base64,/, ''));

	const new_char = new Array(bytes.length);
	for (let i = 0; i < new_char.length; i++) {
		new_char[i] = bytes.charCodeAt(i);
	}

	const byteArray = new Uint8Array(new_char);

	let blob = new Blob([byteArray], { type: fileType });
	let file = new File([blob], fileName, { type: fileType });
	return file;
};

const saveFilesLocalStorage = async (name, fileArray) => {
	try {
		const base64Array = await Promise.all(
			fileArray.map(async (imageFile) => {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result);
					reader.onerror = (error) => reject(error);
					reader.readAsDataURL(imageFile);
				});
			})
		);

		const base64StringArray = JSON.stringify(base64Array);
		localStorage.setItem(name, base64StringArray);
		console.log('Image array converted and saved successfully.');
	} catch (error) {
		console.log('Error converting image array to base64:', error);
	}
};

const getFilesFromLocalStorage = (name) => {
	const base64ArrayString = localStorage.getItem(name);

	if (!base64ArrayString) {
		return [];
	}

	try {
		const base64Array = JSON.parse(base64ArrayString);
		const imageArray = base64Array.map((base64String) => {
			const binaryString = window.atob(base64String.split(',')[1]);
			const byteArray = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				byteArray[i] = binaryString.charCodeAt(i);
			}
			return new Blob([byteArray], { type: 'image/jpeg' });
		});
		console.log('imageArray', imageArray);
		return imageArray;
	} catch (error) {
		console.log('Error converting base64 to image array:', error);
		return [];
	}
};

export {
	BlobToFileConverter,
	base64ToFile,
	saveFilesLocalStorage,
	getFilesFromLocalStorage,
};
