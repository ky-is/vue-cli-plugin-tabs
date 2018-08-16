module.exports = (api) => {
	const REGEX_SPACE_INDENTS = /^( {2})+/gm
	const REGEX_TWO_SPACES = / {2}/g
	const PACKAGE_JSON = 'package.json'

	const replaceAllTwoSpacesWithTab = (spaces) => {
		return spaces.replace(REGEX_TWO_SPACES, '\t')
	}

	const convertFileIndentation = (fileString) => {
		const resultString = fileString.replace(REGEX_SPACE_INDENTS, replaceAllTwoSpacesWithTab)
		return resultString !== fileString ? resultString : null
	}

	let convertedFiles = []

	api.postProcessFiles(files => {
		for (const fileName in files) {
			if (fileName === PACKAGE_JSON) {
				continue
			}
			const fileString = files[fileName]
			if (typeof fileString !== 'string') {
				continue
			}
			const resultString = convertFileIndentation(fileString)
			if (resultString) {
				files[fileName] = resultString
				convertedFiles.push(fileName)
			}
		}
	})

	api.onCreateComplete(() => {
		const fs = require('fs')
		const pathToPackageJson = api.resolve(PACKAGE_JSON)
		const fileString = fs.readFileSync(PACKAGE_JSON, 'utf-8')
		const resultString = convertFileIndentation(fileString)
		if (resultString) {
			fs.writeFileSync(pathToPackageJson, resultString, 'utf-8')
			convertedFiles.push(PACKAGE_JSON)
		}
		const confirmationMessage = convertedFiles.length
			? `Converted indentation: ${convertedFiles.join(', ')}`
			: 'No files were found with 2-space indentation!'
		api.exitLog(confirmationMessage, 'done')
	})
}
