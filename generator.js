module.exports = (api) => {
	api.postProcessFiles(files => {
		const REGEX_SPACE_INDENT = /^(  )+/gm
		const REGEX_TWO_SPACES = /  /g

		const tabPerTwoSpaces = (spaces) => {
			return spaces.replace(REGEX_TWO_SPACES, '	')
		}

		let madeChanges = false
		for (const fileName in files) {
			const fileString = files[fileName]
			if (typeof fileString !== 'string') {
				continue
			}
			const resultString = fileString.replace(REGEX_SPACE_INDENT, tabPerTwoSpaces)
			if (resultString !== fileString) {
				console.log(`Converted ${fileName} to tab indentation.`)
				madeChanges = true
				files[fileName] = resultString
			}
		}
		if (!madeChanges) {
			console.log('No files were found with 2-space indentation!')
		}
	})
}
